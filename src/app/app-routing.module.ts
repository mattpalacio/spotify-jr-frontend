import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGaurdService } from './services/auth-gaurd.service';

const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('src/app/login/feature/login.component').then(
        (x) => x.LoginComponent
      )
  },
  {
    path: 'home',
    loadComponent: () =>
      import('src/app/pages/home/home.component').then(
        (x) => x.HomeComponent),
    canActivate: [AuthGaurdService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
