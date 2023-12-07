# Angular Advanced Forms

## Start
- `npm run dev`

## Intro
- [customer-editor.component.ts](src/app/page/customer-editor/customer-editor.component.ts)
- [customer-editor.component.html](src/app/page/customer-editor/customer-editor.component.html)

## JSON-based forms
- command: `ng g c common/form-json`
- [FormJsonComp.](src/app/common/form-json/form-json.component.ts)
- [FormJsonComp. html](src/app/common/form-json/form-json.component.html)
- create: `src/app/form/forms.ts`
- [Forms.ts](src/app/form/forms.ts)
- command: `ng g c page/customer-add`
- [CustomersComp: add link to customer-add](src/app/page/customer/customer.component.html)
- [CustomerAddComp: add form-json](src/app/page/customer-add/customer-add.component.ts)

## Async Validation
- [CustomerService: query](src/app/service/customer.service.ts)
- [CustomerStore: createItem()](src/app/store/CustomerStore.ts)
- [CustomerAddComp.](src/app/page/customer-add/customer-add.component.ts)
- [CustomersComp: add button, remove country](src/app/page/customer/customer.component.html)
- [AppRoutes: customer/add](src/app/app.routes.ts)

## Multi-field Validation
- [FormJson: expand interface](src/app/common/form-json/form-json.component.ts)
```typescript
export interface IForm {
  name: string;
  fields: IField[];
  validators?: ValidatorFn[];
}
```
- change settings:
```typescript
if (formSettings.validators) {
  this.form.addValidators(formSettings.validators);
}
```
- [FormJson html](src/app/common/form-json/form-json.component.html)
```html
@for (err of form.errors | keyvalue; track $index) {
  <mat-hint>{{ err.value || 'Error' }}</mat-hint>
}
```
- [Forms.ts](src/app/form/forms.ts)
```typescript
name: 'Add new Customer',
validators: [
  (control: AbstractControl) => {
    const value = control.value;
    if (/^10/.test(value['ip_address']) && /\@\w*\..*$/.test(value['email'])) {
      return {emailIpError: 'Corporate emails cannot have a top-level domain.'};
    }
    return null;
  },
],
```

## ControlValueAccessor - Country Selector
- command: `ng g c common/country-selector`
- [CountrySelector edit](src/app/common/country-selector/country-selector.component.ts)
- [FormJson: ComponentHostDirective, IField, loadComponent, html](src/app/common/form-json/form-json.component.ts)
- [Forms.ts: cmpLoader](src/app/form/forms.ts)
- Template loader
