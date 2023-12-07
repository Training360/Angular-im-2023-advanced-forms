import {
  AfterViewInit,
  Component,
  Directive,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
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
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';

export interface IField extends FormControlOptions {
  controlType:
    | 'input'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'textarea'
    | 'hidden'
    | 'component'
    | 'template';
  label: string;
  key: string;
  options?: { text: string; value: string }[];
  dValue?: any;
  type?: string; // number | text | email | ...
  errorMessage?: string;
  cmpLoader?: () => any;
  control?: FormControl;
  template?: TemplateRef<any>;
  context?: { formControl: AbstractControl };
}

export interface IForm {
  name: string;
  fields: IField[];
  validators?: ValidatorFn[];
}

@Directive({
  selector: '[componentHost]',
  standalone: true,
})
export class ComponentHostDirective {
  public readonly viewContainerRef = inject(ViewContainerRef);
  @Input({ required: true }) componentHost!: IField;
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
    ComponentHostDirective,
  ],
  templateUrl: './form-json.component.html',
  styleUrl: './form-json.component.scss',
})
export class FormJsonComponent<T extends { [key: string]: any }>
  implements AfterViewInit
{
  @ViewChildren(ComponentHostDirective)
  componentHosts!: ComponentHostDirective[];

  @Input() set templates(list: [string, TemplateRef<any>][]) {
    const templateFields = this.formSettings.fields.filter(
      item => item.controlType === 'template'
    );

    list.forEach(([key, template]) => {
      const field = templateFields.find(item => item.key === key);
      if (field) {
        field.template = template;
        field.context = {
          formControl: this.form.get(key)!,
        };
      }
    })
  }

  @Input() set settings(formSettings: IForm) {
    if (formSettings) {
      if (formSettings.validators) {
        this.form.addValidators(formSettings.validators);
      }

      formSettings.fields.forEach((field) => {
        field.control = this.addControl(this.form, field);
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
    const value = field.dValue || '';
    const validators = field.validators || [];
    const asyncValidators = field.asyncValidators || [];
    console.log(field.key, value, validators, asyncValidators);
    const control = new FormControl(value, { validators, asyncValidators });
    form.addControl(
      field.key,
      control,
    );
    return control;
  }

  onUpdate() {
    this.update.emit(this.form.value);
  }

  // DYNAMIC COMPONENT LOADING /////////////////////////////////////////////////
  ngAfterViewInit() {
    if (this.componentHosts) {
      this.componentHosts.forEach((componentHost) => {
        this.loadComponent(componentHost);
      });
    }
  }

  async loadComponent(host: ComponentHostDirective) {
    const { viewContainerRef, componentHost } = host;
    viewContainerRef.clear();

    if (!componentHost.cmpLoader) {
      return;
    }

    const comp = await componentHost.cmpLoader();

    const { instance } = viewContainerRef.createComponent<any>(
      comp
    );

    const control = this.form.get(componentHost.key);
    instance.registerOnChange((value: any) => {
      control?.setValue(value);
    });
    instance.registerOnTouched(() => {
      control?.markAsTouched();
    });
    console.log(control?.value, control?.getRawValue())
    control?.valueChanges.subscribe((value: any) => {
      instance.writeValue(value);
    });
    control?.setValue(componentHost.dValue)
  }

  // DYNAMIC COMPONENT LOADING /////////////////////////////////////////////////

}
