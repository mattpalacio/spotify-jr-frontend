import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGaurdService } from './login/data-access/auth-gaurd.service';

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
        (x) => x.HomeComponent
      ),
    canActivate: [AuthGaurdService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
