import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  template: `<header>Advent of Code 2023</header><router-outlet></router-outlet>`,
})
export class AppComponent {
}
