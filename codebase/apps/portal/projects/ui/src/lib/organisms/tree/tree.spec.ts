import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { GfTree, GfTreeNode, GfTreeNodeDef } from './tree';

interface Unit { state: string }

const NODES: readonly GfTreeNode<Unit>[] = [
  {
    id: 'a', label: 'Ingeniería', data: { state: 'Activa' },
    children: [
      { id: 'a1', label: 'Plataforma', data: { state: 'Activa' }, children: [{ id: 'a1a', label: 'SRE', data: { state: 'Inactiva' } }] },
      { id: 'a2', label: 'Datos', data: { state: 'Activa' } },
    ],
  },
  { id: 'b', label: 'Finanzas', data: { state: 'Activa' } },
];

@Component({
  imports: [GfTree],
  template: `<gf-tree
    [nodes]="nodes()"
    treeLabel="Unidades organizacionales"
    [(expandedIds)]="expanded"
    [(selectedId)]="selected"
    (nodeActivated)="activated.push($event.id)"
  />`,
})
class Host {
  nodes = signal<readonly GfTreeNode<Unit>[]>(NODES);
  expanded = signal<ReadonlySet<string>>(new Set());
  selected = signal<string | null>(null);
  activated: string[] = [];
}

describe('GfTree (CMP-ORG-010)', () => {
  let fixture: ComponentFixture<Host>;
  const el = () => fixture.nativeElement as HTMLElement;
  const flush = () => fixture.detectChanges();
  const item = (id: string) => el().querySelector(`[role="treeitem"][data-node-id="${id}"]`) as HTMLElement;
  const items = () => Array.from(el().querySelectorAll('[role="treeitem"]')) as HTMLElement[];
  const key = (id: string, k: string) => {
    item(id).dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
    flush();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    flush();
  });

  it('raíz role=tree con aria-label; las raíces son treeitem con aria-level=1, setsize y posinset', () => {
    const tree = el().querySelector('[role="tree"]')!;
    expect(tree.getAttribute('aria-label')).toBe('Unidades organizacionales');
    const roots = items();
    expect(roots.map((r) => r.textContent?.trim())).toEqual(['Ingeniería', 'Finanzas']);
    expect(roots.map((r) => [r.getAttribute('aria-level'), r.getAttribute('aria-setsize'), r.getAttribute('aria-posinset')])).toEqual([
      ['1', '2', '1'],
      ['1', '2', '2'],
    ]);
  });

  it('nodo con hijos: aria-expanded=false y sin hijos renderizados; la hoja no lleva aria-expanded', () => {
    expect(item('a').getAttribute('aria-expanded')).toBe('false');
    expect(item('b').hasAttribute('aria-expanded')).toBe(false);
    expect(item('a1')).toBeNull();
  });

  it('expandido: aria-expanded=true y sus hijos van en role=group con aria-level+1, setsize y posinset', () => {
    fixture.componentInstance.expanded.set(new Set(['a']));
    flush();
    expect(item('a').getAttribute('aria-expanded')).toBe('true');
    const group = item('a').querySelector(':scope > [role="group"]')!;
    expect(group).not.toBeNull();
    const kids = Array.from(group.querySelectorAll(':scope > [role="treeitem"]')) as HTMLElement[];
    expect(kids.map((k) => k.getAttribute('data-node-id'))).toEqual(['a1', 'a2']);
    expect(kids.map((k) => [k.getAttribute('aria-level'), k.getAttribute('aria-setsize'), k.getAttribute('aria-posinset')])).toEqual([
      ['2', '2', '1'],
      ['2', '2', '2'],
    ]);
    expect(item('a1a')).toBeNull(); // a1 sigue cerrado
  });

  it('roving tabindex: un solo tab stop (el primer nodo visible) y el resto con tabindex=-1', () => {
    fixture.componentInstance.expanded.set(new Set(['a']));
    flush();
    expect(items().map((i) => [i.getAttribute('data-node-id'), i.getAttribute('tabindex')])).toEqual([
      ['a', '0'], ['a1', '-1'], ['a2', '-1'], ['b', '-1'],
    ]);
  });

  it('Flecha abajo / arriba: mueve el foco y el tab stop al nodo visible siguiente / anterior', () => {
    fixture.componentInstance.expanded.set(new Set(['a']));
    flush();
    item('a').focus();
    key('a', 'ArrowDown');
    expect(document.activeElement).toBe(item('a1'));
    expect(items().filter((i) => i.getAttribute('tabindex') === '0').map((i) => i.dataset['nodeId'])).toEqual(['a1']);
    key('a1', 'ArrowDown');
    key('a2', 'ArrowDown');
    expect(document.activeElement).toBe(item('b'));
    key('b', 'ArrowDown'); // en el último no pasa nada
    expect(document.activeElement).toBe(item('b'));
    key('b', 'ArrowUp');
    expect(document.activeElement).toBe(item('a2'));
  });

  it('Flecha derecha: cierra→expande (el foco no se mueve); abierto→primer hijo; hoja→nada', () => {
    item('a').focus();
    key('a', 'ArrowRight');
    expect(fixture.componentInstance.expanded().has('a')).toBe(true);
    expect(item('a').getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(item('a'));
    key('a', 'ArrowRight');
    expect(document.activeElement).toBe(item('a1'));
    key('a1', 'ArrowDown'); // a1a no es visible: a1 sigue cerrado → a2
    key('a2', 'ArrowRight'); // hoja
    expect(document.activeElement).toBe(item('a2'));
    expect(fixture.componentInstance.expanded().has('a2')).toBe(false);
  });

  it('Flecha izquierda: abierto→contrae (foco queda); cerrado/hoja→pasa al padre; en una raíz cerrada no hace nada', () => {
    fixture.componentInstance.expanded.set(new Set(['a']));
    flush();
    item('a2').focus();
    key('a2', 'ArrowLeft');
    expect(document.activeElement).toBe(item('a'));
    key('a', 'ArrowLeft');
    expect(fixture.componentInstance.expanded().has('a')).toBe(false);
    expect(document.activeElement).toBe(item('a'));
    key('a', 'ArrowLeft');
    expect(document.activeElement).toBe(item('a'));
  });

  it('Inicio / Fin: primer / último nodo visible', () => {
    fixture.componentInstance.expanded.set(new Set(['a']));
    flush();
    item('a2').focus();
    key('a2', 'Home');
    expect(document.activeElement).toBe(item('a'));
    key('a', 'End');
    expect(document.activeElement).toBe(item('b'));
  });

  it('Enter activa el nodo (nodeActivated)', () => {
    item('b').focus();
    key('b', 'Enter');
    expect(fixture.componentInstance.activated).toEqual(['b']);
  });

  it('Espacio selecciona (selectedId y aria-selected solo en el seleccionado) sin activar', () => {
    item('b').focus();
    key('b', ' ');
    expect(fixture.componentInstance.selected()).toBe('b');
    expect(items().map((i) => i.getAttribute('aria-selected'))).toEqual(['false', 'true']);
    expect(fixture.componentInstance.activated).toEqual([]);
  });

  it('clic en un nodo lo activa y le da el foco (tab stop); un nodo disabled no se activa (aria-disabled)', () => {
    fixture.componentInstance.nodes.set([...NODES, { id: 'c', label: 'Legal', disabled: true }]);
    flush();
    (item('b').querySelector('.gf-tree__label') as HTMLElement).click();
    flush();
    expect(fixture.componentInstance.activated).toEqual(['b']);
    expect(item('b').getAttribute('tabindex')).toBe('0');
    expect(item('a').getAttribute('tabindex')).toBe('-1');
    expect(item('c').getAttribute('aria-disabled')).toBe('true');
    (item('c').querySelector('.gf-tree__label') as HTMLElement).click();
    key('c', 'Enter');
    expect(fixture.componentInstance.activated).toEqual(['b']);
  });

  it('el indicador de expansión (aria-hidden, no es un botón) alterna con clic; no hay botones dentro de los treeitem', () => {
    const toggle = item('a').querySelector('.gf-tree__toggle') as HTMLElement;
    expect(toggle.getAttribute('aria-hidden')).toBe('true');
    toggle.click();
    flush();
    expect(fixture.componentInstance.expanded().has('a')).toBe(true);
    (item('a').querySelector('.gf-tree__toggle') as HTMLElement).click();
    flush();
    expect(fixture.componentInstance.expanded().has('a')).toBe(false);
    expect(item('b').querySelector('.gf-tree__toggle')).toBeNull(); // hoja
    expect(el().querySelectorAll('[role="treeitem"] button, [role="treeitem"] a, [role="treeitem"] input').length).toBe(0);
  });

  it('si el consumidor contrae un padre cuyo hijo tenía el foco, el foco pasa al padre (no se pierde)', () => {
    fixture.componentInstance.expanded.set(new Set(['a', 'a1']));
    flush();
    item('a1a').focus();
    item('a1a').focus();
    fixture.componentInstance.expanded.set(new Set());
    flush();
    expect(item('a1a')).toBeNull();
    expect(document.activeElement).toBe(item('a'));
    expect(item('a').getAttribute('tabindex')).toBe('0');
  });
});

@Component({
  imports: [GfTree, GfTreeNodeDef],
  template: `<gf-tree [nodes]="nodes" treeLabel="Unidades">
    <ng-template gfTreeNodeDef let-node><span class="def">{{ node.label }} — {{ node.data.state }}</span></ng-template>
  </gf-tree>`,
})
class DefHost {
  nodes = NODES;
}

describe('GfTree con gfTreeNodeDef (CMP-ORG-010)', () => {
  it('la plantilla del consumidor reemplaza el contenido del nodo y recibe el nodo (estado como texto, WCAG 1.4.1)', async () => {
    await TestBed.configureTestingModule({ imports: [DefHost] }).compileComponents();
    const f = TestBed.createComponent(DefHost);
    f.detectChanges();
    const texts = Array.from((f.nativeElement as HTMLElement).querySelectorAll('.def')).map((e) => e.textContent);
    expect(texts).toEqual(['Ingeniería — Activa', 'Finanzas — Activa']);
  });
});
