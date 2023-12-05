import { AbstractControl, Validators } from "@angular/forms";
import { IForm } from "../common/form-json/form-json.component";

export const customerAdd: IForm = {
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
  fields: [
    {
      controlType: 'input',
      label: 'Name',
      key: 'name',
      validators: [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9 ]{3,}$'),
      ],
      errorMessage: 'Min. 3 chars',
    },
    {
      controlType: 'input',
      label: 'Email',
      key: 'email',
      validators: [
        Validators.required,
        Validators.email
      ],
      errorMessage: 'Not a valid email',
    },
    {
      controlType: 'input',
      label: 'Address',
      key: 'address',
      validators: [
        Validators.required
      ],
      errorMessage: 'Required'
    },
    {
      controlType: 'input',
      label: 'IP address',
      key: 'ip_address',
      validators: [
        Validators.required,
        Validators.pattern(/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)
      ],
      errorMessage: 'Mask: xxx.xxx.xxx.xxx'
    },
    {
      controlType: 'checkbox',
      label: 'Active',
      key: 'active',
      defaultValue: false,
    },
    {
      controlType: 'component',
      label: 'Country',
      key: 'country',
      cmpLoader: () => import(
        '../common/country-selector/country-selector.component'
      ).then(m => m.CountrySelectorComponent),
      defaultValue: 'US',
    },
    {
      controlType: 'hidden',
      label: 'ID',
      key: 'id',
      defaultValue: 0,
    }
  ],
};
