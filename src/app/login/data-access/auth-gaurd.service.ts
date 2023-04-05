import { Injectable } from '@angular/core';
import { CanActivate, Route, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthStore } from './auth.store';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGaurdService implements CanActivate {
  constructor(
    private authStore: AuthStore,
    private router: Router,
    private auth: AuthService
  ) {}

  canActivate(): Observable<boolean> {
    return this.auth.authenticated$().pipe(
      map((data) => {
        if (!data) {
          this.router.navigateByUrl('/');
          return false;
        }
        return true;
      })
    );
  }
  // canActivate(): Observable<boolean> {
  //   return this.authStore.authData$.pipe(
  //     map((data) => {
  //       if (!data) {
  //         this.router.navigateByUrl('/');
  //         return false;
  //       }
  //       return true;
  //     })
  //   );
  // }
}
