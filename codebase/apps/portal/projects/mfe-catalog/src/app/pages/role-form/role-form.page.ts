import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppRole, SessionService } from '@gf/core';
import {
  AutocompleteOption,
  GfAlert,
  GfAutocomplete,
  GfBadge,
  GfButton,
  GfFormField,
  GfIcon,
  GfSelect,
  GfSpinner,
  GfTextInput,
} from '@gf/ui';
import { Observable, of } from 'rxjs';
import { CatalogApi } from '../../data-access/catalog.api';
import { CompetencySummary, LEVEL_CODES, RoleDetail } from '../../data-access/catalog.models';
import {
  DESCRIPTION_MAX,
  FormCompetency,
  FormErrors,
  FormLevel,
  LEVEL_NAME_MAX,
  MESSAGES,
  NAME_MAX,
  RoleForm,
  SaveProblem,
  blockedMessage,
  competenciesText,
  describeSaveError,
  emptyForm,
  emptyLevel,
  fromDetail,
  incidents,
  incidentsText,
  lastModified,
  toBody,
  validate,
} from './role-form.logic';

type Confirm = { kind: 'cancel' } | { kind: 'deactivate-role' } | { kind: 'level'; index: number; action: 'deactivate' | 'reactivate' };

/** Perfil que se muestra en el modo solo lectura («Perfil activo: Colaborador»), del más al menos amplio. */
const PROFILE_LABEL: [AppRole, string][] = [
  [AppRole.Admin, 'ADMIN'],
  [AppRole.JefeIngenieria, 'Jefe de Ingeniería'],
  [AppRole.ProductOwner, 'Responsable de producto'],
  [AppRole.Direccion, 'Dirección'],
  [AppRole.Gerencia, 'Gerencia'],
  [AppRole.JefeProyecto, 'Jefe de proyecto'],
  [AppRole.Evaluador, 'Evaluador'],
  [AppRole.Colaborador, 'Colaborador'],
];

/**
 * SCR-001-02 — Rol: ver, crear y editar un rol con sus niveles y, por nivel, las competencias con su L esperado
 * (US-001, UXR-001; API-SPEC-003; diseño Stitch GEN-001-G). Estados: predeterminado, errores de validación,
 * versión desactualizada, guardando, guardado, conflicto de concurrencia (412) y solo lectura.
 *
 * Crear o editar: Jefe de Ingeniería, Responsable de producto y ADMIN (BR-CAT-04/05). Desactivar o reactivar un nivel:
 * Jefe de Ingeniería y ADMIN (BR-CAT-30). Se desactiva, no se elimina (EVD-2026-0154, 0174): por eso el diseño
 * «Eliminar nivel» pasa a «Desactivar nivel», y un nivel aún no guardado se quita con «Quitar nivel».
 * Los textos «propuesto» de la especificación (SCR-001-Q2) siguen pendientes de revisión humana.
 */
