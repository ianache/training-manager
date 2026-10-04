import { NgTemplateOutlet } from '@angular/common';
import { GfIcon } from '../../atoms/icon/icon';
import { ChangeDetectionStrategy, Component, Directive, TemplateRef, ElementRef, computed, contentChild, effect, inject, signal, untracked, input, model, output } from '@angular/core';

export interface GfTreeNode<T = unknown> {
  readonly id: string;
  /** Nombre accesible del nodo. */
  readonly label: string;
  readonly children?: readonly GfTreeNode<T>[];
  /** Datos para la plantilla (estado, vigencia). */
  readonly data?: T;
  readonly disabled?: boolean;
}

/** Plantilla de nodo: `<ng-template gfTreeNodeDef let-node>`. Debe producir texto, no solo color (WCAG 1.4.1). */
@Directive({ selector: 'ng-template[gfTreeNodeDef]' })
export class GfTreeNodeDef {
  readonly template = inject(TemplateRef);
}

/** CMP-ORG-010 — Árbol (CMP-018 §3.10). */
@Component({
  selector: 'gf-tree',
  imports: [NgTemplateOutlet, GfIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { display: block; }
    .gf-tree, .gf-tree__group { list-style: none; margin: 0; padding: 0; }
    .gf-tree__group { padding-inline-start: var(--gf-space-6); }
    [role='treeitem'] { min-height: var(--gf-row-height); }
    .gf-tree__toggle { display: inline-flex; vertical-align: middle; cursor: pointer; transition: transform 0.1s; }
    .gf-tree__toggle--open { transform: rotate(90deg); }
    .gf-tree__label { cursor: pointer; }
    [aria-selected='true'] > .gf-tree__label { background: var(--gf-color-surface-selected); font-weight: var(--gf-font-weight-semibold); }
    [aria-disabled='true'] > .gf-tree__label { opacity: 0.5; cursor: not-allowed; }
  `,
  template: `<ul role="tree" class="gf-tree" [attr.aria-label]="treeLabel()" (keydown)="onKeydown($event)" (focusin)="onFocusIn($event)">
      <ng-container [ngTemplateOutlet]="branch" [ngTemplateOutletContext]="{ $implicit: nodes(), level: 1 }" />
    </ul>
    <ng-template #branch let-list let-level="level">
      @for (node of list; track node.id; let i = $index; let n = $count) {
        <li role="treeitem" [attr.tabindex]="node.id === tabStopId() ? 0 : -1" [attr.data-node-id]="node.id" [attr.aria-level]="level" [attr.aria-setsize]="n" [attr.aria-posinset]="i + 1"
            [attr.aria-disabled]="node.disabled ? true : null" [attr.aria-selected]="node.id === selectedId()" [attr.aria-expanded]="node.children?.length ? expandedIds().has(node.id) : null">
          @if (node.children?.length) {
            <span class="gf-tree__toggle" aria-hidden="true" [class.gf-tree__toggle--open]="expandedIds().has(node.id)" (click)="toggle(node)"
              ><gf-icon name="chevron_right" [decorative]="true" size="1rem"
            /></span>
          }
          <span class="gf-tree__label" (click)="activate(node)">
            @if (nodeDef(); as def) {
              <ng-container [ngTemplateOutlet]="def.template" [ngTemplateOutletContext]="{ $implicit: node }" />
            } @else {
              {{ node.label }}
            }
          </span>
          @if (node.children?.length && expandedIds().has(node.id)) {
            <ul role="group" class="gf-tree__group">
              <ng-container [ngTemplateOutlet]="branch" [ngTemplateOutletContext]="{ $implicit: node.children, level: level + 1 }" />
            </ul>
          }
        </li>
      }
    </ng-template>
`,
})
export class GfTree<T = unknown> {
  readonly nodes = input.required<readonly GfTreeNode<T>[]>();
  readonly treeLabel = input.required<string>();
  readonly expandedIds = model<ReadonlySet<string>>(new Set());
  readonly selectedId = model<string | null>(null);
  readonly nodeActivated = output<GfTreeNode<T>>();

  /** Nodos visibles en orden de lectura, con su padre y nivel. */
  protected readonly visible = computed(() => {
    const out: { node: GfTreeNode<T>; parentId: string | null; level: number }[] = [];
    const expanded = this.expandedIds();
    const walk = (list: readonly GfTreeNode<T>[], parentId: string | null, level: number) => {
      for (const node of list) {
        out.push({ node, parentId, level });
        if (node.children?.length && expanded.has(node.id)) walk(node.children, node.id, level + 1);
      }
    };
    walk(this.nodes(), null, 1);
    return out;
  });

  /** Id del único nodo con tabindex=0 (roving). */
  protected readonly tabStopId = computed(() => {
    const v = this.visible();
    const f = this.focusedId();
    return v.some((e) => e.node.id === f) ? f : (v[0]?.node.id ?? null);
  });
  protected readonly nodeDef = contentChild(GfTreeNodeDef);
  private readonly focusedId = signal<string | null>(null);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Padre de cada nodo (todo el árbol, visible o no). */
  private readonly parents = computed(() => {
    const map = new Map<string, string | null>();
    const walk = (list: readonly GfTreeNode<T>[], parent: string | null) => {
      for (const n of list) {
        map.set(n.id, parent);
        if (n.children) walk(n.children, n.id);
      }
    };
    walk(this.nodes(), null);
    return map;
  });

  constructor() {
    // Si el nodo con el foco deja de ser visible (el consumidor contrajo un ancestro), el foco pasa al
    // ancestro visible más cercano ANTES de que el DOM del nodo se elimine.
    effect(() => {
      const focused = this.focusedId();
      const vis = this.visible();
      if (!focused || vis.some((e) => e.node.id === focused)) return;
      const parents = this.parents();
      let anc = parents.get(focused) ?? null;
      while (anc && !vis.some((e) => e.node.id === anc)) anc = parents.get(anc) ?? null;
      untracked(() => {
        const hadFocus = this.host.nativeElement.contains(document.activeElement);
        this.focusedId.set(anc);
        if (hadFocus && anc) this.focusNode(anc);
      });
    });
  }

  protected onFocusIn(event: FocusEvent): void {
    const li = (event.target as HTMLElement).closest<HTMLElement>('[role="treeitem"]');
    if (li?.dataset['nodeId']) this.focusedId.set(li.dataset['nodeId']);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const li = (event.target as HTMLElement).closest<HTMLElement>('[role="treeitem"]');
    if (!li) return;
    const v = this.visible();
    const idx = v.findIndex((e) => e.node.id === li.dataset['nodeId']);
    if (idx < 0) return;
    let target = -1;
    switch (event.key) {
      case 'ArrowDown': target = idx + 1; break;
      case 'ArrowUp': target = idx - 1; break;
      case 'ArrowRight': {
        const n = v[idx].node;
        if (!n.children?.length) return;
        event.preventDefault();
        if (!this.expandedIds().has(n.id)) this.setExpanded(n.id, true);
        else this.focusNode(n.children[0].id);
        return;
      }
      case 'Enter':
        event.preventDefault();
        this.activate(v[idx].node);
        return;
      case ' ':
        event.preventDefault();
        if (!v[idx].node.disabled) this.selectedId.set(v[idx].node.id);
        return;
      case 'Home': target = 0; break;
      case 'End': target = v.length - 1; break;
      case 'ArrowLeft': {
        const e = v[idx];
        event.preventDefault();
        if (e.node.children?.length && this.expandedIds().has(e.node.id)) this.setExpanded(e.node.id, false);
        else if (e.parentId) this.focusNode(e.parentId);
        return;
      }
      default: return;
    }
    event.preventDefault();
    if (target >= 0 && target < v.length) this.focusNode(v[target].node.id);
  }

  protected activate(node: GfTreeNode<T>): void {
    if (node.disabled) return;
    this.focusNode(node.id);
    this.nodeActivated.emit(node);
  }

  protected toggle(node: GfTreeNode<T>): void {
    this.setExpanded(node.id, !this.expandedIds().has(node.id));
  }

  private setExpanded(id: string, open: boolean): void {
    const next = new Set(this.expandedIds());
    if (open) next.add(id);
    else next.delete(id);
    this.expandedIds.set(next);
  }

  private focusNode(id: string): void {
    this.focusedId.set(id);
    this.host.nativeElement.querySelector<HTMLElement>(`[role="treeitem"][data-node-id="${CSS.escape(id)}"]`)?.focus();
  }
}
