import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { GfAlert, GfButton, GfDateInput, GfFormField, GfIcon, GfSelect, GfSpinner } from '@gf/ui';
import { RegisterCollaboratorApi } from '../register-collaborator.api';
import { RegisterWizardStore } from '../register-collaborator.store';
import { E_MESSAGES, RoleOption } from '../register-collaborator.rules';
import { WIZARD_STYLES } from './wizard.styles';

/**
 * SCR-015-07 — Rol-Nivel inicial. Cualquier nivel válido, no solo el primero (BR-PRF-02, AC-7);
 * solo niveles con requisitos de evidencia (BR-ACR-13). Estados: cargando, sin catálogo (E4), por defecto,
 * seleccionado y válido, inválido (E8).
 */
@Component({
  selector: 'gf-step-rol',
  imports: [GfFormField, GfSelect, GfDateInput, GfAlert, GfButton, GfIcon, GfSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (status()) {
      @case ('loading') {
        <p class="muted"><gf-spinner label="Cargando roles" /> Cargando roles…</p>
      }
      @case ('empty') {
        <div class="panel-empty" role="status">
          <span class="icon-circle"><gf-icon name="block" size="2rem" [decorative]="true" /></span>
          <h3>Catálogo no configurado</h3>
          <p>{{ e4 }}</p>
          <div class="btn-row">
            <gf-button variant="secondary" [disabled]="true" ariaLabel="Crear catálogo (disponible con US-001)">
              <gf-icon name="person_add" size="1rem" [decorative]="true" /> Crear catálogo
            </gf-button>
            <gf-button variant="secondary" (pressed)="store.back()">Volver</gf-button>
          </div>
        </div>
      }
      @default {
        <div class="fields">
          <gf-form-field
            label="Rol"
            [required]="true"
            fieldId="rc-rol"
            [statusIcon]="false"
            [state]="store.data().role ? 'valid' : 'default'"
          >
            <gf-select
              inputId="rc-rol"
              [required]="true"
              [value]="store.data().role?.id ?? ''"
              [state]="store.data().role ? 'valid' : 'default'"
              (valueChange)="pickRole($event)"
            >
              <option value="" [selected]="!store.data().role">Seleccionar rol…</option>
              @for (r of roles(); track r.id) {
                <option [value]="r.id" [selected]="r.id === store.data().role?.id">{{ r.label }}</option>
              }
            </gf-select>
          </gf-form-field>

          <gf-form-field
            label="Nivel inicial"
            [required]="true"
            fieldId="rc-nivel"
            [statusIcon]="false"
            [hint]="store.data().role ? '' : 'Se habilitará tras definir el rol.'"
            [state]="levelState()"
            [message]="levelMessage()"
          >
            <gf-select
              inputId="rc-nivel"
              [required]="true"
              [disabled]="!store.data().role"
              [value]="store.data().levelId"
              [state]="levelState()"
              [ariaDescribedBy]="levelDescribedBy()"
              (valueChange)="pickLevel($event)"
            >
              <option value="" [selected]="!store.data().levelId">
                {{ store.data().role ? 'Seleccionar nivel…' : 'Selecciona un rol primero…' }}
              </option>
              @for (l of eligibleLevels(); track l.id) {
                <option [value]="l.id" [selected]="l.id === store.data().levelId">{{ l.label }}</option>
              }
            </gf-select>
          </gf-form-field>

          @if (selectedLevel(); as lvl) {
            <gf-alert id="rc-nivel-status" tone="success" icon="check_circle" [heading]="'Requisitos de ' + lvl.label + ' confirmados'">
              <p class="alert-text">
                El nivel cuenta con {{ lvl.evidenceCount }} requisitos de evidencia configurados y aprobados para
                {{ store.data().role?.label }}.
              </p>
            </gf-alert>
          } @else if (levelInvalid()) {
            <gf-alert id="rc-nivel-status" tone="danger" icon="error">
              <p class="alert-text">{{ e8 }}</p>
              <div class="actions-inline">
                <gf-button variant="secondary" (pressed)="resetLevel()">
                  <gf-icon name="edit" size="1rem" [decorative]="true" /> Seleccionar otra
                </gf-button>
              </div>
            </gf-alert>
          }

          <div class="note">
            <gf-icon name="info" size="1.125rem" [decorative]="true" />
            <p>Solo están disponibles los niveles con requisitos de evidencia definidos.</p>
          </div>

          <gf-form-field
            label="Vigente desde"
            [required]="true"
            fieldId="rc-desde"
            [statusIcon]="false"
            [state]="store.fieldError('fromDate') ? 'invalid' : 'default'"
            [message]="store.fieldError('fromDate')"
          >
            <gf-date-input
              inputId="rc-desde"
              [required]="true"
              [value]="store.data().fromDate"
              [invalid]="!!store.fieldError('fromDate')"
              [ariaDescribedBy]="store.fieldError('fromDate') ? 'rc-desde-msg' : ''"
              (valueChange)="store.patch({ fromDate: $event })"
              (blur)="store.touch('fromDate')"
            />
          </gf-form-field>
        </div>
      }
    }
  `,
  styles: [WIZARD_STYLES],
})
export class StepRol implements OnInit {
  protected readonly store = inject(RegisterWizardStore);
  private readonly api = inject(RegisterCollaboratorApi);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly status = signal<'loading' | 'ready' | 'empty'>('loading');
  protected readonly roles = signal<RoleOption[]>([]);
  protected readonly e4 = E_MESSAGES.E4;
  protected readonly e8 = E_MESSAGES.E8;

  ngOnInit(): void {
    const sub = this.api.roles().subscribe({
      next: (rows) => {
        this.roles.set(rows);
        this.status.set(rows.length ? 'ready' : 'empty');
      },
      error: () => this.status.set('empty'),
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  protected eligibleLevels() {
    return (this.store.data().role?.levels ?? []).filter((l) => l.evidenceCount > 0);
  }
  protected selectedLevel() {
    const d = this.store.data();
    return this.eligibleLevels().find((l) => l.id === d.levelId) ?? null;
  }
  /** E8: el rol elegido no tiene ningún nivel con requisitos de evidencia. */
  protected levelInvalid(): boolean {
    const r = this.store.data().role;
    return !!r && this.eligibleLevels().length === 0;
  }
  protected levelState(): 'default' | 'valid' | 'invalid' {
    if (this.levelInvalid() || this.store.fieldError('level')) return 'invalid';
    return this.selectedLevel() ? 'valid' : 'default';
  }
  protected levelMessage(): string {
    const m = this.store.fieldError('level');
    return m === 'invalid' || this.levelInvalid() ? '' : m;
  }
  protected levelDescribedBy(): string {
    const parts = [this.store.data().role ? '' : 'rc-nivel-hint'];
    if (this.selectedLevel() || this.levelInvalid()) parts.push('rc-nivel-status');
    if (this.levelMessage()) parts.push('rc-nivel-msg');
    return parts.filter(Boolean).join(' ');
  }

  protected pickRole(id: string): void {
    this.store.patch({ role: this.roles().find((r) => r.id === id) ?? null });
    this.store.touch('role');
  }
  protected pickLevel(id: string): void {
    this.store.patch({ levelId: id });
    this.store.touch('level');
  }
  protected resetLevel(): void {
    this.store.patch({ role: null, levelId: '' });
  }
}
