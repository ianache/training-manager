# gf-radio-card

Radio button styled as a card molecule.

## Usage

```typescript
<gf-radio-card
  value="empleado"
  label="Empleado"
  description="Trabajador a tiempo completo"
  [checked]="type === 'empleado'"
  (selected)="onTypeSelected($event)"
/>
```

## Inputs
- `value`: radio button value
- `label`: card label
- `description`: card description
- `checked`: whether selected

## Outputs
- `selected`: emits when selected

## Accessibility
- ✅ Standard radio button semantics
- ✅ Label clickable area
