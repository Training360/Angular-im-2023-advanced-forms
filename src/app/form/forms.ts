import { Validators } from "@angular/forms";


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
          let existingValidator = (Validators as any)[validator.name];
          if (validator.args && validator.args.length > 0) {
            existingValidator = existingValidator(...validator.args);
          }
          return existingValidator;
        }
        return validator;
      } );
    }
  }
};
