import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppRole, SessionService } from '@gf/core';
import { GfAlert, GfBadge, GfButton, GfFormField, GfIcon, GfSelect, GfSpinner, GfTextInput } from '@gf/ui';
import { Observable } from 'rxjs';
import { CatalogApi } from '../../data-access/catalog.api';
import { CompetencySummary, LEVEL_CODES, RoleDetail } from '../../data-access/catalog.models';
import {
  DESCRIPTION_MAX,
  FormCompetency,
  FormErrors,
  LEVEL_NAME_MAX,
  NAME_MAX,
  RoleForm,
  SaveProblem,
  describeSaveError,
  emptyForm,
  emptyLevel,
  fromDetail,
  toBody,
  validate,
} from './role-form.logic';

type Confirm = { kind: 'cancel' } | { kind: 'deactivate-role' } | { kind: 'level'; index: number; action: 'deactivate' | 'reactivate' };

/**
 * SCR-001-02 — Rol: ver, crear y editar un rol con sus niveles y, por nivel, las competencias con su L esperado
 * (US-001, UXR-001; API-SPEC-003). Crear o editar: Jefe de Ingeniería, Responsable de producto y ADMIN (BR-CAT-04/05).
 * Desactivar o reactivar un nivel: Jefe de Ingeniería y ADMIN (BR-CAT-30). Sin eliminar (EVD-2026-0154, 0174).
 * Los textos «propuesto» (SCR-001-Q2) y el diseño de Stitch (GEN-001-G) están pendientes de revisión humana.
 */
