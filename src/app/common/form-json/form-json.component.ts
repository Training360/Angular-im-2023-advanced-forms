import {
  AfterViewInit,
  Component,
  Directive,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  Type,
  ViewChildren,
  ViewContainerRef,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormControlOptions,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';

export interface IField extends FormControlOptions {
  controlType: 'input' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'hidden' | 'component' | 'template';
  label: string;
  key: string;
  options?: { text: string; value: string; }[];
  dValue?: any;
  type?: string; // number, text
  errorMessage?: string;
  template?: TemplateRef<any>;
  context?: {
    formControl: AbstractControl,
    field?: Partial<IField>,
  };
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
export class FormJsonComponent<T extends { [k: string]: any }> {

  @Input() set settings(formSettings: IForm) {
    if (formSettings) {
      if (formSettings.validators) {
        this.form.addValidators(formSettings.validators);
      }

      formSettings.fields.forEach((field) => {
        field.context = {
          formControl: this.addControl(this.form, field),
          field,
        };
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

  form: FormGroup = new FormGroup({});

  formSettings: IForm = { name: '', fields: [] };

  onUpdate() {
    this.update.emit(this.form.value);
  }

  private addControl(form: FormGroup, field: IField) {
    const value = field.dValue || '';
    const validators = field.validators || [];
    const asyncValidators = field.asyncValidators || [];
    const control = new FormControl(value, { validators, asyncValidators });
    form.addControl(
      field.key,
      control,
    );

    return control;
  }
}
