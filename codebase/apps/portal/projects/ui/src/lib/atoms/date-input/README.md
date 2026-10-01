# gf-date-input

Date input component with accessibility support.

## Usage

```typescript
<gf-date-input
  [value]="selectedDate"
  [ariaLabel]="'Birth date'"
  (valueChange)="onDateChange($event)"
/>
```

## Inputs
- `value`: current date value (YYYY-MM-DD format)
- `disabled`: disable input
- `ariaLabel`: accessible label

## Outputs
- `valueChange`: emits on date change

## Accessibility
- ✅ aria-label support
- ✅ Focus visible (2px outline)
