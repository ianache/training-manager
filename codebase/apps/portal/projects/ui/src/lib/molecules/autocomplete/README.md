# gf-autocomplete

Autocomplete molecule with async search support.

## Usage

```typescript
<gf-autocomplete
  label="Search units"
  [required]="true"
  [searchFn]="searchUnits.bind(this)"
  (selected)="onUnitSelected($event)"
/>
```

## Inputs
- `label`: field label
- `required`: mark as required
- `searchFn`: async search function returning Observable<any[]>

## Outputs
- `selected`: emits when option is selected

## Accessibility
- ✅ role=combobox on input
- ✅ aria-expanded tracking
- ✅ role=listbox on options
- ✅ Debounce 300ms to reduce API load
