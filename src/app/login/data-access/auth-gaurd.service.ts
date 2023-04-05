import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGaurdService implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {}

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
}
