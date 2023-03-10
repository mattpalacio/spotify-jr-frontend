import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: ` <button (click)="getCode()" class="login">Let's Go!</button> `,
  styles: [
    'button.login { padding: 0.5rem 1rem;border: none; border-radius: 0.1rem; background-color: rebeccapurple; color: pink; text-transform: uppercase; cursor: pointer; transform: scale(0.95); transition: 150ms ease-in-out }',
    'button.login:hover {transform: scale(1) ;box-shadow: 4px 4px 0 0 rgb(0 0 0 / 1); }',
    'button.login:active { transform: scale(0.95); box-shadow: none }'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  getCode(): void {
    window.location.href = 'http://127.0.0.1:8000/authorize';
  }
}
