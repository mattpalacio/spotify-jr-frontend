import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule],
  template: `
  <!-- i hate this for the animation, how can I simplfy this -->
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
    
    <div class="background-overlay"></div>
    <div class="flex-container">
      <div>
        <img
          src="../assets/36EC4E8E-3407-4013-BB62-DDF6572BB5D1-removebg-preview.png"
          alt="Not-ify logo"
        />
        <h4>Hey there, music lover!</h4>
        <p>
          Welcome to Not-ify, the web app that lets you discover 
          and enjoy tunes from all over the world. Whether you're into rock, pop, jazz, 
          or anything in between, we've got you covered. Just search for your favorite tunes 
          and start listening. Join our groovy community of music fans. So what are you waiting for? 
          Sign in now and get ready to groove with Not-ify!
        </p>
      </div>
      <div class="button-container">
        <button (click)="getCode()" class="login" type="button">Let's Groove</button>
      </div>
    </div>

    
  `,
  styleUrls: ["./login.component.css"],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  ngOnInit() {}

  getCode(): void {
    window.location.href = "http://127.0.0.1:8000/authorize";
  }
}
