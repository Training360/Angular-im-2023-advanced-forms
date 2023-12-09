import { Validators } from "@angular/forms";
import { isDevMode } from "@angular/core";

export const formResolver = async (formName: string) => {

  if (!isDevMode()) {
    await import('../cva/rating-input.component');
    await import('../common/country-selector/country-selector.component');
  }

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
