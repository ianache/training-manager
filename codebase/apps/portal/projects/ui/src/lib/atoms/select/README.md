# gf-select

Select dropdown component with accessibility support.

## Usage

```typescript
<gf-select [value]="selectedRole" (valueChange)="onRoleChange($event)">
  <option value="">-- Select --</option>
  <option value="admin">Admin</option>
  <option value="user">User</option>
</gf-select>
```

## Inputs
- `value`: current selected value
- `disabled`: disable select
- `ariaLabel`: accessible label

## Outputs
- `valueChange`: emits on selection change

## Accessibility
- ✅ aria-label support
- ✅ Focus visible (2px outline)
