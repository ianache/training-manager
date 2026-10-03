import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of } from 'rxjs';
import { RegisterCollaboratorPage } from './register-collaborator.page';
import { RegisterCollaboratorApi } from './register-collaborator.api';

describe('RegisterCollaboratorPage (DOM)', () => {
  let fixture: ComponentFixture<RegisterCollaboratorPage>;
  let el: HTMLElement;
  const api = {
    emailInUse: vi.fn(() => of(false)),
    create: vi.fn(),
    getParty: vi.fn(),
    searchUnits: vi.fn(() => of([])),
    searchProviders: vi.fn(() => of([])),
    searchManagers: vi.fn(() => of([])),
    roles: vi.fn(() => of([])),
  };

  const tick = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const q = <T extends HTMLElement>(sel: string) => el.querySelector<T>(sel);
  const nextBtn = () => [...el.querySelectorAll<HTMLButtonElement>('gf-button button')].find((b) => /Siguiente/.test(b.textContent ?? ''))!;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterCollaboratorPage],
      providers: [
        { provide: RegisterCollaboratorApi, useValue: api },
        { provide: Router, useValue: { navigateByUrl: vi.fn() } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(RegisterCollaboratorPage);
    el = fixture.nativeElement;
    await tick();
  });

  it('SCR-015-01: dos tarjetas de tipo, sin selección y Siguiente deshabilitado', () => {
    expect(q('h1')?.textContent).toContain('Registrar un colaborador');
    expect(q('#rc-tipo-question')?.textContent).toContain('¿Qué tipo de colaborador deseas registrar?');
    const radios = el.querySelectorAll<HTMLInputElement>('input[type=radio]');
    expect(radios.length).toBe(2);
    expect([...radios].every((r) => !r.checked)).toBe(true);
    expect(nextBtn().disabled).toBe(true);
  });

  it('elegir Empleado habilita Siguiente y muestra «Datos de la persona» con progreso accesible', async () => {
    el.querySelectorAll<HTMLInputElement>('input[type=radio]')[0].click();
    await tick();
    expect(nextBtn().disabled).toBe(false);
    nextBtn().click();
    await tick();
    expect(q('#rc-step-title')?.textContent).toContain('Datos de la persona');
    expect(q('[role=progressbar]')?.getAttribute('aria-valuetext')).toBe('Paso 1 de 6');
    expect(el.textContent).toContain('Tipo: Empleado');
    expect(el.textContent).toContain('Si el usuario prefiere un nombre corto o un apodo, indícalo.');
  });

  it('cada campo tiene label asociado y el error «Requerido» usa role=alert con aria-invalid', async () => {
    el.querySelectorAll<HTMLInputElement>('input[type=radio]')[1].click();
    await tick();
    nextBtn().click();
    await tick();
    const input = q<HTMLInputElement>('#rc-nombres')!;
    expect(el.querySelector('label[for="rc-nombres"]')).toBeTruthy();
    expect(input.getAttribute('aria-required')).toBe('true');
    input.dispatchEvent(new Event('blur'));
    await tick();
    expect(input.getAttribute('aria-invalid')).toBe('true');
    const msg = q('#rc-nombres-msg')!;
    expect(msg.getAttribute('role')).toBe('alert');
    expect(msg.textContent).toContain('Requerido');
    expect(input.getAttribute('aria-describedby')).toContain('rc-nombres-msg');
    expect(nextBtn().disabled).toBe(true);
  });

  it('completar nombres y apellidos habilita Siguiente y pasa a Identificación', async () => {
    el.querySelectorAll<HTMLInputElement>('input[type=radio]')[0].click();
    await tick();
    nextBtn().click();
    await tick();
    for (const [id, value] of [['rc-nombres', 'Carlos'], ['rc-apellidos', 'Mendoza']]) {
      const i = q<HTMLInputElement>('#' + id)!;
      i.value = value;
      i.dispatchEvent(new Event('input'));
    }
    await tick();
    expect(nextBtn().disabled).toBe(false);
    nextBtn().click();
    await tick();
    expect(q('#rc-step-title')?.textContent).toContain('Identificación');
    expect(el.textContent).toContain('Los datos serán validados automáticamente.');
  });

  it('Unidad sin registros muestra E2 con Volver y «Crear unidad» deshabilitado', async () => {
    el.querySelectorAll<HTMLInputElement>('input[type=radio]')[0].click();
    await tick();
    const store = (fixture.componentInstance as unknown as { store: { patch(p: object): void; goToStep(s: string): void } }).store;
    store.patch({ firstNames: 'A', lastNames: 'B', idNumber: '12345678', email: 'a@b.co' });
    store.goToStep('organizacion');
    await tick();
    expect(el.textContent).toContain('No hay unidades registradas. Crea una primero (US-017).');
    const create = [...el.querySelectorAll<HTMLButtonElement>('gf-button button')].find((b) => /Crear unidad/.test(b.textContent ?? ''))!;
    expect(create.disabled).toBe(true);
  });
});
