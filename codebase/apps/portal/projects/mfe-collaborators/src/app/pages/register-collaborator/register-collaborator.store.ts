import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, catchError, debounceTime, map, of, switchMap } from 'rxjs';
import { PartyDetail } from '../../data-access/party.models';
import { RegisterCollaboratorApi } from './register-collaborator.api';
import {
  CheckState,
  CollaboratorType,
  StepId,
  SubmitError,
  WizardData,
  buildCreateBody,
  emptyData,
  mapSubmitError,
  stepErrors,
  stepsFor,
  validateEmail,
} from './register-collaborator.rules';

export const EMAIL_DEBOUNCE_MS = 300;

/**
 * Estado del asistente «Registrar un colaborador». Se provee por página (no es singleton),
 * así «Registrar otro colaborador» parte de un formulario limpio y nada se guarda en el navegador
 * (privacidad, SCR-015: «Datos no se guardan en localStorage»).
 */
@Injectable()
export class RegisterWizardStore {
  private readonly api = inject(RegisterCollaboratorApi);

  readonly data = signal<WizardData>(emptyData());
  readonly stepIndex = signal(0);
  /** Campos que el usuario ya tocó: el error «Requerido» no aparece antes del primer blur. */
  readonly touched = signal<ReadonlySet<string>>(new Set());

  readonly emailCheck = signal<CheckState>('idle');
  readonly idConflict = signal(false);
  readonly managerStale = signal(false);
  readonly organizationStale = signal(false);
  readonly checkingManager = signal(false);

  readonly submitting = signal(false);
  readonly submitError = signal<SubmitError | null>(null);
  readonly result = signal<PartyDetail | null>(null);

  readonly steps = computed<StepId[]>(() => stepsFor(this.data().type));
  readonly step = computed<StepId>(() => this.steps()[Math.min(this.stepIndex(), this.steps().length - 1)]);
  readonly ctx = computed(() => ({
    emailCheck: this.emailCheck(),
    idConflict: this.idConflict(),
    managerStale: this.managerStale(),
    organizationStale: this.organizationStale(),
  }));
  readonly errors = computed(() => stepErrors(this.step(), this.data(), this.ctx()));
  readonly canAdvance = computed(() => Object.keys(this.errors()).length === 0);
  /** 0..1 sobre los pasos de captura (excluye «tipo» y «revisar»). */
  readonly progress = computed(() => {
    const s = this.steps();
    const i = s.indexOf(this.step());
    return i <= 0 ? 0 : Math.min(1, i / (s.length - 1));
  });
  /** Número de paso visible («Paso X de N») para los pasos de captura. */
  readonly stepNumber = computed(() => this.steps().indexOf(this.step()));
  readonly stepTotal = computed(() => this.steps().length - 2);

  private readonly emailQuery$ = new Subject<string>();

  constructor() {
    this.emailQuery$
      .pipe(
        debounceTime(EMAIL_DEBOUNCE_MS),
        switchMap((email) =>
          this.api.emailInUse(email).pipe(
            map((dup): CheckState => (dup ? 'duplicate' : 'valid')),
            catchError(() => of<CheckState>('unknown')),
          ),
        ),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe((state) => {
        // Descarta respuestas de un correo que ya cambió (validando se reinicia al editar).
        if (this.emailCheck() === 'validating') this.emailCheck.set(state);
      });
  }

  patch(partial: Partial<WizardData>): void {
    const before = this.data();
    this.data.set({ ...before, ...partial });
    if ('idType' in partial || 'idNumber' in partial || 'idCountry' in partial) this.idConflict.set(false);
    if ('organization' in partial) this.organizationStale.set(false);
    if ('manager' in partial) this.managerStale.set(false);
    if ('role' in partial && !('levelId' in partial) && partial.role?.id !== before.role?.id) {
      this.data.update((d) => ({ ...d, levelId: '' }));
    }
  }

  setType(type: CollaboratorType): void {
    if (this.data().type === type) return;
    // Unidad/jefe y proveedor vienen de catálogos distintos: no se arrastra la selección.
    this.data.update((d) => ({ ...d, type, organization: null, manager: null }));
    this.organizationStale.set(false);
    this.managerStale.set(false);
  }

  setEmail(email: string): void {
    this.patch({ email });
    this.emailCheck.set('idle');
    if (validateEmail(email) === null) {
      this.emailCheck.set('validating');
      this.emailQuery$.next(email.trim().toLowerCase());
    }
  }

  touch(field: string): void {
    this.touched.update((s) => new Set(s).add(field));
  }
  isTouched(field: string): boolean {
    return this.touched().has(field);
  }

  /** Mensaje de error de un campo, solo después del primer blur. */
  fieldError(field: string): string {
    return this.isTouched(field) ? (this.errors()[field] ?? '') : '';
  }

  next(): void {
    if (!this.canAdvance()) return;
    if (this.step() === 'jefe') {
      this.verifyManagerThenAdvance();
      return;
    }
    this.go(this.stepIndex() + 1);
  }

  back(): void {
    this.submitError.set(null);
    this.go(this.stepIndex() - 1);
  }

  goToStep(step: StepId): void {
    const i = this.steps().indexOf(step);
    if (i >= 0) this.go(i);
  }

  private go(i: number): void {
    this.stepIndex.set(Math.max(0, Math.min(i, this.steps().length - 1)));
  }

  /** E7: el jefe directo pudo perder vigencia desde que se buscó; se confirma al avanzar. */
  private verifyManagerThenAdvance(): void {
    const manager = this.data().manager;
    if (!manager) return;
    this.checkingManager.set(true);
    this.api.getParty(manager.id).subscribe({
      next: (p) => {
        this.checkingManager.set(false);
        if (p.status !== 'active') this.managerStale.set(true);
        else this.go(this.stepIndex() + 1);
      },
      error: () => {
        this.checkingManager.set(false);
        this.go(this.stepIndex() + 1);
      },
    });
  }

  submit(): void {
    if (this.submitting() || this.step() !== 'revisar') return;
    const d = this.data();
    if (Object.keys(stepErrors('revisar', d, this.ctx())).length) return;
    this.submitting.set(true);
    this.submitError.set(null);
    this.api.create(buildCreateBody(d)).subscribe({
      next: (party) => {
        this.submitting.set(false);
        this.result.set(party);
      },
      error: (err: unknown) => {
        this.submitting.set(false);
        const e = mapSubmitError(err, d);
        this.submitError.set(e);
        if (e.kind === 'E5') this.idConflict.set(true);
        if (e.kind === 'E6') this.emailCheck.set('duplicate');
        if (e.step) this.goToStep(e.step);
      },
    });
  }

  reset(): void {
    this.data.set(emptyData());
    this.stepIndex.set(0);
    this.touched.set(new Set());
    this.emailCheck.set('idle');
    this.idConflict.set(false);
    this.managerStale.set(false);
    this.organizationStale.set(false);
    this.submitError.set(null);
    this.result.set(null);
  }
}
