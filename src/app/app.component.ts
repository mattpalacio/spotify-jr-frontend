import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, catchError, filter, of, switchMap, take, tap } from 'rxjs';
import { AuthService } from './login/data-access/auth.service';
import { TokenStorageService } from './login/data-access/token-storage/token-storage.service';

@Component({
  selector: 'app-root',
  template: ` <router-outlet></router-outlet> `,
  styles: []
})
export class AppComponent implements OnInit {
  constructor(
    // private http: HttpClient,
    private router: Router,
    // private auth: AuthStore,
    private auth: AuthService
  ) // private tokenStorage: TokenStorageService
  {}

  ngOnInit(): void {
    of(new URLSearchParams(window.location.search).get('code'))
      .pipe(
        catchError(() => EMPTY),
        filter((code) => code !== null),
        take(1),
        switchMap(
          (code) => this.auth.login$(code)
          // .pipe(tap((auth) => this.tokenStorage.saveAuthData(auth)))
        )
      )
      .subscribe(() => this.router.navigateByUrl('/home'));

    //   if (code) {
    //     const url = 'http://127.0.0.1:8000/login?code=' + code;

    //     this.http
    //       .get<Auth>(url)
    //       .pipe(exhaustMap((data) => of(data)))
    //       .subscribe({
    //         next: (data) => {
    //           this.auth.storeAuth(data);
    //         },
    //         error: (err) => {
    //           console.log(err);
    //           this.router.navigateByUrl('/');
    //         },
    //         complete: () => this.router.navigateByUrl('/home')
    //       });
    //   }
  }
}
