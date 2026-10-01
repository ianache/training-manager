import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  computed,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  AsyncValidator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import {
  switchMap,
  map,
  debounceTime,
  timeout,
  catchError,
} from 'rxjs/operators';

@Component({
  selector: 'gf-email-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (control()) {
      <input
        type="email"
        [disabled]="disabled()"
        [formControl]="control()!"
        [placeholder]="placeholder()"
        [attr.aria-label]="ariaLabel() || null"
        [attr.aria-required]="required() || null"
        [attr.aria-describedby]="ariaDescribedBy() || null"
        [attr.aria-invalid]="shouldShowInvalid()"
        (change)="valueChange.emit($event.target.value)"
        (blur)="blur.emit()"
      />
    } @else {
      <input
        type="email"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [attr.aria-label]="ariaLabel() || null"
        [attr.aria-required]="required() || null"
        [attr.aria-describedby]="ariaDescribedBy() || null"
        (change)="valueChange.emit($event.target.value)"
        (blur)="blur.emit()"
      />
    }
  `,
  styles: [`
    input {
      padding: var(--gf-space-2) var(--gf-space-3);
      border: 1px solid var(--gf-color-border);
      border-radius: var(--gf-radius-sm);
      font: inherit;
      font-size: 1rem;
      line-height: 1.5;
      width: 100%;
      box-sizing: border-box;
    }
    input:focus {
      outline: 2px solid var(--gf-color-primary);
      outline-offset: 2px;
    }
    input:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    input[aria-invalid="true"] {
      border-color: var(--gf-color-danger-fg);
    }
  `],
})
export class GfEmailInput implements AsyncValidator {
  readonly placeholder = input('ej. juan@comsatel.com.pe');
  readonly required = input(false);
  readonly invalid = input(false);
  readonly disabled = input(false);
  readonly ariaLabel = input('');
  readonly ariaDescribedBy = input('');
  readonly control = input<FormControl | null>(null);
  readonly emailCheckFn = input<() => Observable<{ available: boolean; person?: string }> | null>(
    null
  );

  readonly shouldShowInvalid = computed(() => {
    const ctrl = this.control();
    return ctrl?.invalid && ctrl?.touched ? 'true' : null;
  });

  readonly valueChange = output<string>();
  readonly blur = output<void>();

  /**
   * Creates an async validator for unique active email checking.
   * Debounces for 300ms and times out after 5s.
   */
  createUniqueActiveValidator(
    checkFn: () => Observable<{ available: boolean; person?: string }>
  ): AsyncValidator | null {
    if (!checkFn) return null;

    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return timer(300).pipe(
        switchMap(() => checkFn()),
        timeout(5000),
        map((result) => {
          if (result.available) {
            return null;
          }
          return {
            duplicate: {
              person: result.person || 'Unknown',
            },
          };
        }),
        catchError(() => {
          // On timeout or other errors, return null to not block submission
          return of(null);
        })
      );
    };
  }

  /**
   * Standalone unique active validator for form control.
   */
  uniqueActiveValidator = (control: AbstractControl): Observable<ValidationErrors | null> => {
    const checkFn = this.emailCheckFn?.();
    if (!checkFn || !control.value) {
      return of(null);
    }

    return timer(300).pipe(
      switchMap(() => checkFn),
      timeout(5000),
      map((result) => {
        if (result.available) {
          return null;
        }
        return {
          duplicate: {
            person: result.person || 'Unknown',
          },
        };
      }),
      catchError(() => {
        return of(null);
      })
    );
  };
}
