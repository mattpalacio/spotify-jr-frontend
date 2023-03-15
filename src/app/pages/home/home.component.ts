import { Component } from "@angular/core";
import { HeaderComponent } from "src/app/header/header.component";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule, NgFor } from "@angular/common";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Items, TrackData } from "src/app/model/track.model";
import { Observable } from "rxjs";
import { MusicStore } from "src/app/store/music.store";


@Component({
  selector: "app-home",
  imports: [HeaderComponent, MatIconModule, CommonModule, NgFor],
  standalone: true,
  template: `
    <app-header></app-header>
    <div class="container">
      <div class="search-bar-container">
        <input type="text" class="search" placeholder="Search Tracks" #searchInput/>
        <button class="search"><mat-icon (click)="search(searchInput.value)">search</mat-icon></button>
      </div>
      <div class="music-player-container">
        <ng-container *ngIf="tracks$ | async as tracks">
          <ng-container *ngFor="let track of tracks.tracks.items">
            <p>{{track.name}}</p>
          </ng-container>
        </ng-container>
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
  deviceId: string | null = null;
  tracks$: Observable<any>;
  constructor(private http: HttpClient, private musicStore: MusicStore) {}

  ngOnInit(): void {
    this.getDevices();
    this.tracks$ = this.musicStore.loadTracks();
  }

  
  search(trackName: string) {
    this.musicStore.getTracks(trackName);
    console.log(this.tracks$);
  }
  
  // search(): void {
  //   const url = 'http://127.0.0.1:8000/search';
  //   const headers = new HttpHeaders({
  //     Authorization:
  //       'Bearer ' + JSON.parse(localStorage.getItem('auth_data')!).access_token
  //   });
  //   const params = new HttpParams({
  //     fromObject: {
  //       q: 'track:Lvl',
  //       type: 'track'
  //     }
  //   });

  //   this.http.get(url, { headers, params }).subscribe((data) => {
  //     console.log(data);
  //   });
  // }

  play(): void {
    const url = 'http://127.0.0.1:8000/player/play';
    const headers = new HttpHeaders({
      Authorization:
        'Bearer ' + JSON.parse(localStorage.getItem('auth_data')!).access_token
    });
    const params = new HttpParams({
      fromObject: {
        device_id: this.deviceId!
      }
    });
    const body = {
      uris: ['spotify:track:787rCZF9i4L1cXGMkdyIk4']
      // position_ms: 0
    };

    this.http.put(url, body, { headers, params }).subscribe();
  }

  pause(): void {
    const url = 'http://127.0.0.1:8000/player/pause';
    const headers = new HttpHeaders({
      Authorization:
        'Bearer ' + JSON.parse(localStorage.getItem('auth_data')!).access_token
    });
    const params = new HttpParams({
      fromObject: {
        device_id: this.deviceId!
      }
    });

    this.http.put(url, {}, { headers, params }).subscribe();
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

  transfer(): void {
    const url = 'http://127.0.0.1:8000/player';
    const headers = new HttpHeaders({
      Authorization:
        'Bearer ' + JSON.parse(localStorage.getItem('auth_data')!).access_token
    });
    const body = {
      device_ids: [this.deviceId],
      play: true
    };

    this.http.put(url, body, { headers }).subscribe((data) => {
      console.log(data);
    });
  }

  // displayedColumns: string[] = ["artist", "track", "duration"];
  // tracks = [
  //   { artist: "The Beths", track: "Expert In A Dying Field", duration: 180000 },
  //   { artist: "The Beths", track: "2am", duration: 180000 },
  //   { artist: "The Beths", track: "Your Side", duration: 180000 },
  //   { artist: "The Beths", track: "Right To Left", duration: 180000 },
  //   { artist: "The Beths", track: "Head In The Clouds", duration: 180000 },
  //   { artist: "The Beths", track: "When You Know You Know", duration: 180000 },
  //   { artist: "The Beths", track: "Silence Is Golden", duration: 180000 },
  // ]
  // constructor() {}

  // ngOnInit() {
  // }
}
