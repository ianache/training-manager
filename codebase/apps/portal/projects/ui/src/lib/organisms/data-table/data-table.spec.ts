import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal, viewChild } from '@angular/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { GfCellDef, GfDataTable, GfRowActions, GfSort, GfTableColumn } from './data-table';

interface Row { id: string; name: string; state: string; since: string }

@Component({
  imports: [GfDataTable, GfCellDef, GfRowActions],
  template: `
    <gf-data-table
      [columns]="columns()"
      [rows]="rows()"
      [rowId]="rowId"
      caption="Unidades organizacionales"
      [captionHidden]="captionHidden()"
      [(sort)]="sort"
      [loading]="loading()"
      [highlightedRowId]="highlighted()"
    >
      <ng-template gfCellDef="state" let-row><b class="state">{{ row.state }}!</b></ng-template>
      <ng-template gfRowActions let-row><button type="button" class="act">Editar {{ row.name }}</button></ng-template>
      <p gfTableEmpty class="empty">Sin unidades</p>
    </gf-data-table>
  `,
})
class Host {
  columns = signal<readonly GfTableColumn<Row>[]>([
    { id: 'name', header: 'Nombre', sortable: true, cell: (r) => r.name },
    { id: 'state', header: 'Estado' },
    { id: 'since', header: 'Vigente desde', sortable: true, cell: (r) => r.since },
  ]);
  rows = signal<readonly Row[]>([
    { id: 'u2', name: 'Zeta', state: 'Activa', since: '2026-02-01' },
    { id: 'u1', name: 'Alfa', state: 'Inactiva', since: '2026-01-01' },
  ]);
  rowId = (r: Row) => r.id;
  captionHidden = signal(false);
  sort = signal<GfSort | null>(null);
  loading = signal(false);
  highlighted = signal<string | null>(null);
  table = viewChild.required(GfDataTable<Row>);
}

