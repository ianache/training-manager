/**
 * Reglas puras del asistente «Registrar un colaborador» (US-015, FLW-015, AC-015).
 * Sin Angular: se prueban con vitest sin TestBed.
 */
import { HttpErrorResponse } from '@angular/common/http';

export type CollaboratorType = 'Employee' | 'Contractor';

export type StepId = 'tipo' | 'datos' | 'identificacion' | 'correo' | 'organizacion' | 'jefe' | 'rol' | 'revisar';

/** Pasos del flujo: el contratista no tiene «Jefe directo» (BR-PTY-19). */
export const STEPS_BY_TYPE: Record<CollaboratorType, StepId[]> = {
  Employee: ['tipo', 'datos', 'identificacion', 'correo', 'organizacion', 'jefe', 'rol', 'revisar'],
  Contractor: ['tipo', 'datos', 'identificacion', 'correo', 'organizacion', 'rol', 'revisar'],
};

export const STEP_TITLE: Record<StepId, (t: CollaboratorType | null) => string> = {
  tipo: () => 'Registrar un colaborador',
  datos: () => 'Datos de la persona',
  identificacion: () => 'Identificación',
  correo: () => 'Correo laboral',
  organizacion: (t) => (t === 'Contractor' ? 'Proveedor' : 'Unidad organizacional'),
  jefe: () => 'Jefe directo',
  rol: () => 'Rol-Nivel inicial',
  revisar: () => 'Revisar y confirmar',
};

export const TYPE_LABEL: Record<CollaboratorType, string> = { Employee: 'Empleado', Contractor: 'Contratista' };

export const ID_TYPES: ReadonlyArray<{ value: IdType; label: string; short: string }> = [
  { value: 'DNI', label: 'DNI', short: 'DNI' },
  { value: 'CE', label: 'Carné de extranjería', short: 'CE' },
  { value: 'Passport', label: 'Pasaporte', short: 'Pasaporte' },
];
export type IdType = 'DNI' | 'CE' | 'Passport';

/** País emisor → código ISO 3166-1 alfa-2 (lo que exige el servicio, `identification_country`). */
export const COUNTRIES: ReadonlyArray<{ code: string; name: string }> = [
  { code: 'PE', name: 'Perú' },
  { code: 'AR', name: 'Argentina' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'BR', name: 'Brasil' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'US', name: 'Estados Unidos' },
  { code: 'ES', name: 'España' },
  { code: 'MX', name: 'México' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'VE', name: 'Venezuela' },
];

export interface Option {
  id: string;
  label: string;
  sublabel?: string;
}

export interface LevelOption {
  id: string;
  label: string;
  /** Requisitos de evidencia definidos (BR-ACR-13); 0 = nivel no elegible (E8). */
  evidenceCount: number;
}
export interface RoleOption {
  id: string;
  label: string;
  levels: LevelOption[];
}

export interface WizardData {
  type: CollaboratorType | null;
  firstNames: string;
  lastNames: string;
  preferredName: string;
  idType: IdType;
  idNumber: string;
  idCountry: string;
  email: string;
  organization: Option | null;
  manager: Option | null;
  role: RoleOption | null;
  levelId: string;
  fromDate: string;
}

export function emptyData(today: string = todayIso()): WizardData {
  return {
    type: null,
    firstNames: '',
    lastNames: '',
    preferredName: '',
    idType: 'DNI',
    idNumber: '',
    idCountry: 'PE',
    email: '',
    organization: null,
    manager: null,
    role: null,
    levelId: '',
    fromDate: today,
  };
}

