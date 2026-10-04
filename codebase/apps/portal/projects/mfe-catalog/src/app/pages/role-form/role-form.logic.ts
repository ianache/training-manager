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

export const MESSAGES = {
  nameRequired: 'Escribe el nombre del rol.',
  nameTooLong: `El nombre no puede pasar de ${NAME_MAX} caracteres.`,
  descriptionTooLong: `La descripción no puede pasar de ${DESCRIPTION_MAX} caracteres.`,
  levelsRequired: 'El rol necesita al menos un nivel.',
  levelNameRequired: 'Escribe el nombre del nivel.',
  levelNameTooLong: `El nombre del nivel no puede pasar de ${LEVEL_NAME_MAX} caracteres.`,
  levelNameDuplicated: 'Dos niveles no pueden llamarse igual.',
  competenciesRequired: 'Cada nivel necesita al menos una competencia.',
  competencyRequired: 'Elige la competencia.',
  requiredLevelRequired: 'Elige el nivel esperado de la competencia.',
  competencyDuplicated: 'Esta competencia ya está en este nivel.',
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

/** Qué le pasó al guardar y qué puede hacer. `conflict`: otra persona editó antes (412). */
export interface SaveProblem {
  message: string;
  conflict: boolean;
}

/** Los textos de los errores del servicio son propuestos (SCR-001-Q2 pendiente de revisión humana). */
export function describeSaveError(status: number, body: unknown): SaveProblem {
  const error = (body as { error?: { code?: string; message?: string } } | null)?.error;
  const code = error?.code ?? '';
  switch (code) {
    case 'PRECONDITION_FAILED':
      return { message: 'Otra persona modificó este rol. Recarga para ver los cambios.', conflict: true };
    case 'ROLE_NAME_DUPLICATE':
      return { message: 'Ya existe un rol con ese nombre.', conflict: false };
    case 'COMPETENCY_DUPLICATED':
      return { message: MESSAGES.competencyDuplicated, conflict: false };
    case 'COMPETENCY_INACTIVE':
      return { message: error?.message ?? 'La competencia elegida está inactiva.', conflict: false };
    case 'EVIDENCE_REQUIREMENTS_MISSING':
      return { message: error?.message ?? 'Primero hay que definir cómo se evidencia el nivel esperado de la competencia.', conflict: false };
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
