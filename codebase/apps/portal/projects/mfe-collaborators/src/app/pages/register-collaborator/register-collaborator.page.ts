import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { GfAlert, GfButton, GfIcon } from '@gf/ui';
import { RegisterWizardStore } from './register-collaborator.store';
import { STEP_TITLE, TYPE_LABEL } from './register-collaborator.rules';
import { StepTipo } from './steps/step-tipo';
import { StepDatos } from './steps/step-datos';
import { StepIdentificacion } from './steps/step-identificacion';
import { StepCorreo } from './steps/step-correo';
import { StepOrganizacion } from './steps/step-organizacion';
import { StepJefe } from './steps/step-jefe';
import { StepRol } from './steps/step-rol';
import { StepRevisar } from './steps/step-revisar';

/**
 * US-015 — Registrar un colaborador (SCR-015-01…09, FLW-015).
 * Asistente de un paso por pantalla: Empleado (6 pasos de captura + revisar) y Contratista (5 + revisar).
 */
@Component({
  selector: 'gf-register-collaborator-page',
  imports: [GfAlert, GfButton, GfIcon, StepTipo, StepDatos, StepIdentificacion, StepCorreo, StepOrganizacion, StepJefe, StepRol, StepRevisar],
  providers: [RegisterWizardStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (store.result(); as party) {
      <!-- SCR-015-09 · Éxito -->
      <main class="page page--narrow">
        <nav class="crumbs" aria-label="Ruta de navegación">
          <span>Gestión de Personal</span><gf-icon name="arrow_forward" size="0.875rem" [decorative]="true" />
          <span aria-current="page">Registrar un colaborador</span>
        </nav>
        <h1 class="title title--brand">Registrar un colaborador</h1>
        <section class="card card--success" aria-labelledby="rc-exito">
          <div class="success-icon" aria-hidden="true"><gf-icon name="check_circle" size="2.5rem" [decorative]="true" /></div>
          <h2 id="rc-exito" #successHeading tabindex="-1" role="status" aria-live="assertive" class="success-title">¡Colaborador registrado!</h2>
          <div class="code-box">
            <label for="rc-code" class="code-label">Código de colaborador (único):</label>
            <div class="code-row">
              <input id="rc-code" class="code" type="text" readonly [value]="party.code" aria-describedby="rc-code-help" />
              <gf-button variant="secondary" (pressed)="copyCode(party.code)">
                <gf-icon [name]="copied() ? 'check' : 'content_copy'" size="1rem" [decorative]="true" />
                {{ copied() ? 'Copiado' : 'Copiar' }}
              </gf-button>
            </div>
            <p id="rc-code-help" class="code-help">Puedes usar este código como referencia.</p>
            <span class="gf-visually-hidden" role="status" aria-live="polite">{{ copied() ? 'Código copiado' : '' }}</span>
          </div>
          <hr class="rule" />
          <h3 class="next-title">¿Qué deseas hacer ahora?</h3>
          <div class="next-actions">
            <gf-button (pressed)="another()"><gf-icon name="person_add" size="1rem" [decorative]="true" /> Registrar otro colaborador</gf-button>
            <gf-button variant="secondary" (pressed)="goList()"><gf-icon name="list" size="1rem" [decorative]="true" /> Volver a la lista</gf-button>
            <gf-button variant="text" (pressed)="goHome()"><gf-icon name="dashboard" size="1rem" [decorative]="true" /> Ir al dashboard</gf-button>
          </div>
        </section>
      </main>
    } @else if (store.submitError()?.kind === 'E1') {
      <!-- E1 · Sin permisos -->
      <main class="page page--narrow">
        <h1 class="title title--brand">Registrar un colaborador</h1>
        <gf-alert tone="danger" icon="block" heading="Sin permisos">
          <p class="alert-p">{{ store.submitError()?.message }}</p>
          <div class="alert-actions"><gf-button variant="secondary" (pressed)="goList()">Volver</gf-button></div>
        </gf-alert>
      </main>
    } @else {
      <main class="page" [class.page--narrow]="store.step() === 'tipo'">
        @if (store.step() !== 'tipo') {
          <header class="head">
            <p class="eyebrow"><gf-icon name="person_add" size="1rem" [decorative]="true" /> Registro de personal</p>
            <h1 class="title">Registrar un colaborador</h1>
            @if (store.data().type; as t) {
              <p class="type">Tipo: {{ typeLabel[t] }}</p>
            }
          </header>
        }

        <section class="card" [attr.aria-labelledby]="store.step() === 'tipo' ? 'rc-tipo-title' : 'rc-step-title'">
          @if (store.step() === 'tipo') {
            <h1 id="rc-tipo-title" #stepHeading tabindex="-1" class="title title--card">Registrar un colaborador</h1>
            <h2 id="rc-tipo-question" class="subtitle">¿Qué tipo de colaborador deseas registrar?</h2>
          } @else {
            <div class="step-head">
              <h2 id="rc-step-title" #stepHeading tabindex="-1" class="step-title">{{ title() }}</h2>
              <span class="step-flag">{{ store.step() === 'revisar' ? 'Paso final' : 'Paso actual' }}</span>
            </div>
            <div
              class="progress"
              role="progressbar"
              aria-label="Progreso del registro"
              [attr.aria-valuemin]="0"
              [attr.aria-valuemax]="100"
              [attr.aria-valuenow]="percent()"
              [attr.aria-valuetext]="progressText()"
            >
              <div class="progress-bar" [style.width.%]="percent()"></div>
            </div>
          }

          <form novalidate (submit)="onSubmit($event)">
            @switch (store.step()) {
              @case ('tipo') { <gf-step-tipo /> }
              @case ('datos') { <gf-step-datos /> }
              @case ('identificacion') { <gf-step-identificacion /> }
              @case ('correo') { <gf-step-correo /> }
              @case ('organizacion') { <gf-step-organizacion /> }
              @case ('jefe') { <gf-step-jefe /> }
              @case ('rol') { <gf-step-rol /> }
              @case ('revisar') { <gf-step-revisar /> }
            }

            <div class="footer" [class.footer--end]="store.step() === 'tipo' || (store.step() === 'revisar' && !failed())">
              @switch (store.step()) {
                @case ('tipo') {
                  <gf-button variant="secondary" (pressed)="askCancel()">Cancelar</gf-button>
                  <gf-button type="submit" [disabled]="!store.canAdvance()">Siguiente</gf-button>
                }
                @case ('revisar') {
                  @if (failed()) {
                    <gf-button variant="secondary" (pressed)="store.back()">
                      <gf-icon name="arrow_back" size="1rem" [decorative]="true" /> Volver
                    </gf-button>
                    <span class="footer-right">
                      <gf-button [disabled]="true"><gf-icon name="lock" size="1rem" [decorative]="true" /> Guardar bloqueado</gf-button>
                      <gf-button type="submit" [loading]="store.submitting()">
                        <gf-icon name="refresh" size="1rem" [decorative]="true" /> Reintentar
                      </gf-button>
                    </span>
                  } @else {
                    <gf-button variant="secondary" (pressed)="askCancel()">Cancelar</gf-button>
                    <gf-button type="submit" [loading]="store.submitting()">
                      <gf-icon name="check" size="1rem" [decorative]="true" /> Guardar
                    </gf-button>
                  }
                }
                @default {
                  <gf-button variant="secondary" (pressed)="store.back()">Atrás</gf-button>
                  <gf-button type="submit" [disabled]="!store.canAdvance()" [loading]="store.checkingManager()">
                    Siguiente <gf-icon name="arrow_forward" size="1rem" [decorative]="true" />
                  </gf-button>
                }
              }
            </div>
          </form>
        </section>
      </main>
    }

    <dialog #cancelDialog class="dialog" role="alertdialog" aria-labelledby="rc-cancel-title" aria-describedby="rc-cancel-text" (cancel)="dismissCancel()">
      <h2 id="rc-cancel-title" class="dialog-title">¿Descartar los cambios?</h2>
      <p id="rc-cancel-text" class="dialog-text">Si sales ahora, los datos ingresados no se guardarán.</p>
      <div class="dialog-actions">
        <gf-button variant="secondary" (pressed)="dismissCancel()">Continuar</gf-button>
        <gf-button variant="destructive" (pressed)="discard()">Descartar</gf-button>
      </div>
    </dialog>
  `,
  styles: [
    `
      :host { display: block; }
      .page { max-width: 1040px; margin: 0 auto; padding: var(--gf-space-6) var(--gf-space-4) var(--gf-space-8); }
      .page--narrow { max-width: 760px; }
      .head { margin-bottom: var(--gf-space-6); }
      .eyebrow { display: flex; align-items: center; gap: var(--gf-space-2); margin: 0 0 var(--gf-space-1); font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; font-weight: var(--gf-font-weight-semibold); color: var(--gf-color-primary); }
      .title { margin: 0; font-size: 2rem; line-height: 1.2; font-weight: var(--gf-font-weight-semibold); color: var(--gf-color-text); }
      .title--brand { margin-bottom: var(--gf-space-4); }
      .title--card { font-size: 2rem; outline-offset: 4px; }
      .type { margin: var(--gf-space-2) 0 0; color: var(--gf-color-text-muted); }
      .subtitle { margin: var(--gf-space-1) 0 var(--gf-space-6); font-size: var(--gf-font-size-lg); font-weight: var(--gf-font-weight-semibold); color: var(--gf-color-text-muted); }
      .crumbs { display: flex; align-items: center; gap: var(--gf-space-2); margin-bottom: var(--gf-space-2); font-size: 0.75rem; color: var(--gf-color-text-muted); }
      .crumbs span[aria-current] { color: var(--gf-color-text); }
      .card { padding: var(--gf-space-8); background: var(--gf-color-surface); border: 1px solid color-mix(in srgb, var(--gf-color-border) 45%, transparent); border-radius: var(--gf-radius-md); }
      .step-head { display: flex; align-items: baseline; justify-content: space-between; gap: var(--gf-space-3); }
      .step-title { margin: 0; font-size: var(--gf-font-size-xl); font-weight: var(--gf-font-weight-semibold); outline-offset: 4px; }
      .step-flag { font-size: 0.75rem; color: var(--gf-color-text-muted); }
      .progress { height: 6px; margin: var(--gf-space-3) 0 var(--gf-space-6); border-radius: 999px; background: var(--gf-color-surface-container); overflow: hidden; }
      .progress-bar { height: 100%; background: var(--gf-color-primary); border-radius: inherit; transition: width 0.2s ease; }
      .footer { display: flex; justify-content: space-between; align-items: center; gap: var(--gf-space-3); margin-top: var(--gf-space-6); padding-top: var(--gf-space-4); border-top: 1px solid color-mix(in srgb, var(--gf-color-border) 45%, transparent); }
      .footer--end { justify-content: flex-end; }
      .footer-right { display: inline-flex; gap: var(--gf-space-2); }
      .card--success { text-align: center; padding: var(--gf-space-6); }
      .success-icon { display: inline-flex; padding: var(--gf-space-3); border-radius: 50%; background: var(--gf-color-success-bg); color: var(--gf-color-success-fg); border: 1px solid var(--gf-color-success-fg); }
      .success-title { margin: var(--gf-space-3) 0 var(--gf-space-4); font-size: var(--gf-font-size-lg); font-weight: var(--gf-font-weight-semibold); }
      .code-box { text-align: left; padding: var(--gf-space-3) var(--gf-space-4); border: 1px solid color-mix(in srgb, var(--gf-color-border) 45%, transparent); border-radius: var(--gf-radius-md); background: var(--gf-color-surface-container); }
      .code-label { display: block; font-size: var(--gf-font-size-sm); margin-bottom: var(--gf-space-2); }
      .code-row { display: flex; gap: var(--gf-space-2); }
      .code { flex: 1; min-width: 0; min-height: var(--gf-touch-target); padding: 0 var(--gf-space-3); border: 1px solid var(--gf-color-border); border-radius: var(--gf-radius-sm); background: var(--gf-color-surface); color: var(--gf-color-text); font-family: ui-monospace, monospace; font-size: 0.9375rem; }
      .code-help { margin: var(--gf-space-2) 0 0; font-size: 0.75rem; color: var(--gf-color-text-muted); }
      .rule { border: 0; border-top: 1px solid color-mix(in srgb, var(--gf-color-border) 45%, transparent); margin: var(--gf-space-6) 0; }
      .next-title { margin: 0 0 var(--gf-space-3); text-align: left; font-size: var(--gf-font-size-lg); font-weight: var(--gf-font-weight-semibold); }
      .next-actions { display: flex; flex-wrap: wrap; gap: var(--gf-space-3); }
      .alert-p { margin: 0; }
      .alert-actions { margin-top: var(--gf-space-3); }
      .dialog { max-width: 420px; padding: var(--gf-space-6); border: 1px solid var(--gf-color-border); border-radius: var(--gf-radius-md); background: var(--gf-color-surface); color: var(--gf-color-text); }
      .dialog::backdrop { background: color-mix(in srgb, var(--gf-color-text) 50%, transparent); }
      .dialog-title { margin: 0 0 var(--gf-space-2); font-size: var(--gf-font-size-lg); }
      .dialog-text { margin: 0 0 var(--gf-space-6); color: var(--gf-color-text-muted); }
      .dialog-actions { display: flex; justify-content: flex-end; gap: var(--gf-space-2); }
      @media (max-width: 767px) { .card { padding: var(--gf-space-4); } .title { font-size: 1.5rem; } }
    `,
  ],
})
export class RegisterCollaboratorPage {
  protected readonly store = inject(RegisterWizardStore);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);

  protected readonly typeLabel = TYPE_LABEL;
  protected readonly copied = signal(false);

  private readonly heading = viewChild<ElementRef<HTMLElement>>('stepHeading');
  private readonly successHeading = viewChild<ElementRef<HTMLElement>>('successHeading');
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('cancelDialog');
  private firstRun = true;

  constructor() {
    // Gestión de foco (WCAG 2.4.3): al cambiar de paso el foco va al encabezado del paso;
    // al guardar con éxito, al anuncio de éxito.
    effect(() => {
      this.store.step();
      const done = this.store.result();
      untracked(() => {
        if (this.firstRun) {
          this.firstRun = false;
          return;
        }
        afterNextRender(() => (done ? this.successHeading() : this.heading())?.nativeElement.focus(), { injector: this.injector });
      });
    });
  }

  protected title(): string {
    return STEP_TITLE[this.store.step()](this.store.data().type);
  }
  protected percent(): number {
    return Math.round(this.store.progress() * 100);
  }
  protected progressText(): string {
    return this.store.step() === 'revisar'
      ? 'Paso final'
      : `Paso ${this.store.stepNumber()} de ${this.store.stepTotal()}`;
  }
  protected failed(): boolean {
    const k = this.store.submitError()?.kind;
    return k === 'E10' || k === 'E9';
  }
  protected onSubmit(ev: Event): void {
    ev.preventDefault();
    if (this.store.step() === 'revisar') this.store.submit();
    else this.store.next();
  }

  protected askCancel(): void {
    this.dialog().nativeElement.showModal();
  }
  protected dismissCancel(): void {
    this.dialog().nativeElement.close();
  }
  protected discard(): void {
    this.dialog().nativeElement.close();
    void this.router.navigateByUrl('/colaboradores');
  }

  protected async copyCode(code: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Sin Clipboard API: selecciona el campo para copiar con Ctrl+C.
      document.querySelector<HTMLInputElement>('#rc-code')?.select();
    }
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }

  protected another(): void {
    this.store.reset();
  }
  protected goList(): void {
    void this.router.navigateByUrl('/colaboradores');
  }
  protected goHome(): void {
    void this.router.navigateByUrl('/');
  }
}
