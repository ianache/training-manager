import { LevelCode, RoleBody, RoleDetail } from '../../data-access/catalog.models';

/**
 * Lógica pura del formulario de rol (SCR-001-02, API-SPEC-003): del detalle al formulario, del formulario
 * al cuerpo de la API, validación en el cliente y mensajes de los errores del servicio. El servicio vuelve a
 * validar todo; esto solo evita viajes inútiles y explica qué corregir.
 */

export interface FormCompetency {
  competencyId: string;
  name: string;
  versionId: string;
  versionNumber: number;
  requiredLevel: LevelCode | '';
  /** Falso si existe una versión aprobada posterior (EVD-2026-0143). */
  isCurrent: boolean;
  suggestedVersionId: string | null;
}

export interface FormLevel {
  /** Ausente en un nivel nuevo, aún no guardado. */
  id?: string;
  name: string;
  ordinal: number;
  status: 'ACTIVE' | 'INACTIVE';
  competencies: FormCompetency[];
}

export interface RoleForm {
  name: string;
  description: string;
  levels: FormLevel[];
}

export const NAME_MAX = 120;
export const LEVEL_NAME_MAX = 80;
export const DESCRIPTION_MAX = 500;

export const emptyForm = (): RoleForm => ({ name: '', description: '', levels: [emptyLevel(1)] });

export const emptyLevel = (ordinal: number): FormLevel => ({ name: '', ordinal, status: 'ACTIVE', competencies: [] });

export function fromDetail(role: RoleDetail): RoleForm {
  return {
    name: role.name,
    description: role.description ?? '',
    levels: role.levels.map((l) => ({
      id: l.id,
      name: l.name,
      ordinal: l.ordinal,
      status: l.status,
      competencies: l.competencies.map((c) => ({
        competencyId: c.competency_id,
        name: c.name,
        versionId: c.version.id,
        versionNumber: c.version.version_number,
        requiredLevel: c.required_level,
        isCurrent: c.is_current,
        suggestedVersionId: c.suggested_version_id,
      })),
    })),
  };
}

export function toBody(form: RoleForm): RoleBody {
  return {
    name: form.name.trim(),
    description: form.description.trim() || null,
    levels: form.levels.map((l) => ({
      ...(l.id ? { id: l.id } : {}),
      name: l.name.trim(),
      ordinal: l.ordinal,
      competencies: l.competencies.map((c) => ({
        competency_id: c.competencyId,
        version_id: c.versionId,
        required_level: c.requiredLevel as LevelCode,
      })),
    })),
  };
}

/** Errores por campo. Claves: `name`, `description`, `levels`, `level.<i>.name`, `level.<i>.competencies`, `level.<i>.c.<j>`. */
export type FormErrors = Record<string, string>;

/** Textos de SCR-001-02 / GEN-001-G. Los marcados «propuesto» en la especificación no tienen fuente (SCR-001-Q2). */
export const MESSAGES = {
  nameRequired: 'Escribe el nombre del rol.',
  nameTooLong: `El nombre no puede pasar de ${NAME_MAX} caracteres.`,
  nameDuplicated: 'Ya existe un rol con ese nombre',
  descriptionTooLong: `La descripción no puede pasar de ${DESCRIPTION_MAX} caracteres.`,
  levelsRequired: 'El rol necesita al menos un nivel.',
  levelNameRequired: 'Escribe el nombre del nivel.',
  levelNameTooLong: `El nombre del nivel no puede pasar de ${LEVEL_NAME_MAX} caracteres.`,
  levelNameDuplicated: 'Dos niveles no pueden llamarse igual.',
  competenciesRequired: 'Este nivel no tiene ninguna competencia asignada. Agrega al menos una competencia.',
  competencyRequired: 'Elige la competencia.',
  requiredLevelRequired: 'Elige el nivel esperado de la competencia',
  competencyDuplicated: 'Esta competencia ya está en este nivel',
  blockedDetail: 'Existen discrepancias en la matriz de descriptores requeridos antes de confirmar los cambios.',
} as const;

export function validate(form: RoleForm): FormErrors {
  const e: FormErrors = {};
  const name = form.name.trim();
  if (!name) e['name'] = MESSAGES.nameRequired;
  else if (name.length > NAME_MAX) e['name'] = MESSAGES.nameTooLong;
  if (form.description.trim().length > DESCRIPTION_MAX) e['description'] = MESSAGES.descriptionTooLong;
  if (form.levels.length === 0) e['levels'] = MESSAGES.levelsRequired;

  const seen = new Map<string, number>();
  form.levels.forEach((l, i) => {
    const n = l.name.trim();
    if (!n) e[`level.${i}.name`] = MESSAGES.levelNameRequired;
    else if (n.length > LEVEL_NAME_MAX) e[`level.${i}.name`] = MESSAGES.levelNameTooLong;
    else if (seen.has(n.toLowerCase())) e[`level.${i}.name`] = MESSAGES.levelNameDuplicated;
    seen.set(n.toLowerCase(), i);

    if (l.competencies.length === 0) e[`level.${i}.competencies`] = MESSAGES.competenciesRequired;
    const ids = new Set<string>();
    l.competencies.forEach((c, j) => {
      if (!c.competencyId) e[`level.${i}.c.${j}`] = MESSAGES.competencyRequired;
      else if (ids.has(c.competencyId)) e[`level.${i}.c.${j}`] = MESSAGES.competencyDuplicated;
      else if (!c.requiredLevel) e[`level.${i}.c.${j}`] = MESSAGES.requiredLevelRequired;
      ids.add(c.competencyId);
    });
  });
  return e;
}

