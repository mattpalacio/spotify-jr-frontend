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
        <h4>Reasons to listen with US</h4>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
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
