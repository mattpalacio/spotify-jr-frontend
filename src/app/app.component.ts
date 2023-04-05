import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, catchError, filter, of, switchMap, take } from 'rxjs';
import { AuthService } from './login/data-access/auth.service';

@Component({
  selector: 'app-root',
  template: ` <router-outlet></router-outlet> `,
  styles: []
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,

    private auth: AuthService
  ) {}

  ngOnInit(): void {
    of(new URLSearchParams(window.location.search).get('code'))
      .pipe(
        catchError(() => EMPTY),
        filter((code) => code !== null),
        take(1),
        switchMap((code) => this.auth.login$(code))
      )
      .subscribe(() => this.router.navigateByUrl('/home'));
  }
}
