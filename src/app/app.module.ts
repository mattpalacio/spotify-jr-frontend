import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CookieService } from 'ngx-cookie-service';
import { AuthGaurdService } from './login/data-access/auth-gaurd.service';
import { MusicService } from './home/data-access/music.service';
import { WebPlaybackService } from './home/data-access/web-playback/web-playback.service';
import { JwtInterceptor } from './shared/utils/jwt.interceptor';
import { AuthService } from './login/data-access/auth.service';
import { TokenStorageService } from './login/data-access/token-storage/token-storage.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    CookieService,
    AuthGaurdService,
    MusicService,
    WebPlaybackService,
    AuthService,
    TokenStorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
