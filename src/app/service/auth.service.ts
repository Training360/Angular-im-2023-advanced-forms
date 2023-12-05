import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, lastValueFrom, tap } from 'rxjs';
import { User } from '../model/user';
import { Router } from '@angular/router';

enum StorageNames {
  token = 'token',
  user = 'user',
}

interface LoginResponse {
  accessToken: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private router = inject(Router);

  private apiUrl = environment.apiUrl;

  private loginUrl = this.apiUrl + 'login';

  private _token = signal<string>('');

  private _user = signal<User | null>(null);

  private _loginError = signal<string | null>(null);

  token = computed(() => {
    return this._token();
  });

  user = computed(() => {
    return this._user();
  });

  loginError = computed(() => {
    return this._loginError();
  });

  constructor() {
    if (sessionStorage.getItem(StorageNames.token)) {
      this._token.set(sessionStorage.getItem(StorageNames.token) || '');
    }

    if (sessionStorage.getItem(StorageNames.user)) {
      this._user.set(
        JSON.parse(sessionStorage.getItem(StorageNames.user) || '')
      );
    }

    effect(() => {
      if (this._token()) {
        sessionStorage.setItem(StorageNames.token, this._token());
      }

      if (this._user()) {
        sessionStorage.setItem(StorageNames.user, JSON.stringify(this._user()));
      }
    });
  }

  async login(data: any) {
    const loginRequest = this.http.post<LoginResponse>(this.loginUrl, data);

    try {
      const response = await firstValueFrom(loginRequest);
      this._token.update(() => response.accessToken);
      this._user.update(() => response.user);
      this.router.navigate(['']);
    } catch (error) {
      this._loginError.update(() => 'Invalid username or password');
      this.logout();
    }
  }

  logout(): void {
    sessionStorage.removeItem(StorageNames.token);
    sessionStorage.removeItem(StorageNames.user);
    this._token.update(() => '');
    this._user.update(() => null);
    this.router.navigate(['/login']);
  }
}