export function todayIso(d: Date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function stepsFor(type: CollaboratorType | null): StepId[] {
  return STEPS_BY_TYPE[type ?? 'Employee'];
}

// ---------------------------------------------------------------- validación por campo

export const REQUIRED = 'Requerido';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateName(v: string): string | null {
  const t = v.trim();
  if (!t) return REQUIRED;
  if (t.length > 100) return 'Máximo 100 caracteres';
  return null;
}

export function validatePreferred(v: string): string | null {
  return v.trim().length > 100 ? 'Máximo 100 caracteres' : null;
}

/** DNI: 8 dígitos. CE y pasaporte: 5–20 letras, dígitos o guion (VARCHAR(20) de PDM-001). */
export function validateIdNumber(type: IdType, v: string): string | null {
  const t = v.trim();
  if (!t) return REQUIRED;
  if (type === 'DNI') return /^\d{8}$/.test(t) ? null : 'El DNI debe tener 8 dígitos';
  return /^[A-Za-z0-9-]{5,20}$/.test(t) ? null : 'Usa de 5 a 20 letras, números o guiones';
}

export function validateEmail(v: string): string | null {
  const t = v.trim();
  if (!t) return REQUIRED;
  return EMAIL_RE.test(t) ? null : 'Ingresa un correo válido';
}

export type CheckState = 'idle' | 'validating' | 'valid' | 'duplicate' | 'unknown';

export interface StepContext {
  emailCheck: CheckState;
  /** E5 devuelto por el servicio al guardar para la identificación actual. */
  idConflict: boolean;
  /** E7: el jefe elegido dejó de estar vigente. */
  managerStale: boolean;
  organizationStale: boolean;
}

export const NO_CONTEXT: StepContext = { emailCheck: 'idle', idConflict: false, managerStale: false, organizationStale: false };

/** Mensajes por campo del paso (clave = nombre de campo). Vacío = el paso es válido. */
export function stepErrors(step: StepId, d: WizardData, ctx: StepContext = NO_CONTEXT): Record<string, string> {
  const e: Record<string, string> = {};
  const put = (k: string, m: string | null) => { if (m) e[k] = m; };
  switch (step) {
    case 'tipo':
      if (!d.type) e['type'] = REQUIRED;
      break;
    case 'datos':
      put('firstNames', validateName(d.firstNames));
      put('lastNames', validateName(d.lastNames));
      put('preferredName', validatePreferred(d.preferredName));
      break;
    case 'identificacion':
      put('idNumber', validateIdNumber(d.idType, d.idNumber));
      if (!d.idCountry) e['idCountry'] = REQUIRED;
      if (!e['idNumber'] && ctx.idConflict) e['idNumber'] = 'duplicate';
      break;
    case 'correo':
      put('email', validateEmail(d.email));
      if (!e['email'] && ctx.emailCheck === 'duplicate') e['email'] = 'duplicate';
      if (!e['email'] && ctx.emailCheck === 'validating') e['email'] = 'validating';
      break;
    case 'organizacion':
      if (!d.organization) e['organization'] = REQUIRED;
      else if (ctx.organizationStale) e['organization'] = 'stale';
      break;
    case 'jefe':
      if (!d.manager) e['manager'] = REQUIRED;
      else if (ctx.managerStale) e['manager'] = 'stale';
      break;
    case 'rol': {
      if (!d.role) e['role'] = REQUIRED;
      const level = d.role?.levels.find((l) => l.id === d.levelId);
      if (d.role && !d.levelId) e['level'] = REQUIRED;
      else if (d.role && (!level || level.evidenceCount < 1)) e['level'] = 'invalid';
      if (!d.fromDate || !/^\d{4}-\d{2}-\d{2}$/.test(d.fromDate)) e['fromDate'] = REQUIRED;
      break;
    }
    case 'revisar':
      for (const s of stepsFor(d.type)) {
        if (s !== 'revisar' && Object.keys(stepErrors(s, d, ctx)).length) e[s] = REQUIRED;
      }
      break;
  }
  return e;
}

export function isStepValid(step: StepId, d: WizardData, ctx: StepContext = NO_CONTEXT): boolean {
  return Object.keys(stepErrors(step, d, ctx)).length === 0;
}

/** Etiquetas de campo para la lista de E9 («Por favor completa los campos requeridos: …»). */
export const FIELD_LABEL: Record<string, string> = {
  type: 'Tipo de colaborador',
  firstNames: 'Nombres',
  lastNames: 'Apellidos',
  idNumber: 'Número de identificación',
  idCountry: 'País emisor',
  email: 'Correo laboral',
  organization: 'Unidad o proveedor',
  manager: 'Jefe directo',
  role: 'Rol',
  level: 'Nivel inicial',
  fromDate: 'Vigente desde',
};

// ---------------------------------------------------------------- servicio (API-SPEC-001 §3.1)

/** Cuerpo exacto de POST /api/v1/parties (PartyCreateRequest, extra="forbid"). */
export interface CreatePartyBody {
  first_names: string;
  last_names: string;
  preferred_name?: string;
  identification_type: IdType;
  identification_number: string;
  identification_country: string;
  email_work: string;
  party_type: 'Employee' | 'Contractor';
}

export function buildCreateBody(d: WizardData): CreatePartyBody {
  if (!d.type) throw new Error('Tipo de colaborador requerido');
  const body: CreatePartyBody = {
    first_names: d.firstNames.trim(),
    last_names: d.lastNames.trim(),
    identification_type: d.idType,
    identification_number: d.idNumber.trim(),
    identification_country: d.idCountry,
    email_work: d.email.trim(),
    party_type: d.type,
  };
  const preferred = d.preferredName.trim();
  if (preferred) body.preferred_name = preferred;
  return body;
}

export type SubmitErrorKind = 'E1' | 'E5' | 'E6' | 'E9' | 'E10' | 'E11';
export interface SubmitError {
  kind: SubmitErrorKind;
  message: string;
  /** X-Request-ID / request_id del error, para soporte (E10). */
  code?: string;
  /** Paso al que se vuelve para corregir (E5 → identificación, E6 → correo). */
  step?: StepId;
}

export function idDuplicateMessage(d: Pick<WizardData, 'idType' | 'idNumber' | 'idCountry'>): string {
  const country = COUNTRIES.find((c) => c.code === d.idCountry)?.name ?? d.idCountry;
  const typeLabel = ID_TYPES.find((t) => t.value === d.idType)?.short ?? d.idType;
  return `La identificación ${typeLabel} ${d.idNumber.trim()} (${country}) ya está registrada.`;
}

export function emailDuplicateMessage(email: string): string {
  return `El correo ${email.trim()} ya está en uso por otro colaborador vigente.`;
}

/** Ids de ayuda/mensaje que <gf-form-field> publica, para aria-describedby del control. */
export function describedBy(id: string, hint: boolean, message: boolean, extra = ''): string {
  return [hint ? `${id}-hint` : '', message ? `${id}-msg` : '', extra].filter(Boolean).join(' ');
}

/** Mapea la respuesta de error del servicio a las excepciones E1–E11 de FLW-015. */
export function mapSubmitError(err: unknown, d: Pick<WizardData, 'idType' | 'idNumber' | 'idCountry' | 'email'>): SubmitError {
  const http = err instanceof HttpErrorResponse ? err : null;
  const body = (http?.error ?? {}) as { error?: { code?: string; request_id?: string } };
  const apiCode = body.error?.code;
  const requestId = body.error?.request_id ?? http?.headers?.get('X-Request-ID') ?? undefined;

  if (http?.status === 401) {
    return { kind: 'E11', message: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.' };
  }
  if (http?.status === 403) {
    return { kind: 'E1', message: 'No tienes permiso para registrar colaboradores. Solo el Jefe de Ingeniería puede hacerlo.' };
  }
  if (apiCode === 'IDENTIFICATION_DUPLICATE') {
    return { kind: 'E5', step: 'identificacion', message: idDuplicateMessage(d) };
  }
  if (apiCode === 'EMAIL_DUPLICATE') {
    return { kind: 'E6', step: 'correo', message: emailDuplicateMessage(d.email) };
  }
  if (http?.status === 400 || apiCode === 'VALIDATION_ERROR') {
    return { kind: 'E9', message: 'Por favor completa los campos requeridos.', code: requestId };
  }
  return { kind: 'E10', message: 'Hubo un problema al registrar. Por favor intenta nuevamente.', code: requestId };
}

export const E_MESSAGES = {
  E2: 'No hay unidades registradas. Crea una primero (US-017).',
  E3: 'No hay proveedores registrados. Crea uno primero (US-018).',
  E4: 'No hay roles vigentes en el catálogo. Crea el catálogo primero (US-001).',
  E7_UNIT: 'La unidad ya no está vigente. Elige otra.',
  E7_PROVIDER: 'El proveedor ya no está vigente. Elige otro.',
  E7_MANAGER: 'El jefe directo ya no está vigente. Elige otro.',
  E8: 'El rol o nivel no es válido. Asegúrate de que existe en el catálogo vigente.',
} as const;
