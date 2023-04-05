import { Injectable } from '@angular/core';
import { Auth } from '../auth.model';

const AUTH_KEY = 'authData';

@Injectable()
export class TokenStorageService {
  getAuthData(): Auth | null {
    const auth = window.sessionStorage.getItem(AUTH_KEY);
    return auth ? JSON.parse(auth) : null;
  }

  saveAuthData(auth: Auth): void {
    window.sessionStorage.removeItem(AUTH_KEY);
    window.sessionStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  }

  clear(): void {
    window.sessionStorage.clear();
  }
}
