import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CookieService } from 'ngx-cookie-service';
import { AuthGaurdService } from './login/data-access/auth-gaurd.service';
import { MusicService } from './home/data-access/music.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [CookieService, AuthGaurdService, MusicService],
  bootstrap: [AppComponent]
})
export class AppModule {}
