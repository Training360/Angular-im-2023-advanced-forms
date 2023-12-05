import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSnackBarModule,
    FlexLayoutModule,
    MatInputModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

  auth = inject(AuthService);

  snackBar = inject(MatSnackBar);

  loginError = this.auth.loginError;

  loginData: FormGroup = new FormGroup({
    email: new FormControl('cf@gmail.com', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('test', {
      validators: [Validators.required],
    }),
  });

  constructor() {
    effect(() => {
      if (this.loginError()) {
        this.snackBar.open(this.loginError() || '', 'Close', {
          duration: 3000,
        });
      }
    })
  }

  onLogin() {
    const loginValues = this.loginData.value;
    if (loginValues.email && loginValues.password) {
      this.auth.login(loginValues);
    }
  }
}