@Component({
  selector: 'gf-role-form-page',
  imports: [RouterLink, GfAlert, GfAutocomplete, GfBadge, GfButton, GfFormField, GfIcon, GfSelect, GfSpinner, GfTextInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './role-form.page.html',
  styleUrl: './role-form.page.scss',
})
export class RoleFormPage {
  /** Del path param :roleId; ausente en `roles/nuevo`. */
  readonly roleId = input<string | undefined>(undefined);

  private readonly api = inject(CatalogApi);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly levelCodes = LEVEL_CODES;
  protected readonly limits = { name: NAME_MAX, level: LEVEL_NAME_MAX, description: DESCRIPTION_MAX };
  protected readonly competenciesText = competenciesText;
  protected readonly incidentsText = incidentsText;
  protected readonly incidents = incidents;
  protected readonly messages = MESSAGES;

  protected readonly load = signal<'loading' | 'ready' | 'error' | 'notFound'>('loading');
  protected readonly role = signal<RoleDetail | null>(null);
  protected readonly form = signal<RoleForm>(emptyForm());
  protected readonly competencies = signal<CompetencySummary[]>([]);
  protected readonly errors = signal<FormErrors>({});
  protected readonly problem = signal<SaveProblem | null>(null);
  protected readonly saving = signal(false);
  /** Tras guardar se muestra la confirmación con el resumen del rol (estado D.2). */
  protected readonly saved = signal<RoleDetail | null>(null);
  protected readonly dirty = signal(false);
  protected readonly conflict = signal(false);
  protected readonly confirm = signal<Confirm | null>(null);
  /** Competencia elegida en el combobox de cada nivel, a la espera de «Asignar». */
  protected readonly picked = signal<Record<number, AutocompleteOption | null>>({});

  protected readonly isNew = computed(() => !this.roleId());
  protected readonly canEdit = computed(() =>
    this.session.hasAnyRole([AppRole.JefeIngenieria, AppRole.ProductOwner, AppRole.Admin]),
  );
  protected readonly canToggleLevels = computed(() => this.session.hasAnyRole([AppRole.JefeIngenieria, AppRole.Admin]));
  /** Los campos se pueden tocar: hay permiso y no se está guardando ni hay conflicto. */
  protected readonly editable = computed(() => this.canEdit() && !this.saving() && !this.conflict());
  protected readonly byId = computed(() => new Map(this.competencies().map((c) => [c.id, c])));
  protected readonly profile = computed(() => {
    const mine = this.session.roles();
    return PROFILE_LABEL.find(([r]) => mine.includes(r))?.[1] ?? 'Colaborador';
  });
  protected readonly blockedText = computed(() => {
    const b = this.problem()?.blocked;
    return b ? blockedMessage(this.form(), b) : '';
  });
  protected readonly assignments = computed(() => this.saved()?.levels.reduce((n, l) => n + l.competencies.length, 0) ?? 0);
  protected readonly activeLevels = computed(() => this.saved()?.levels.filter((l) => l.status === 'ACTIVE').length ?? 0);

  constructor() {
    effect(() => {
      const id = this.roleId();
      this.reset(id);
    });
  }

  // ---------------------------------------------------------------- carga

  private reset(id: string | undefined): void {
    this.errors.set({});
    this.problem.set(null);
    this.saved.set(null);
    this.dirty.set(false);
    this.conflict.set(false);
    this.confirm.set(null);
    this.picked.set({});
    this.load.set('loading');
    this.api
      .listCompetencies({ status: 'ACTIVE', limit: 100 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: (p) => this.competencies.set(p.data), error: () => this.competencies.set([]) });
    if (!id) {
      this.role.set(null);
      this.form.set(emptyForm());
      this.load.set('ready');
      return;
    }
    this.api
      .getRole(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (r) => this.show(r),
        error: (e: HttpErrorResponse) => this.load.set(e.status === 404 || e.status === 400 ? 'notFound' : 'error'),
      });
  }

  protected retry(): void {
    this.reset(this.roleId());
  }
  protected reload(): void {
    this.reset(this.roleId());
  }

  private show(r: RoleDetail): void {
    this.role.set(r);
    this.form.set(fromDetail(r));
    this.dirty.set(false);
    this.load.set('ready');
  }

  // ---------------------------------------------------------------- edición del formulario

  private edit(fn: (f: RoleForm) => RoleForm): void {
    this.form.update(fn);
    this.dirty.set(true);
    this.problem.set(null);
    if (Object.keys(this.errors()).length) this.errors.set(validate(this.form()));
  }

  protected setName(value: string): void {
    this.edit((f) => ({ ...f, name: value }));
  }
  protected setLevelName(i: number, value: string): void {
    this.edit((f) => ({ ...f, levels: f.levels.map((l, k) => (k === i ? { ...l, name: value } : l)) }));
  }
  protected addLevel(): void {
    this.edit((f) => ({ ...f, levels: [...f.levels, emptyLevel(Math.max(0, ...f.levels.map((l) => l.ordinal)) + 1)] }));
  }
  /** Solo un nivel aún no guardado se puede quitar; uno guardado se desactiva (BR-CAT-30). */
  protected removeNewLevel(i: number): void {
    this.picked.set({});
    this.edit((f) => ({ ...f, levels: f.levels.filter((_, k) => k !== i) }));
  }
  protected removeCompetency(i: number, j: number): void {
    this.edit((f) => ({
      ...f,
      levels: f.levels.map((l, k) => (k === i ? { ...l, competencies: l.competencies.filter((_, n) => n !== j) } : l)),
    }));
  }
  protected pickRequiredLevel(i: number, j: number, value: string): void {
    this.patchCompetency(i, j, { requiredLevel: value as FormCompetency['requiredLevel'] });
  }
  /** «Usar la nueva» (EVD-2026-0143): pasa a la versión vigente de la competencia. */
  protected useNewVersion(i: number, j: number): void {
    const row = this.form().levels[i].competencies[j];
    const current = this.newestVersion(row);
    if (!current) return;
    this.patchCompetency(i, j, { versionId: current.id, versionNumber: current.version_number, isCurrent: true, suggestedVersionId: null });
  }
  /** Versión vigente de la competencia de una fila, para «Hay una versión nueva (v3)». */
  protected newestVersion(row: FormCompetency) {
    return this.byId().get(row.competencyId)?.current_version ?? null;
  }
  private patchCompetency(i: number, j: number, patch: Partial<FormCompetency>): void {
    this.edit((f) => ({
      ...f,
      levels: f.levels.map((l, k) =>
        k === i ? { ...l, competencies: l.competencies.map((c, n) => (n === j ? { ...c, ...patch } : c)) } : l,
      ),
    }));
  }

  // ---------------------------------------------------------------- combobox «Agregar competencia…»

  /** Busca entre las competencias activas con versión aprobada (una sin versión aprobada no se puede usar, R-46). */
  protected readonly searchCompetencies = (q: string): Observable<AutocompleteOption[]> => {
    const text = q.trim().toLowerCase();
    const rows = this.competencies()
      .filter((c) => c.current_version && c.name.toLowerCase().includes(text))
      .map((c) => ({ id: c.id, label: c.name, sublabel: `v${c.current_version!.version_number}` }));
    return of(rows);
  };

  protected onPicked(i: number, option: AutocompleteOption): void {
    this.picked.update((p) => ({ ...p, [i]: option }));
  }
  protected pickedText(i: number): string {
    return this.picked()[i]?.label ?? '';
  }
  /** «Asignar»: agrega la competencia elegida al nivel, con el nivel esperado por elegir (estado B del diseño). */
  protected assign(i: number): void {
    const option = this.picked()[i];
    const c = option ? this.byId().get(option.id) : null;
    if (!c?.current_version) return;
    const row: FormCompetency = {
      competencyId: c.id,
      name: c.name,
      versionId: c.current_version.id,
      versionNumber: c.current_version.version_number,
      requiredLevel: '',
      isCurrent: true,
      suggestedVersionId: null,
    };
    this.picked.update((p) => ({ ...p, [i]: null }));
    this.edit((f) => ({ ...f, levels: f.levels.map((l, k) => (k === i ? { ...l, competencies: [...l.competencies, row] } : l)) }));
  }
  protected focusCombo(i: number): void {
    document.getElementById(`rf-l${i}-ac`)?.focus();
  }

  // ---------------------------------------------------------------- guardar y confirmaciones

  protected save(): void {
    this.problem.set(null);
    const errs = validate(this.form());
    this.errors.set(errs);
    if (Object.keys(errs).length) {
      setTimeout(() => this.focusFirstError(errs));
      return;
    }
    const body = toBody(this.form());
    const current = this.role();
    const call = current ? this.api.updateRole(current.id, current.row_version, body) : this.api.createRole(body);
    this.run(call, (r) => this.saved.set(r));
  }

  protected ask(c: Confirm): void {
    this.confirm.set(c);
  }
  protected dismiss(): void {
    this.confirm.set(null);
  }
  protected cancel(): void {
    if (this.dirty() && this.confirm()?.kind !== 'cancel') {
      this.confirm.set({ kind: 'cancel' });
      return;
    }
    this.leave();
  }
  protected leave(): void {
    void this.router.navigate(['..'], { relativeTo: this.route });
  }

  protected confirmed(): void {
    const c = this.confirm();
    const role = this.role();
    this.confirm.set(null);
    if (!c) return;
    if (c.kind === 'cancel') return this.leave();
    if (!role) return;
    if (c.kind === 'deactivate-role') return this.run(this.api.deactivateRole(role.id, role.row_version), (r) => this.saved.set(r));
    const level = this.form().levels[c.index];
    if (level?.id) this.run(this.api.setLevelStatus(role.id, level.id, c.action));
  }

  private run(call: Observable<RoleDetail>, after?: (r: RoleDetail) => void): void {
    this.saving.set(true);
    call.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (r) => {
        this.saving.set(false);
        this.show(r);
        after?.(r);
      },
      error: (e: HttpErrorResponse) => {
        this.saving.set(false);
        const p = describeSaveError(e.status, e.error);
        if (p.conflict) this.conflict.set(true);
        if (p.field === 'name') this.errors.update((x) => ({ ...x, name: p.message }));
        else this.problem.set(p);
      },
    });
  }

  private focusFirstError(errs: FormErrors): void {
    const key = Object.keys(errs)[0];
    const id = key === 'name' ? 'rf-name' : key === 'levels' ? 'rf-add-level' : key.startsWith('level.') ? this.idForKey(key) : null;
    document.getElementById(id ?? '')?.focus();
  }
  private idForKey(key: string): string {
    const [, i, kind, j] = key.split('.');
    if (kind === 'name') return `rf-l${i}-name`;
    if (kind === 'competencies') return `rf-l${i}-ac`;
    return `rf-l${i}-r${j}`;
  }

  // ---------------------------------------------------------------- vista

  protected err(key: string): string {
    return this.errors()[key] ?? '';
  }
  protected state(key: string): 'invalid' | 'default' {
    return this.errors()[key] ? 'invalid' : 'default';
  }
  protected title(level: FormLevel): string {
    return level.name.trim() || `Nivel ${level.ordinal} (sin nombre)`;
  }
  protected isDuplicate(i: number, j: number): boolean {
    return this.errors()[`level.${i}.c.${j}`] === MESSAGES.competencyDuplicated;
  }
  protected lastModified(r: RoleDetail): string {
    return lastModified(r);
  }
  protected confirmText(c: Confirm): string {
    switch (c.kind) {
      case 'cancel':
        return 'Tienes cambios sin guardar. ¿Salir sin guardarlos?';
      case 'deactivate-role':
        return 'El rol quedará inactivo. No se elimina: quien ya lo tiene lo conserva y no se asignará a nadie más.';
      case 'level':
        return c.action === 'deactivate'
          ? 'El nivel quedará inactivo. Quien ya lo tiene lo conserva y no se asignará a nadie más.'
          : 'El nivel volverá a estar activo y se podrá asignar de nuevo.';
    }
  }
  protected confirmLabel(c: Confirm): string {
    return c.kind === 'cancel' ? 'Salir sin guardar' : c.kind === 'deactivate-role' ? 'Desactivar rol' : c.action === 'deactivate' ? 'Desactivar nivel' : 'Reactivar nivel';
  }
}