/** Qué le pasó al guardar y qué puede hacer. */
export interface SaveProblem {
  message: string;
  /** Otra persona editó antes (412): hay que recargar. */
  conflict: boolean;
  /** Campo del formulario al que pertenece el error (se muestra junto al campo, no en un aviso). */
  field?: 'name';
  /** El nivel esperado de una competencia no tiene requisitos de evidencia (422): bloquea guardar. */
  blocked?: { competencyId: string; requiredLevel: string };
}

/** Los textos de los errores del servicio son propuestos (SCR-001-Q2 pendiente de revisión humana). */
export function describeSaveError(status: number, body: unknown): SaveProblem {
  const error = (body as { error?: { code?: string; message?: string; details?: Record<string, unknown> } } | null)?.error;
  const code = error?.code ?? '';
  switch (code) {
    case 'PRECONDITION_FAILED':
      return { message: 'Otra persona modificó este rol.', conflict: true };
    case 'ROLE_NAME_DUPLICATE':
      return { message: MESSAGES.nameDuplicated, conflict: false, field: 'name' };
    case 'COMPETENCY_DUPLICATED':
      return { message: MESSAGES.competencyDuplicated, conflict: false };
    case 'COMPETENCY_INACTIVE':
      return { message: error?.message ?? 'La competencia elegida está inactiva.', conflict: false };
    case 'EVIDENCE_REQUIREMENTS_MISSING': {
      const d = error?.details ?? {};
      const blocked =
        typeof d['competency_id'] === 'string' && typeof d['required_level'] === 'string'
          ? { competencyId: d['competency_id'], requiredLevel: d['required_level'] }
          : undefined;
      return {
        message: error?.message ?? 'Primero hay que definir cómo se evidencia el nivel esperado de la competencia.',
        conflict: false,
        blocked,
      };
    }
    case 'LEVEL_CONFLICT':
      return { message: 'Otro nivel del rol ya usa ese nombre u orden.', conflict: false };
    case 'AUTHORIZATION_FAILED':
      return { message: 'No tienes permiso para modificar roles.', conflict: false };
    case 'VALIDATION_ERROR':
      return { message: error?.message ?? 'Los datos del rol no son válidos.', conflict: false };
    default:
      return status === 0 || status >= 500
        ? { message: 'No se pudo guardar el rol. Tus cambios siguen aquí; vuelve a intentarlo.', conflict: false }
        : { message: error?.message ?? 'No se pudo guardar el rol.', conflict: false };
  }
}

/** «Acción bloqueada: Primero define cómo se evidencia el nivel L3 de Pruebas unitarias» (SCR-001-02, estado B). */
export function blockedMessage(form: RoleForm, blocked: { competencyId: string; requiredLevel: string }): string {
  const name = form.levels.flatMap((l) => l.competencies).find((c) => c.competencyId === blocked.competencyId)?.name;
  return `Acción bloqueada: Primero define cómo se evidencia el nivel ${blocked.requiredLevel} de ${name ?? 'la competencia'}`;
}

/** Cantidad de problemas de un nivel («2 incidencias»). */
export function incidents(errors: FormErrors, levelIndex: number): number {
  return Object.keys(errors).filter((k) => k.startsWith(`level.${levelIndex}.`)).length;
}

/** «Hoy, por jefe.ingenieria» o «04/10/2026, por …» según la última modificación (o la creación). */
export function lastModified(
  role: { updated_at: string | null; updated_by: string | null; created_at: string; created_by: string },
  now = new Date(),
): string {
  const when = new Date(role.updated_at ?? role.created_at);
  const who = role.updated_by ?? role.created_by;
  const same = when.toDateString() === now.toDateString();
  return `${same ? 'Hoy' : when.toLocaleDateString('es-PE')}, por ${who}`;
}

/** «1 competencia», «3 competencias». */
export const competenciesText = (n: number): string => `${n} ${n === 1 ? 'competencia' : 'competencias'}`;
/** «1 incidencia», «2 incidencias». */
export const incidentsText = (n: number): string => `${n} ${n === 1 ? 'incidencia' : 'incidencias'}`;
