import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './login/data-access/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('src/app/login/feature/login.component').then(
        (x) => x.LoginComponent
      )
  },
  {
    path: 'home',
    loadComponent: () =>
      import('src/app/home/feature/home.component').then(
        (x) => x.HomeComponent),
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