@Component({
  selector: 'gf-role-form-page',
  imports: [RouterLink, GfAlert, GfBadge, GfButton, GfFormField, GfIcon, GfSelect, GfSpinner, GfTextInput],
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

  protected readonly load = signal<'loading' | 'ready' | 'error' | 'notFound'>('loading');
  protected readonly role = signal<RoleDetail | null>(null);
  protected readonly form = signal<RoleForm>(emptyForm());
  protected readonly competencies = signal<CompetencySummary[]>([]);
  protected readonly errors = signal<FormErrors>({});
  protected readonly problem = signal<SaveProblem | null>(null);
  protected readonly saving = signal(false);
  protected readonly saved = signal(false);
  protected readonly dirty = signal(false);
  protected readonly confirm = signal<Confirm | null>(null);

  protected readonly isNew = computed(() => !this.roleId());
  protected readonly canEdit = computed(() =>
    this.session.hasAnyRole([AppRole.JefeIngenieria, AppRole.ProductOwner, AppRole.Admin]),
  );
  protected readonly canToggleLevels = computed(() => this.session.hasAnyRole([AppRole.JefeIngenieria, AppRole.Admin]));
  protected readonly errorList = computed(() => Object.values(this.errors()));
  protected readonly byId = computed(() => new Map(this.competencies().map((c) => [c.id, c])));

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
    this.saved.set(false);
    this.dirty.set(false);
    this.confirm.set(null);
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
    this.saved.set(false);
    if (Object.keys(this.errors()).length) this.errors.set(validate(this.form()));
  }

  protected setName(value: string): void {
    this.edit((f) => ({ ...f, name: value }));
  }
  protected setDescription(value: string): void {
    this.edit((f) => ({ ...f, description: value }));
  }
  protected setLevelName(i: number, value: string): void {
    this.edit((f) => ({ ...f, levels: f.levels.map((l, k) => (k === i ? { ...l, name: value } : l)) }));
  }
  protected addLevel(): void {
    this.edit((f) => ({ ...f, levels: [...f.levels, emptyLevel(Math.max(0, ...f.levels.map((l) => l.ordinal)) + 1)] }));
  }
  /** Solo un nivel aún no guardado se puede quitar; uno guardado se desactiva (BR-CAT-30). */
  protected removeNewLevel(i: number): void {
    this.edit((f) => ({ ...f, levels: f.levels.filter((_, k) => k !== i) }));
  }
  protected addCompetency(i: number): void {
    const blank: FormCompetency = {
      competencyId: '',
      name: '',
      versionId: '',
      versionNumber: 0,
      requiredLevel: '',
      isCurrent: true,
      suggestedVersionId: null,
    };
    this.edit((f) => ({
      ...f,
      levels: f.levels.map((l, k) => (k === i ? { ...l, competencies: [...l.competencies, blank] } : l)),
    }));
  }
  protected removeCompetency(i: number, j: number): void {
    this.edit((f) => ({
      ...f,
      levels: f.levels.map((l, k) => (k === i ? { ...l, competencies: l.competencies.filter((_, n) => n !== j) } : l)),
    }));
  }
  protected pickCompetency(i: number, j: number, competencyId: string): void {
    const c = this.byId().get(competencyId);
    this.patchCompetency(i, j, {
      competencyId,
      name: c?.name ?? '',
      versionId: c?.current_version?.id ?? '',
      versionNumber: c?.current_version?.version_number ?? 0,
      isCurrent: true,
      suggestedVersionId: null,
    });
  }
  protected pickRequiredLevel(i: number, j: number, value: string): void {
    this.patchCompetency(i, j, { requiredLevel: value as FormCompetency['requiredLevel'] });
  }
  /** «Usar la nueva» (EVD-2026-0143): pasa a la versión vigente de la competencia. */
  protected useNewVersion(i: number, j: number): void {
    const row = this.form().levels[i].competencies[j];
    const current = this.byId().get(row.competencyId)?.current_version;
    if (!current) return;
    this.patchCompetency(i, j, { versionId: current.id, versionNumber: current.version_number, isCurrent: true, suggestedVersionId: null });
  }
  private patchCompetency(i: number, j: number, patch: Partial<FormCompetency>): void {
    this.edit((f) => ({
      ...f,
      levels: f.levels.map((l, k) =>
        k === i ? { ...l, competencies: l.competencies.map((c, n) => (n === j ? { ...c, ...patch } : c)) } : l,
      ),
    }));
  }

  /** Competencias elegibles: las activas con versión aprobada, más la que la fila ya tiene (aunque esté inactiva, BR-CAT-28). */
  protected optionsFor(row: FormCompetency): { id: string; label: string; disabled: boolean }[] {
    const opts = this.competencies().map((c) => ({
      id: c.id,
      label: c.current_version ? c.name : `${c.name} (sin versión aprobada)`,
      disabled: !c.current_version,
    }));
    if (row.competencyId && !opts.some((o) => o.id === row.competencyId)) {
      opts.unshift({ id: row.competencyId, label: `${row.name} (inactiva)`, disabled: false });
    }
    return opts;
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
    this.run(call, (r) => {
      this.saved.set(true);
      if (!current) void this.router.navigate(['..', 'roles', r.id], { relativeTo: this.route });
    });
  }

  protected reload(): void {
    this.reset(this.roleId());
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
    if (c.kind === 'deactivate-role') return this.run(this.api.deactivateRole(role.id, role.row_version));
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
        this.problem.set(describeSaveError(e.status, e.error));
      },
    });
  }

  private focusFirstError(errs: FormErrors): void {
    const key = Object.keys(errs)[0];
    const id =
      key === 'name' ? 'rf-name' : key === 'levels' ? 'rf-add-level' : key.startsWith('level.') ? this.idForKey(key) : null;
    const el = id ? document.getElementById(id) : null;
    // los botones del design system son componentes: el foco va al <button> interno
    (el?.tagName.startsWith('GF-') ? el.querySelector<HTMLElement>('button, input, select') : el)?.focus();
  }
  private idForKey(key: string): string {
    const [, i, kind, j] = key.split('.');
    if (kind === 'name') return `rf-l${i}-name`;
    if (kind === 'competencies') return `rf-l${i}-add-c`;
    return `rf-l${i}-c${j}`;
  }

  // ---------------------------------------------------------------- vista

  protected err(key: string): string {
    return this.errors()[key] ?? '';
  }
  protected state(key: string): 'invalid' | 'default' {
    return this.errors()[key] ? 'invalid' : 'default';
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
