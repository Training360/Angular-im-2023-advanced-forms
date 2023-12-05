import { Validators } from "@angular/forms";
import { IForm } from "../common/form-json/form-json.component";

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
      defaultValue: false,
    },
    {
      controlType: 'hidden',
      label: 'ID',
      key: 'id',
      defaultValue: 0,
    }
  ],
};
