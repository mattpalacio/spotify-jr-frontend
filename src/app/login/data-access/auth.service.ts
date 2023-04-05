import { Injectable } from '@angular/core';
import { TokenStorageService } from './token-storage/token-storage.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Auth } from './auth.model';
import { BehaviorSubject, Observable, exhaustMap, of, tap } from 'rxjs';

@Injectable()
export class AuthService {
  private isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService
  ) {}

  authenticated$(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  login$(code: string): Observable<Auth> {
    const url = environment.apiUrl + '/login';
    const params = new HttpParams({
      fromObject: {
        code
      }
    });

    return this.http.get<Auth>(url, { params }).pipe(
      exhaustMap((data) =>
        of(data).pipe(
          tap((data) => {
            this.tokenStorage.saveAuthData(data);
            this.isAuthenticated$.next(true);
          })
        )
      )
    );
  }

  logout(): void {
    this.tokenStorage.clear();
    this.isAuthenticated$.next(false);
  }
}
