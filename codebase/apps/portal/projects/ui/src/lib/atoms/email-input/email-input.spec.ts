import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NEVER, Observable, firstValueFrom, of, throwError } from 'rxjs';
import { GfEmailInput } from './email-input';

describe('GfEmailInput', () => {
  let component: GfEmailInput;
  let fixture: ComponentFixture<GfEmailInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GfEmailInput, ReactiveFormsModule]
    }).compileComponents();
    fixture = TestBed.createComponent(GfEmailInput);
    component = fixture.componentInstance;
  });

  const input = () => fixture.nativeElement.querySelector('input') as HTMLInputElement;

  describe('Basic rendering', () => {
    it('should render email input', () => {
      fixture.detectChanges();
      expect(input()).toBeTruthy();
      expect(input().type).toBe('email');
    });

    it('should set placeholder', () => {
      fixture.componentRef.setInput('placeholder', 'ej. juan@comsatel.com.pe');
      fixture.detectChanges();
      expect(input().placeholder).toBe('ej. juan@comsatel.com.pe');
    });

    it('emite valueChange con el valor cuando el usuario cambia el campo', () => {
      fixture.detectChanges();
      const emitted: string[] = [];
      component.valueChange.subscribe((v: string) => emitted.push(v));
      input().value = 'test@example.com';
      input().dispatchEvent(new Event('change'));
      expect(emitted).toEqual(['test@example.com']);
    });

    it('emite blur al perder el foco', () => {
      fixture.detectChanges();
      const spy = vi.fn();
      component.blur.subscribe(spy);
      input().dispatchEvent(new Event('blur'));
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Email format validation', () => {
    it('should validate email format', () => {
      const control = new FormControl('', Validators.email);
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      control.setValue('invalid-email');
      expect(control.hasError('email')).toBe(true);

      control.setValue('valid@example.com');
      expect(control.hasError('email')).toBe(false);
    });
  });

  describe('Async uniqueActive validator (debounce 300 ms, timeout 5 s)', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    const run = async (checkFn: () => Observable<{ available: boolean; person?: string }>, value = 'test@example.com') => {
      const validator = component.createUniqueActiveValidator(checkFn)!;
      const result = firstValueFrom(validator(new FormControl(value)));
      await vi.advanceTimersByTimeAsync(300);
      return result;
    };

    it('devuelve null cuando el correo está disponible', async () => {
      expect(await run(() => of({ available: true }))).toBeNull();
    });

    it('devuelve el error duplicate con la persona cuando el correo está en uso', async () => {
      expect(await run(() => of({ available: false, person: 'Juan Pérez' }))).toEqual({ duplicate: { person: 'Juan Pérez' } });
    });

    it('usa «Unknown» si el servicio no informa la persona', async () => {
      expect(await run(() => of({ available: false }))).toEqual({ duplicate: { person: 'Unknown' } });
    });

    it('no bloquea si la consulta falla', async () => {
      expect(await run(() => throwError(() => new Error('down')))).toBeNull();
    });

    it('no bloquea si la consulta no responde en 5 s', async () => {
      const validator = component.createUniqueActiveValidator(() => NEVER)!;
      const result = firstValueFrom(validator(new FormControl('test@example.com')));
      await vi.advanceTimersByTimeAsync(300 + 5000);
      expect(await result).toBeNull();
    });

    it('un valor vacío no consulta al servicio', async () => {
      const checkFn = vi.fn(() => of({ available: true }));
      const validator = component.createUniqueActiveValidator(checkFn)!;
      expect(await firstValueFrom(validator(new FormControl('')))).toBeNull();
      await vi.advanceTimersByTimeAsync(1000);
      expect(checkFn).not.toHaveBeenCalled();
    });

    it('espera el debounce antes de consultar', async () => {
      const checkFn = vi.fn(() => of({ available: true }));
      const validator = component.createUniqueActiveValidator(checkFn)!;
      validator(new FormControl('test@example.com')).subscribe();
      await vi.advanceTimersByTimeAsync(299);
      expect(checkFn).not.toHaveBeenCalled();
      await vi.advanceTimersByTimeAsync(2);
      expect(checkFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should set aria-required', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      expect(input().getAttribute('aria-required')).toBe('true');
    });

    it('should set aria-describedby', () => {
      fixture.componentRef.setInput('ariaDescribedBy', 'ayuda-correo');
      fixture.detectChanges();
      expect(input().getAttribute('aria-describedby')).toBe('ayuda-correo');
    });

    it('marca aria-invalid solo cuando el control es inválido y fue tocado', () => {
      const control = new FormControl('invalid', Validators.email);
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();
      expect(input().getAttribute('aria-invalid')).toBeNull();
      control.markAsTouched();
      fixture.detectChanges();
      expect(input().getAttribute('aria-invalid')).toBe('true');
    });
  });

  describe('States', () => {
    it('un control válido no marca error', () => {
      const control = new FormControl('valid@example.com', Validators.email);
      control.markAsTouched();
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();
      expect(component.shouldShowInvalid()).toBeNull();
    });

    it('un error duplicate en un control tocado se muestra como inválido', () => {
      // setErrors() antes de enlazar lo borra la revalidación del directiva formControl: se usa un validador real.
      const control = new FormControl('duplicate@example.com', () => ({ duplicate: { person: 'Juan Pérez' } }));
      control.markAsTouched();
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();
      expect(control.hasError('duplicate')).toBe(true);
      expect(component.shouldShowInvalid()).toBe('true');
    });
  });
});


describe('GfEmailInput — aria-invalid tras la interacción del usuario', () => {
  it('pasa a aria-invalid=true cuando el usuario sale de un campo obligatorio vacío', async () => {
    await TestBed.configureTestingModule({ imports: [GfEmailInput, ReactiveFormsModule] }).compileComponents();
    const fixture = TestBed.createComponent(GfEmailInput);
    const control = new FormControl('', Validators.required);
    fixture.componentRef.setInput('control', control);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('input') as HTMLElement;
    expect(el.getAttribute('aria-invalid')).toBeNull();

    el.dispatchEvent(new Event('blur')); // el value accessor del formControl marca el control como tocado
    fixture.detectChanges();

    expect(control.touched).toBe(true);
    expect(el.getAttribute('aria-invalid')).toBe('true');
  });
});
