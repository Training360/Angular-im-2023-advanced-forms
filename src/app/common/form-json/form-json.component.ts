import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormControlOptions, FormGroup, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';

export interface IField extends FormControlOptions {
  controlType: 'input' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'hidden';
  label: string;
  key: string;
  options?: { text: string, value: string }[];
  defaultValue?: any;
  type?: string; // number | text | email | ...
  errorMessage?: string;
}

export interface IForm {
  name: string;
  fields: IField[];
  validators?: ValidatorFn[];
}

@Component({
  selector: 'form-json',
  standalone: true,
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: './form-json.component.html',
  styleUrl: './form-json.component.scss'
})
export class FormJsonComponent<T extends { [key: string]: any }> {

  @Input() set settings(formSettings: IForm) {
    if (formSettings) {
      this.form = new FormGroup({});
      if (formSettings.validators) {
        this.form.addValidators(formSettings.validators);
      }

      formSettings.fields.forEach(field => {
        this.addControl(this.form, field);
      });
      this.formSettings = formSettings;

      if (this.data) {
        this.form.patchValue(this.data);
      }
    }
  }

  @Input() set data(data: T) {
    if (data) {
      this.form.patchValue(data);
    }
  }

  @Output() update: EventEmitter<T> = new EventEmitter();

  formSettings: IForm = { name: '', fields: [] };

  form: FormGroup = new FormGroup({});

  private addControl(form: FormGroup, field: IField) {
    const value = field.defaultValue || '';
    const validators = field.validators || [];
    const asyncValidators = field.asyncValidators || [];
    form.addControl(field.key, new FormControl(
      value,
      { validators, asyncValidators },
    ));
  }

  onUpdate() {
    this.update.emit(this.form.value);
  }

}
