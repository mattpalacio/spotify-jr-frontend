import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { exhaustMap, of } from 'rxjs';
import { Auth } from './auth/data-access/auth.model';
import { AuthStore } from './auth/data-access/auth.store';

@Component({
  selector: 'app-root',
  template: ` <router-outlet></router-outlet> `,
  styles: []
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router, private auth: AuthStore) {}

  ngOnInit(): void {
    const code = new URLSearchParams(window.location.search).get('code');

    if (code) {
      const url = 'http://127.0.0.1:8000/login?code=' + code;

      this.http
        .get<Auth>(url)
        .pipe(
          exhaustMap((data) => of(data)))
        .subscribe({
          next: (data) => {
            this.auth.storeAuth(data);
          },
          error: () => this.router.navigateByUrl('/login'),
          complete: () => this.router.navigateByUrl('/home')
        });
    }
  }
}
