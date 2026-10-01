# gf-form-field

Form field molecule combining label, input, error, and hint.

## Usage

```typescript
<gf-form-field
  label="Email"
  type="email"
  [value]="email"
  [required]="true"
  [error]="emailError"
  hint="We'll never share your email"
  (valueChange)="email = $event"
/>
```

## Inputs
- `label`: field label
- `type`: input type
- `value`: current value
- `required`: mark as required
- `error`: error message
- `hint`: helper text

## Outputs
- `valueChange`: emits on value change

## Accessibility
- ✅ Label linked to input
- ✅ Error message with role=alert
- ✅ Full field validation support
