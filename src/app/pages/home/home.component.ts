import { Component } from "@angular/core";
import { HeaderComponent } from "src/app/header/header.component";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule, NgFor } from "@angular/common";


@Component({
  selector: "app-home",
  imports: [HeaderComponent, MatIconModule, CommonModule, NgFor],
  standalone: true,
  template: `
    <app-header></app-header>
    <div class="container">
      <div class="search-bar-container">
        <input type="text" class="search" placeholder="Search Tracks" />
        <button class="search"><mat-icon>search</mat-icon></button>
      </div>
      <div class="music-player-container">
        <table *ngFor="let track of tracks">
          <tr>
            <td>{{track.track}}</td>
          </tr>
        </table>
      </div>
    </div>
  `,
  styles: [
    ".container {padding: 15px; display: flex; flex-direction: column; align-items: center}",
    ".search-bar-container {width: 60%; height: 10px; background-color: white; border-radius: 30px; display: flex; align-items:center; padding: 20px;}",
    ".search-bar-container > i {font-size: 20px; color: #777}",
    "input.search { width: 80%}",
    ".search-bar-container > input {flex: 1; height: none border; border: none; outline: none; font-size: 18px; padding-left: 10px}",
    "button.search {border: none; background-color: transparent}",
    "button.search:hover {cursor: pointer;}",
  ],
})
export class HomeComponent {

  displayedColumns: string[] = ["artist", "track", "duration"];
  tracks = [
    { artist: "The Beths", track: "Expert In A Dying Field", duration: 180000 },
    { artist: "The Beths", track: "2am", duration: 180000 },
    { artist: "The Beths", track: "Your Side", duration: 180000 },
    { artist: "The Beths", track: "Right To Left", duration: 180000 },
    { artist: "The Beths", track: "Head In The Clouds", duration: 180000 },
    { artist: "The Beths", track: "When You Know You Know", duration: 180000 },
    { artist: "The Beths", track: "Silence Is Golden", duration: 180000 },
  ]
  constructor() {}

  ngOnInit() {
  }
}
