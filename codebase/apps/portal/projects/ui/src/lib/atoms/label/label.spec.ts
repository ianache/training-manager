import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { GfLabel } from './label';

describe('GfLabel', () => {
  let fixture: ComponentFixture<GfLabel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [GfLabel] }).compileComponents();
    fixture = TestBed.createComponent(GfLabel);
  });

  const label = () => fixture.nativeElement.querySelector('label') as HTMLLabelElement;

  it('muestra el texto de la etiqueta', () => {
    fixture.componentRef.setInput('text', 'Name');
    fixture.detectChanges();
    expect(label().textContent).toContain('Name');
  });

  it('asocia la etiqueta al control con el atributo for', () => {
    fixture.componentRef.setInput('inputId', 'email-input');
    fixture.detectChanges();
    expect(label().htmlFor).toBe('email-input');
  });

  it('muestra el asterisco solo cuando es obligatorio', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[aria-label="required"]')).toBeNull();
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[aria-label="required"]')?.textContent).toContain('*');
  });
});
