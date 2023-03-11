import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="button-container">
    <button (click)="getCode()" class="login">Let's Go!</button>
  </div>
    <div class="animation-container">
      <div class="shapes">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.css'],
 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {

  ngOnInit(){

  }

  getCode(): void {
    window.location.href = "http://127.0.0.1:8000/authorize";
  }
}
