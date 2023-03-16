///  <reference types="@types/spotify-web-playback-sdk"/>
import { Component } from "@angular/core";
import { HeaderComponent } from "src/app/header/header.component";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule, NgFor } from "@angular/common";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Items, TrackData } from "src/app/model/track.model";
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
  trackUri: string | null = null;
  trackProgress = 0;
  constructor(private http: HttpClient, private musicStore: MusicStore) {}

  ngAfterViewInit(): void {
    this.initPlaybackSDK();
  }

  async initPlaybackSDK() {
    const accessToken = JSON.parse(
      localStorage.getItem('auth_data')!
    ).access_token;
    const { Player } = await this.waitForSpotifyWebPlaybackSDKToLoad();

    const player = new Player({
      name: 'Not-ify Web Player',
      getOAuthToken: (cb: any) => {
        cb(accessToken);
      },
      volume: 1
    });

    player.addListener(
      'initialization_error',
      ({ message }: { message: string }) => {
        console.error(message);
      }
    );

    player.addListener(
      'authentication_error',
      ({ message }: { message: string }) => {
        console.error(message);
      }
    );

    player.addListener('account_error', ({ message }: { message: string }) => {
      console.error(message);
    });

    player.addListener('playback_error', ({ message }: { message: string }) => {
      alert(
        `Your account has to have Spotify Premium for playing music ${message}`
      );
    });

    player.addListener(
      'player_state_changed',

      (state: Spotify.PlaybackState) => {
        console.log(state);
        this.getCurrentlyPlaying();
      }
    );

    player.addListener('ready', ({ device_id }: { device_id: string }) => {
      console.log('[Not-ify] Ready with Device ID', device_id);

      this.deviceId = device_id;

      this.transfer(device_id);
    });

    player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
      console.log('[Not-ify] Device ID has gone offline', device_id);
    });

    await player.connect();
  }

  search(trackName: string) {
    this.musicStore.getTracks(trackName);
    console.log(this.tracks$);
    this.tracks$ = this.musicStore.loadTracks();
  }

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
      uris: [this.trackUri],
      position_ms: this.trackProgress
    };

    this.http.put(url, body, { headers, params }).subscribe();
  }

  pause(): void {
    this.getCurrentlyPlaying();

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

  transfer(deviceId: string): void {
    const url = 'http://127.0.0.1:8000/player';
    const headers = new HttpHeaders({
      Authorization:
        'Bearer ' + JSON.parse(localStorage.getItem('auth_data')!).access_token
    });
    const body = {
      device_ids: [deviceId],
      play: true
    };

    this.http.put(url, body, { headers }).subscribe();
  }

  getCurrentlyPlaying(): void {
    const url = 'http://127.0.0.1:8000/player/currently-playing';
    const headers = new HttpHeaders({
      Authorization:
        'Bearer ' + JSON.parse(localStorage.getItem('auth_data')!).access_token
    });

    this.http
      .get<any>(url, { headers })
      .pipe(exhaustMap((data) => of(data)))
      .subscribe((data) => {
        this.trackUri = data.item.uri;
        this.trackProgress = data.progress_ms;
      });
  }

  private waitForSpotifyWebPlaybackSDKToLoad(): Promise<typeof Spotify> {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    window.onSpotifyWebPlaybackSDKReady = () => {};

    return new Promise((resolve) => {
      if (window.Spotify) {
        resolve(window.Spotify);
      } else {
        window.onSpotifyWebPlaybackSDKReady = () => {
          resolve(window.Spotify);
        };
      }
    });
  }
}
