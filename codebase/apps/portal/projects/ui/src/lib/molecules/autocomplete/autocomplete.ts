import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Observable, Subject, catchError, debounceTime, of, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GfIcon } from '../../atoms/icon/icon';
import type { FieldState } from '../../atoms/text-input/text-input';

export interface AutocompleteOption {
  id: string;
  label: string;
  /** Texto secundario (a la derecha o bajo la etiqueta). */
  sublabel?: string;
  /** Distintivo (por ejemplo «Vigente»). */
  badge?: string;
}

/**
 * CMP-MOL — Combobox con búsqueda (patrón ARIA 1.2 «list autocomplete»).
 * Debounce 300 ms (AC-015). Teclado: ↑ ↓ Enter Esc. Estados: cargando, vacío (sin resultados), error de carga.
 * El consumidor muestra la selección vigente y el estado de campo (`state`).
 */
@Component({
  selector: 'gf-autocomplete',
  standalone: true,
  imports: [GfIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="combo" [attr.data-state]="state()">
      <input
        type="text"
        role="combobox"
        autocomplete="off"
        [attr.id]="inputId()"
        [value]="text()"
        [attr.placeholder]="placeholder() || null"
        [disabled]="disabled()"
        [attr.aria-expanded]="open()"
        [attr.aria-controls]="listId"
        [attr.aria-autocomplete]="'list'"
        [attr.aria-activedescendant]="activeId()"
        [attr.aria-required]="required() || null"
        [attr.aria-describedby]="ariaDescribedBy() || null"
        [attr.aria-invalid]="state() === 'invalid' ? 'true' : null"
        (input)="onInput($any($event.target).value)"
        (focus)="onFocus()"
        (blur)="onBlur()"
        (keydown)="onKeydown($event)"
      />
      <span class="trailing" aria-hidden="true">
        @if (loading()) {
          <gf-icon name="refresh" [spin]="true" [decorative]="true" />
        } @else if (state() === 'valid') {
          <gf-icon name="check_circle" [decorative]="true" />
        } @else if (state() === 'invalid') {
          <gf-icon name="error" [decorative]="true" />
        } @else {
          <gf-icon [name]="searchIcon() ? 'search' : 'expand_more'" [decorative]="true" />
        }
      </span>
      <ul class="options" role="listbox" [attr.id]="listId" [attr.aria-label]="listLabel()" [hidden]="!open()">
        @if (loading()) {
          <li class="status" role="presentation">{{ loadingText() }}</li>
        } @else if (!results().length) {
          <li class="status" role="presentation">{{ emptyText() }}</li>
        } @else {
          @for (opt of results(); track opt.id; let i = $index) {
            <li
              role="option"
              [attr.id]="optionId(i)"
              [attr.aria-selected]="i === active()"
              [class.active]="i === active()"
              (mousedown)="$event.preventDefault()"
              (click)="choose(opt)"
            >
              <span class="opt-main">
                <span class="opt-label">{{ opt.label }}</span>
                @if (opt.sublabel) {
                  <span class="opt-sub">{{ opt.sublabel }}</span>
                }
              </span>
              @if (opt.badge) {
                <span class="opt-badge">{{ opt.badge }}</span>
              }
            </li>
          }
        }
      </ul>
    </div>
    <span class="gf-visually-hidden" role="status" aria-live="polite">{{ liveMessage() }}</span>
  `,
  styles: [`
    :host { display: block; }
    .combo { position: relative; }
    input {
      width: 100%;
      box-sizing: border-box;
      min-height: var(--gf-touch-target);
      padding: var(--gf-space-2) calc(var(--gf-space-3) + 28px) var(--gf-space-2) var(--gf-space-3);
      border: 1px solid var(--gf-color-border);
      border-radius: var(--gf-radius-sm);
      background: var(--gf-color-surface);
      color: var(--gf-color-text);
      font: inherit;
      font-size: 1rem;
    }
    input::placeholder { color: var(--gf-color-text-muted); opacity: 0.7; }
    input:focus-visible { outline: 2px solid var(--gf-color-primary); outline-offset: 2px; }
    input:disabled { opacity: 0.5; cursor: not-allowed; }
    .combo[data-state='valid'] input { border-width: 2px; border-color: var(--gf-color-success-fg); }
    .combo[data-state='invalid'] input { border-width: 2px; border-color: var(--gf-color-danger-fg); }
    .trailing { position: absolute; right: var(--gf-space-3); top: calc(var(--gf-touch-target) / 2); transform: translateY(-50%); display: inline-flex; pointer-events: none; color: var(--gf-color-text-muted); }
    .combo[data-state='valid'] .trailing { color: var(--gf-color-success-fg); }
    .combo[data-state='invalid'] .trailing { color: var(--gf-color-danger-fg); }
    .options {
      position: absolute; z-index: 10; left: 0; right: 0; top: calc(var(--gf-touch-target) + 4px);
      margin: 0; padding: var(--gf-space-1) 0; list-style: none; max-height: 260px; overflow: auto;
      background: var(--gf-color-surface); border: 1px solid var(--gf-color-border); border-radius: var(--gf-radius-md);
      box-shadow: 0 4px 12px color-mix(in srgb, var(--gf-color-text) 18%, transparent);
    }
    .options[hidden] { display: none; }
    li { display: flex; align-items: center; justify-content: space-between; gap: var(--gf-space-3); padding: var(--gf-space-2) var(--gf-space-3); cursor: pointer; }
    li.status { cursor: default; color: var(--gf-color-text-muted); font-size: var(--gf-font-size-sm); }
    li.active, li[role='option']:hover { background: var(--gf-color-surface-container); }
    .opt-main { display: flex; flex-direction: column; min-width: 0; }
    .opt-label { font-weight: var(--gf-font-weight-semibold); }
    .opt-sub { font-size: var(--gf-font-size-sm); color: var(--gf-color-text-muted); }
    .opt-badge { font-size: 0.75rem; padding: 2px var(--gf-space-2); border-radius: var(--gf-radius-sm); background: var(--gf-color-success-bg); color: var(--gf-color-success-fg); white-space: nowrap; }
  `],
})
export class GfAutocomplete {
  readonly inputId = input.required<string>();
  readonly placeholder = input('');
  readonly required = input(false);
  readonly disabled = input(false);
  readonly state = input<FieldState>('default');
  readonly ariaDescribedBy = input('');
  readonly listLabel = input('Resultados');
  readonly loadingText = input('Cargando…');
  readonly emptyText = input('Sin resultados');
  readonly searchIcon = input(false);
  /** Texto del campo cuando hay una selección (lo fija el consumidor). */
  readonly selectedText = input('');
  readonly searchFn = input.required<(q: string) => Observable<AutocompleteOption[]>>();
  /** Abre y consulta al enfocar aunque no haya texto. */
  readonly openOnFocus = input(true);

  readonly selected = output<AutocompleteOption>();
  readonly textChange = output<string>();

  protected readonly listId = `gf-ac-list-${Math.random().toString(36).slice(2, 9)}`;
  protected readonly typed = signal<string | null>(null);
  protected readonly text = computed(() => this.typed() ?? this.selectedText());
  protected readonly open = signal(false);
  protected readonly loading = signal(false);
  protected readonly results = signal<AutocompleteOption[]>([]);
  protected readonly active = signal(-1);
  protected readonly liveMessage = signal('');

  private readonly query$ = new Subject<string>();

  constructor() {
    this.query$
      .pipe(
        tap(() => this.loading.set(true)),
        debounceTime(300),
        switchMap((q) =>
          this.searchFn()(q).pipe(
            catchError(() => of([] as AutocompleteOption[])),
          ),
        ),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe((rows) => {
        this.results.set(rows);
        this.loading.set(false);
        this.active.set(rows.length ? 0 : -1);
        this.liveMessage.set(rows.length ? `${rows.length} resultados disponibles` : this.emptyText());
      });
  }

  protected optionId(i: number): string {
    return `${this.listId}-opt-${i}`;
  }
  protected activeId(): string | null {
    return this.open() && this.active() >= 0 ? this.optionId(this.active()) : null;
  }

  protected onInput(value: string): void {
    this.typed.set(value);
    this.textChange.emit(value);
    this.open.set(true);
    this.query$.next(value);
  }

  protected onFocus(): void {
    if (this.openOnFocus() && !this.open()) {
      this.open.set(true);
      this.query$.next(this.typed() ?? '');
    }
  }

  protected onBlur(): void {
    this.open.set(false);
    this.typed.set(null);
  }

  protected onKeydown(e: KeyboardEvent): void {
    const n = this.results().length;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!this.open()) { this.onFocus(); break; }
        if (n) this.active.set((this.active() + 1) % n);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (n) this.active.set((this.active() - 1 + n) % n);
        break;
      case 'Enter':
        if (this.open() && this.active() >= 0 && this.results()[this.active()]) {
          e.preventDefault();
          this.choose(this.results()[this.active()]);
        }
        break;
      case 'Escape':
        if (this.open()) { e.preventDefault(); this.open.set(false); }
        break;
    }
  }

  protected choose(opt: AutocompleteOption): void {
    this.typed.set(null);
    this.open.set(false);
    this.selected.emit(opt);
  }
}
