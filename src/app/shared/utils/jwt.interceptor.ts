import { Injectable } from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
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
    const isApiUrl = req.url.startsWith(environment.apiUrl);

    if (auth && isApiUrl) {
      req = req.clone({
        setHeaders: {
          Authorization: `${auth.token_type} ${auth.access_token}`
        }
      });
    }

    return next.handle(req);
  }
}

export const JwtInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: JwtInterceptor,
  multi: true
};