describe('GfDataTable (CMP-ORG-009)', () => {
  let fixture: ComponentFixture<Host>;
  const el = () => fixture.nativeElement as HTMLElement;
  const flush = () => fixture.detectChanges();

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    flush();
  });

  it('renderiza <caption> con el texto de caption', () => {
    expect(el().querySelector('table > caption')?.textContent?.trim()).toBe('Unidades organizacionales');
  });

  it('captionHidden oculta el caption solo visualmente (sigue en el DOM)', () => {
    const cap = () => el().querySelector('caption')!;
    expect(cap().classList.contains('gf-table__caption--hidden')).toBe(false);
    fixture.componentInstance.captionHidden.set(true);
    flush();
    expect(cap().classList.contains('gf-table__caption--hidden')).toBe(true);
    expect(cap().textContent?.trim()).toBe('Unidades organizacionales');
  });

  it('encabezados: th scope=col por columna y «Acciones» al final cuando hay plantilla gfRowActions', () => {
    const ths = Array.from(el().querySelectorAll('thead th'));
    expect(ths.map((t) => t.textContent?.trim())).toEqual(['Nombre', 'Estado', 'Vigente desde', 'Acciones']);
    expect(ths.every((t) => t.getAttribute('scope') === 'col')).toBe(true);
  });

  it('filas: una por dato en el orden recibido; la primera columna es th scope=row y las demás td con cell(row)', () => {
    const trs = Array.from(el().querySelectorAll('tbody tr'));
    expect(trs.length).toBe(2);
    expect(trs.map((r) => r.querySelector('th[scope="row"]')?.textContent?.trim())).toEqual(['Zeta', 'Alfa']);
    expect(Array.from(trs[0].querySelectorAll('td')).map((c) => c.textContent?.trim()).slice(1, 2)).toEqual(['2026-02-01']);
  });

  it('gfCellDef: una columna sin cell() usa la plantilla del consumidor con la fila como contexto', () => {
    const tds = Array.from(el().querySelectorAll('tbody tr:first-child td'));
    expect(tds[0].querySelector('.state')?.textContent).toBe('Activa!');
  });

  it('gfRowActions: cada fila tiene una última celda con la plantilla de acciones y la fila como contexto', () => {
    const rows = Array.from(el().querySelectorAll('tbody tr'));
    expect(rows.map((r) => r.querySelector('td:last-child .act')?.textContent)).toEqual(['Editar Zeta', 'Editar Alfa']);
  });

  it('aria-sort: solo en th ordenables; «none» sin orden y ascending/descending en la columna ordenada', () => {
    const th = (i: number) => el().querySelectorAll('thead th')[i];
    expect(th(0).getAttribute('aria-sort')).toBe('none');
    expect(th(1).hasAttribute('aria-sort')).toBe(false);
    expect(th(2).getAttribute('aria-sort')).toBe('none');
    expect(th(3).hasAttribute('aria-sort')).toBe(false);
    fixture.componentInstance.sort.set({ columnId: 'name', direction: 'asc' });
    flush();
    expect(th(0).getAttribute('aria-sort')).toBe('ascending');
    expect(th(2).getAttribute('aria-sort')).toBe('none');
    fixture.componentInstance.sort.set({ columnId: 'name', direction: 'desc' });
    flush();
    expect(th(0).getAttribute('aria-sort')).toBe('descending');
  });

  it('el encabezado ordenable contiene un botón con el texto de la columna; los no ordenables no', () => {
    const ths = Array.from(el().querySelectorAll('thead th'));
    expect(ths[0].querySelector('button')?.textContent?.trim()).toBe('Nombre');
    expect(ths[1].querySelector('button')).toBeNull();
    expect(ths[2].querySelector('button')?.textContent?.trim()).toBe('Vigente desde');
  });

  it('clic en el botón de orden: ciclo sin orden → asc → desc → asc (propuesto) y la intención llega por sort', () => {
    const btn = () => el().querySelectorAll('thead th')[0].querySelector('button') as HTMLButtonElement;
    btn().click(); flush();
    expect(fixture.componentInstance.sort()).toEqual({ columnId: 'name', direction: 'asc' });
    btn().click(); flush();
    expect(fixture.componentInstance.sort()).toEqual({ columnId: 'name', direction: 'desc' });
    btn().click(); flush();
    expect(fixture.componentInstance.sort()).toEqual({ columnId: 'name', direction: 'asc' });
  });

  it('el orden activo se anuncia en una región role=status (texto propuesto); vacía sin orden', () => {
    const status = () => el().querySelector('.gf-table__sr[role="status"]')!;
    expect(status().textContent?.trim()).toBe('');
    fixture.componentInstance.sort.set({ columnId: 'name', direction: 'asc' });
    flush();
    expect(status().textContent?.trim()).toBe('Ordenado por Nombre, ascendente');
    fixture.componentInstance.sort.set({ columnId: 'since', direction: 'desc' });
    flush();
    expect(status().textContent?.trim()).toBe('Ordenado por Vigente desde, descendente');
  });

  it('loading: aria-busy=true en la tabla y el estado anuncia «Cargando información»', () => {
    const table = () => el().querySelector('table')!;
    expect(table().getAttribute('aria-busy')).toBeNull();
    fixture.componentInstance.loading.set(true);
    flush();
    expect(table().getAttribute('aria-busy')).toBe('true');
    expect(el().querySelector('.gf-table__sr[role="status"]')!.textContent).toContain('Cargando información');
  });

  it('loading: muestra un gf-spinner y no las filas de datos (propuesto)', () => {
    expect(el().querySelector('gf-spinner')).toBeNull();
    fixture.componentInstance.loading.set(true);
    flush();
    expect(el().querySelector('tbody gf-spinner')).not.toBeNull();
    expect(el().querySelector('tbody .act')).toBeNull();
  });

  it('highlightedRowId: solo esa fila lleva aria-current=true y la clase de resaltado (propuesto)', () => {
    fixture.componentInstance.highlighted.set('u1');
    flush();
    const trs = Array.from(el().querySelectorAll('tbody tr'));
    expect(trs.map((r) => r.getAttribute('aria-current'))).toEqual([null, 'true']);
    expect(trs.map((r) => r.classList.contains('gf-table__row--highlighted'))).toEqual([false, true]);
  });

  it('slot [gfTableEmpty]: se muestra solo cuando no hay filas y no se está cargando', () => {
    const empty = () => el().querySelector('.empty');
    expect(empty()).toBeNull();
    fixture.componentInstance.rows.set([]);
    flush();
    expect(empty()?.textContent).toBe('Sin unidades');
    fixture.componentInstance.loading.set(true);
    flush();
    expect(empty()).toBeNull();
  });

  it('focusRow(id) mueve el foco a esa fila (para devolverlo tras guardar)', () => {
    fixture.componentInstance.table().focusRow('u1');
    const tr = el().querySelectorAll('tbody tr')[1];
    expect(document.activeElement).toBe(tr);
  });

  it('contenedor desplazable: role=region, tabindex=0 y aria-label = caption (propuesto, WCAG 1.4.10)', () => {
    const r = el().querySelector('[role="region"]')!;
    expect(r.getAttribute('tabindex')).toBe('0');
    expect(r.getAttribute('aria-label')).toBe('Unidades organizacionales');
    expect(r.querySelector('table')).not.toBeNull();
  });
});
