import { Component } from "@angular/core";
import { HeaderComponent } from "src/app/header/header.component";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule, NgFor } from "@angular/common";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { exhaustMap, Observable, of } from "rxjs";
import { MusicStore } from "src/app/store/music.store";

@Component({
  selector: "app-home",
  imports: [HeaderComponent, MatIconModule, CommonModule, NgFor],
  standalone: true,
  template: `
    <app-header></app-header>
    <div class="container">
      <div class="search-bar-container">
        <input
          type="text"
          class="search"
          placeholder="Search Tracks"
          #searchInput
        />
        <button class="search">
          <mat-icon (click)="search(searchInput.value)">search</mat-icon>
        </button>
      </div>
      <div class="music-player-container scroller">
        <ng-container *ngIf="tracks$ | async as tracks">
          <ng-container *ngFor="let track of tracks.tracks.items">
            <!-- <button> -->
              <div class="wrapper">
                <div class="box1">
                  <button class="play-button-small"><mat-icon>play_circle_filled</mat-icon></button>
                  <img src="{{ track.album.images[2].url }}" alt="" />
                </div>
                <div class="box2">{{ track.name }}</div>
                <div class="box3">{{ track.album.artists[0].name }}</div>
                <div class="box4">{{ track.duration_ms | date : "mm:ss" }}</div>
              </div>
            <!-- </button> -->
          </ng-container>
        </ng-container>
      </div>
    </div>
  `,
  styleUrls: ["./home.component.css"],
})
export class HomeComponent {
  deviceId: string | null = null;
  tracks$: Observable<any>;
  constructor(private http: HttpClient, private musicStore: MusicStore) {}

  search(trackName: string) {
    this.musicStore.getTracks(trackName);
    console.log(this.tracks$);
    this.tracks$ = this.musicStore.loadTracks();
  }

  getDevices(): void {
    const url = 'http://127.0.0.1:8000/player/devices';
    const headers = new HttpHeaders({
      Authorization:
        'Bearer ' + JSON.parse(localStorage.getItem('auth_data')!).access_token
    });

    this.http.get<any>(url, { headers }).subscribe((data) => {
      console.log('DEVICE DATA', data);
      this.deviceId = data.devices[0].id;
      console.log('DEVICE ID', this.deviceId);
    });
  }
}
