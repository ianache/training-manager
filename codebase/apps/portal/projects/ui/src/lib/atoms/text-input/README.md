# gf-text-input

Text input component with accessibility support.

## Usage

```typescript
<gf-text-input
  [type]="'email'"
  [value]="email"
  [required]="true"
  [invalid]="emailError"
  [ariaLabel]="'Email address'"
  (valueChange)="email = $event"
  (blur)="validateEmail()"
/>
```

## Inputs
- `type`: 'text' | 'email' | 'password' | 'number' (default: 'text')
- `value`: current value
- `required`: mark field as required (sets aria-required)
- `invalid`: mark field as invalid (sets aria-invalid)
- `disabled`: disable input
- `ariaLabel`: accessible label

## Outputs
- `valueChange`: emits on input change
- `blur`: emits on input blur

## Accessibility
- ✅ aria-required, aria-invalid, aria-label
- ✅ Focus visible (2px outline)
- ✅ Keyboard navigation
