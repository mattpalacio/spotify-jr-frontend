import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { TokenStorageService } from 'src/app/login/data-access/token-storage/token-storage.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private tokenStorage: TokenStorageService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const auth = this.tokenStorage.getAuthData();
    console.log('AUTH', auth);

    if (!auth) return next.handle(req);

    const token = auth?.access_token;
    const isApiUrl = req.url.startsWith(environment.apiUrl);
    console.log('REQUEST', req);

    if (token && isApiUrl) {
      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token
        }
      });
    }

    return next.handle(req);

    // return of(localStorage.getItem('auth_data'))
  }
}
