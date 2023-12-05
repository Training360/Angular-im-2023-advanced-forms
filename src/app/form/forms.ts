import { AsyncValidatorFn, ValidatorFn, Validators } from "@angular/forms";

export interface IField {
  type: 'input' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'hidden';
  label: string;
  key: string;
  validators?: ValidatorFn[];
  asyncValidators?: AsyncValidatorFn[];
  options?: {text: string, value: string}[];
  defaultValue?: any;
}

export interface IForm {
  name: string;
  fields: IField[];
}

export const customerAdd: IForm = {
  name: 'Add new Customer',
  fields: [
    {
      type: 'input',
      label: 'Name',
      key: 'name',
      validators: [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9 ]{3,}$'),
      ]
    },
    {
      type: 'input',
      label: 'Email',
      key: 'email',
      validators: [
        Validators.required,
        Validators.email
      ]
    },
    {
      type: 'input',
      label: 'Address',
      key: 'address',
      validators: [
        Validators.required
      ],
    },
    {
      type: 'input',
      label: 'IP address',
      key: 'ip_address',
      validators: [
        Validators.required,
        Validators.pattern(/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)
      ],
    },
    {
      type: 'checkbox',
      label: 'Active',
      key: 'active',
      defaultValue: false,
    },
    {
      type: 'hidden',
      label: 'ID',
      key: 'id',
      defaultValue: 0,
    }
  ],
};
