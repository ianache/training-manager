/** Estilos compartidos por los pasos del asistente (solo tokens --gf-*, nunca colores crudos). */
export const WIZARD_STYLES = `
  :host { display: block; }
  .fields { display: grid; gap: var(--gf-space-6); }
  .row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--gf-space-4); }
  @media (max-width: 767px) { .row { grid-template-columns: 1fr; } }
  .stack { display: grid; gap: var(--gf-space-3); }
  .actions-inline { margin-top: var(--gf-space-3); }
  .alert-title { font-weight: var(--gf-font-weight-semibold); margin: 0; }
  .alert-text { margin: 0; font-size: var(--gf-font-size-sm); }
  .note {
    display: flex; gap: var(--gf-space-3); align-items: flex-start;
    padding: var(--gf-space-3) var(--gf-space-4);
    border: 1px solid color-mix(in srgb, var(--gf-color-border) 45%, transparent);
    border-radius: var(--gf-radius-md);
    background: var(--gf-color-surface-container);
    font-size: var(--gf-font-size-sm); color: var(--gf-color-text-muted);
  }
  .note p { margin: 0; }
  .selection {
    padding: var(--gf-space-3) var(--gf-space-4);
    border: 1px dashed var(--gf-color-border); border-radius: var(--gf-radius-md);
  }
  .selection--set { border-style: solid; background: var(--gf-color-surface-container); }
  .selection--ok { border-color: var(--gf-color-success-fg); background: var(--gf-color-success-bg); color: var(--gf-color-success-fg); }
  .eyebrow { margin: 0 0 var(--gf-space-1); font-size: 0.75rem; letter-spacing: 0.06em; text-transform: uppercase; font-weight: var(--gf-font-weight-semibold); color: var(--gf-color-text-muted); }
  .muted { color: var(--gf-color-text-muted); font-style: italic; margin: 0; }
  .panel-empty {
    display: grid; justify-items: center; gap: var(--gf-space-3); text-align: center;
    padding: var(--gf-space-6) var(--gf-space-4);
    border: 1px solid color-mix(in srgb, var(--gf-color-border) 45%, transparent);
    border-radius: var(--gf-radius-md); background: var(--gf-color-surface-container);
  }
  .panel-empty h3 { margin: 0; font-size: var(--gf-font-size-md); }
  .panel-empty p { margin: 0; font-size: var(--gf-font-size-sm); color: var(--gf-color-text-muted); }
  .panel-empty .icon-circle { display: inline-flex; padding: var(--gf-space-3); border-radius: 50%; background: var(--gf-color-neutral-bg); color: var(--gf-color-neutral-fg); }
  .split { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--gf-space-3); }
  .split--center { align-items: center; }
  .btn-row { display: flex; flex-wrap: wrap; gap: var(--gf-space-2); justify-content: center; }
`;
