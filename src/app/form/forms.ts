import { AbstractControl, ValidatorFn, Validators } from "@angular/forms";
import { IField, IForm } from "../common/form-json/form-json.component";

export const formResolver = async (formName: string) => {
  const settings = await fetch(`./assets/forms.json`).then(
    res => res.json()
  );

  const form = settings[formName];
  if (!form) {
    throw new Error('Form not found: ' + formName);
  }

  validatorResolver(form);

  return form;
}

export const validatorResolver = async (form: any) => {
  for (const field of form.fields) {
    if (field.validators) {
      field.validators = field.validators.map( (validator: {name: string, args: any[]}) => {
        if (Validators.hasOwnProperty(validator.name)) {
          let existingValidatior = (Validators as any)[validator.name];
          if (validator.args && validator.args.length > 0) {
            existingValidatior = existingValidatior(...validator.args);
          }
          return existingValidatior;
        }
        return validator;
      });
    }
  }
}

export const customerAdd: IForm = {
  name: 'Add new Customer',
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
      dValue: false,
    },
    {
      controlType: 'component',
      label: 'Country',
      key: 'country',
      cmpLoader: () => import('../common/country-selector/country-selector.component').then(m => m.CountrySelectorComponent),
      cmpPath: '/country-selector.component-Y74FY4ML.js',
      cmpName: 'CountrySelectorComponent',
      dValue: 'US',
    },
    {
      controlType: 'template',
      label: 'Country2',
      key: 'country2',
      dValue: 'HU',
    },
    {
      controlType: 'hidden',
      label: 'ID',
      key: 'id',
      dValue: 0,
    }
  ],
};
