# gf-label

Label component with accessibility support.

## Usage

```typescript
<gf-label
  [inputId]="'email-input'"
  [text]="'Email'"
  [required]="true"
/>
```

## Inputs
- `inputId`: ID of associated input
- `text`: label text
- `required`: show asterisk for required fields

## Accessibility
- ✅ Links to input via 'for' attribute
- ✅ Shows asterisk for required fields
- ✅ Semantic label element
