import { Component, Input, OnInit, effect, inject, numberAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CustomerStore } from '../../store/CustomerStore';
import { Customer } from '../../model/customer';
import { Router, RouterModule } from '@angular/router';
import { CustomerService } from '../../service/customer.service';
import { Observable, firstValueFrom, map } from 'rxjs';
import { formResolver } from '../../form/forms';
import { FormJsonComponent, IField, IForm } from '../../common/form-json/form-json.component';
import { CountrySelectorComponent } from '../../cva/country-selector/country-selector.component';

@Component({
  selector: 'app-customer-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSnackBarModule,
    FormJsonComponent,
    CountrySelectorComponent,
  ],
  templateUrl: './customer-add.component.html',
  styleUrl: './customer-add.component.scss',
  providers: [
    CustomerStore,
    MatSnackBar,
  ],
})
export class CustomerAddComponent {
  store = inject(CustomerStore);

  snackBar = inject(MatSnackBar);

  router = inject(Router);

  customerService = inject(CustomerService);

  customer = new Customer();

  selectError = this.store.error;

  formSettings!: IForm;

  constructor() {
    effect(() => {
      if (this.selectError()) {
        this.snackBar.open(this.selectError(), 'Close', {
          duration: 4000,
        });
      }
    });

    formResolver('customerAdd').then(settings => {

      settings.validators = [
        ...(settings.validators || []),
        this.ipAndEmailValidator.bind(this)(),
      ];

      settings.fields = settings.fields.map((field: IField) => {
        if (field.key === 'email') {
          return {
            ...field,
            asyncValidators: [this.validateEmail.bind(this)()],
          };
        }
        return field;
      });

      this.formSettings = settings;

    });



  }

  onAdd(customer: Customer): void {
    this.store.createItem(customer);
    this.router.navigate(['/customers']);
  }

  validateEmail() {
    return (control: AbstractControl) => {
      return this.customerService.query(
        `email=${control.value}`
      ).pipe( map((customers) => {
        if (customers && customers.length > 0) {
          return { emailAlreadyExists: true };
        }
        return null;
      }));
    }
  }

  ipAndEmailValidator() {
    return (control: AbstractControl) => {
      const value = control.value;
      if (/^10/.test(value['ip_address']) && /\@\w*\..*$/.test(value['email'])) {
        return { emailIpError: 'Corporate emails cannot have a top-level domain.' };
      }
      return null;
    }
  }
}
