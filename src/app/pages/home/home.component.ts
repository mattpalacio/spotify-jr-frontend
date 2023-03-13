import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="container">
      home page works
    </div>
  `,
  styles: [
    '.container { background: linear-gradient(to left, #7600bc, #a000c8 ); width: 100%; height: 100vh;}'
  ]
})
export class HomeComponent {

}
