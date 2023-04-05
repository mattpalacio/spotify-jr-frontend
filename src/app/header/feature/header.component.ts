import { Component } from '@angular/core';
import { AuthStore } from '../../login/data-access/auth.store';
import { AuthService } from 'src/app/login/data-access/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <nav class="nav" aria-labelledby="mainmenulabel">
      <ul class="nav-menu-items">
        <li class="left">
          <img
            class="logo"
            src="../assets/36EC4E8E-3407-4013-BB62-DDF6572BB5D1-removebg-preview.png"
            alt="Not-ify logo"
          />
        </li>
        <li class="right"><a>Listen</a></li>
        <li class="right"><a>About Us</a></li>
        <li class="right" (click)="logout()"><a>Logout</a></li>
      </ul>
    </nav>
  `,
  styles: [
    '.nav { padding: 5px;}',
    '.logo {width: 150px;}',
    '.nav-menu-items {list-style-type: none; display: flex; align-items: center; flex-direction: row; justify-content: flex-end; color: white; font-family: Arial, Helvetica, sans-serif;}',
    '.left {margin-right: auto }',
    '.right {padding:  0 10px}',
    '.right:hover { cursor: pointer}'
  ]
})
export class HeaderComponent {
  constructor(
    private authStore: AuthStore,
    private router: Router,
    private auth: AuthService
  ) {}

  logout() {
    // this.authStore.logout();
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
