import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { GfActiveFilter, GfActiveFilters } from './active-filters';

@Component({
  imports: [GfActiveFilters],
  template: `<gf-active-filters [filters]="filters()" (cleared)="count.update(c => c + 1)" />`,
})
class Host {
  filters = signal<readonly GfActiveFilter[]>([
    { id: 'estado', label: 'Estado', value: 'Activa' },
    { id: 'q', label: 'Búsqueda', value: 'Ingeniería' },
  ]);
  count = signal(0);
}

describe('GfActiveFilters (CMP-MOL-013)', () => {
  let fixture: ComponentFixture<Host>;
  const el = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  it('renderiza un chip «etiqueta: valor» por filtro', () => {
    const chips = Array.from(el().querySelectorAll('gf-chip')).map((c) => c.textContent?.trim());
    expect(chips).toEqual(['Estado: Activa', 'Búsqueda: Ingeniería']);
  });

  it('el contenedor es role=group con aria-label «Filtros activos»', () => {
    const g = el().querySelector('[role="group"]');
    expect(g?.getAttribute('aria-label')).toBe('Filtros activos');
  });

  it('el botón «Limpiar filtros» emite cleared al hacer clic', () => {
    const b = Array.from(el().querySelectorAll('button')).find((x) => x.textContent?.trim() === 'Limpiar filtros');
    expect(b).toBeDefined();
    b!.click();
    expect(fixture.componentInstance.count()).toBe(1);
  });

  it('«Limpiar filtros» está deshabilitado sin filtros y no emite', () => {
    fixture.componentInstance.filters.set([]);
    fixture.detectChanges();
    const b = el().querySelector('button') as HTMLButtonElement;
    expect(b.disabled).toBe(true);
    b.click();
    expect(fixture.componentInstance.count()).toBe(0);
  });

  it('la región role=status está vacía en la carga inicial (no anuncia lo que ya estaba)', () => {
    const s = el().querySelector('[role="status"]');
    expect(s).not.toBeNull();
    expect(s!.textContent?.trim()).toBe('');
  });

  it('al cambiar los filtros la región role=status anuncia «N filtro(s) activo(s)» (texto propuesto)', () => {
    fixture.componentInstance.filters.set([{ id: 'estado', label: 'Estado', value: 'Activa' }]);
    fixture.detectChanges();
    expect(el().querySelector('[role="status"]')!.textContent?.trim()).toBe('1 filtro activo');
    fixture.componentInstance.filters.update((f) => [...f, { id: 'q', label: 'Búsqueda', value: 'x' }]);
    fixture.detectChanges();
    expect(el().querySelector('[role="status"]')!.textContent?.trim()).toBe('2 filtros activos');
  });

  it('«cleared» no mueve el foco (lo hace la página)', () => {
    const b = el().querySelector('button') as HTMLButtonElement;
    b.focus();
    b.click();
    fixture.detectChanges();
    expect(document.activeElement).toBe(b);
  });
});
