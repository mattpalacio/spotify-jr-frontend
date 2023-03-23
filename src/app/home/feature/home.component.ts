///  <reference types="@types/spotify-web-playback-sdk"/>
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { AfterViewInit, Component } from "@angular/core";
import { HeaderComponent } from "src/app/header/feature/header.component";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule, NgFor } from "@angular/common";
import { exhaustMap, Observable, of } from "rxjs";
import { MusicStore } from "src/app/home/data-access/music.store";

@Component({
  selector: "app-home",
  imports: [HeaderComponent, MatIconModule, CommonModule, NgFor],
  standalone: true,
  template: `
    <app-header></app-header>
    <div class="container">
      <div class="search-bar-container">
        <input
          (keydown.enter)="search(searchInput.value)"
          type="text"
          class="search"
          placeholder="Search Tracks"
          #searchInput
        />
        <button *ngIf="searchInput.value" class="search" type="button" aria-label="clear" (click)="searchInput.value = ''">
          <mat-icon>clear</mat-icon>
        </button>
        <button class="search" type="button" aria-label="search" (click)="search(searchInput.value)">
          <mat-icon>search</mat-icon>
        </button>
      </div>
      <div class="music-player-container scroller" *ngIf="tracks$ | async as tracks">
          <ng-container *ngFor="let track of tracks.tracks.items">
            <div class="wrapper">
              <div class="box1">
                <button
                  *ngIf="trackUri !== track.uri || !running"
                  type="button"
                  class="play-button-small"
                  aria-label="play"
                  (click)="play(track.uri, track.duration_ms)"
                >
                  <mat-icon>play_circle_filled</mat-icon>
                </button>
                <button
                  *ngIf="running && trackUri === track.uri"
                  type="button"
                  class="play-button-small"
                  aria-label="pause"
                  (click)="pause()"
                >
                  <mat-icon>pause_circle_filled</mat-icon>
                </button>
                <img
                  src="{{ track.album.images[2].url }}"
                  alt="album cover art"
                />
              </div>
              <div class="box2">{{ track.name }}</div>
              <div class="box3">{{ track.album.artists[0].name }}</div>
              <div class="box4">{{ track.duration_ms | date : "mm:ss" }}</div>
            </div>
        </ng-container>
      </div>
      <div class="flex-container">
        <p>{{ duration | date : "mm:ss" }}</p>
        <div class="progress-bar">
          <div
            [style.width.%]="percentageComplete"
            class="progress-bar-inside"
          ></div>
        </div>
        <p>-{{ songCountDown | date : "mm:ss" }}</p>
      </div>
      <div class="flex-container">
        <button type="button" class="prev-btn" aria-label="search"><mat-icon>skip_previous</mat-icon></button>
        <button type="button" class="play-button-large" *ngIf="!running" aria-label="play" (click)="play(this.trackUri, songCountDown)">
          <mat-icon>play_arrow</mat-icon>
        </button>
        <button type="button" class="play-button-large" *ngIf="running" aria-label="pause" (click)="pause()">
          <mat-icon>pause</mat-icon>
        </button>
        <button type="button" class="next_btn" aria-label="next track"><mat-icon>skip_next</mat-icon></button>
      </div>
    </div>
  `,
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements AfterViewInit {
  // TODO: fix interface and replace, do not use any
  tracks$: Observable<any>;
  deviceId: string | null = null;
  trackUri: string | null = null;
  running: boolean;
  trackProgress = 0;
  songCountDown = 0;
  duration = 0;
  startTimer: any;
  percentageComplete = 0;
  trackTotalDuration = 0;

  constructor(private http: HttpClient, private musicStore: MusicStore) {}

  ngAfterViewInit(): void {
    this.initPlaybackSDK();
  }

  start(trackDuration: number): void {
    if (!this.running) {
      this.running = true;
      this.startTimer = setInterval(() => {
        this.songCountDown = this.songCountDown - 1000;
        this.duration = this.duration + 1000;
        this.percentageComplete = (this.duration / trackDuration) * 100;
        if (this.duration > trackDuration) {
          this.duration = 0;
          this.songCountDown = 0;
          this.percentageComplete = 0;
          this.stop();
        }
      }, 1000);
    } else {
      this.stop();
    }
  }

  stop(): void {
    clearInterval(this.startTimer);
    this.running = false;
  }

  // TODO: move to service?
  async initPlaybackSDK() {
    const accessToken = JSON.parse(
      localStorage.getItem("auth_data")!
    ).access_token;
    const { Player } = await this.waitForSpotifyWebPlaybackSDKToLoad();

    const player = new Player({
      name: "Not-ify Web Player",
      getOAuthToken: (cb: any) => {
        cb(accessToken);
      },
      volume: 1,
    });

    player.addListener(
      "initialization_error",
      ({ message }: { message: string }) => {
        console.error(message);
      }
    );

    player.addListener(
      "authentication_error",
      ({ message }: { message: string }) => {
        console.error(message);
      }
    );

    player.addListener("account_error", ({ message }: { message: string }) => {
      console.error(message);
    });

    player.addListener("playback_error", ({ message }: { message: string }) => {
      alert(
        `Your account has to have Spotify Premium for playing music ${message}`
      );
    });

    player.addListener(
      "player_state_changed",

      (state: Spotify.PlaybackState) => {
        // console.log(state);
        this.getCurrentlyPlaying();
      }
    );

    player.addListener("ready", ({ device_id }: { device_id: string }) => {
      console.log("[Not-ify] Ready with Device ID", device_id);

      this.deviceId = device_id;

      this.transfer(device_id);
    });

    player.addListener("not_ready", ({ device_id }: { device_id: string }) => {
      console.log("[Not-ify] Device ID has gone offline", device_id);
    });

    await player.connect();
  }

  search(trackName: string) {
    this.musicStore.getTracks(trackName);
    this.tracks$ = this.musicStore.loadTracks();
  }

  // TODO: move to store
  play(uri: string, duration: number): void {
    // if user clicked a new track, reset durations and progress bar
    if(this.trackUri == null || this.trackUri != uri){
      this.songCountDown = 0;
      this.duration = 0;
      this.percentageComplete = 0;
      this.trackTotalDuration = duration;
      this.stop();
    }

    const url = "http://127.0.0.1:8000/player/play";
    const headers = new HttpHeaders({
      Authorization:
        "Bearer " + JSON.parse(localStorage.getItem("auth_data")!).access_token,
    });
    const params = new HttpParams({
      fromObject: {
        device_id: this.deviceId!,
      },
    });
    this.trackUri = uri;
    this.songCountDown = duration;
    this.start(duration);

    

    const body = {
      uris: [uri],
      position_ms: this.duration,
    };

    this.http.put(url, body, { headers, params }).subscribe();
  }

  // TODO: move to store
  pause(): void {
    this.getCurrentlyPlaying();

    const url = "http://127.0.0.1:8000/player/pause";
    const headers = new HttpHeaders({
      Authorization:
        "Bearer " + JSON.parse(localStorage.getItem("auth_data")!).access_token,
    });
    const params = new HttpParams({
      fromObject: {
        device_id: this.deviceId!,
      },
    });

    this.stop();
    this.http.put(url, {}, { headers, params }).subscribe();
  }

  // TODO: move to store
  getDevices(): void {
    const url = "http://127.0.0.1:8000/player/devices";
    const headers = new HttpHeaders({
      Authorization:
        "Bearer " + JSON.parse(localStorage.getItem("auth_data")!).access_token,
    });

    this.http.get<any>(url, { headers }).subscribe((data) => {
      console.log("DEVICE DATA", data);
      this.deviceId = data.devices[0].id;
      console.log("DEVICE ID", this.deviceId);
    });
  }

  // TODO: move to store
  transfer(deviceId: string): void {
    const url = "http://127.0.0.1:8000/player";
    const headers = new HttpHeaders({
      Authorization:
        "Bearer " + JSON.parse(localStorage.getItem("auth_data")!).access_token,
    });
    const body = {
      device_ids: [deviceId],
      play: true,
    };

    this.http.put(url, body, { headers }).subscribe();
  }

  // TODO: move to store
  getCurrentlyPlaying(): void {
    const url = "http://127.0.0.1:8000/player/currently-playing";
    const headers = new HttpHeaders({
      Authorization:
        "Bearer " + JSON.parse(localStorage.getItem("auth_data")!).access_token,
    });

    this.http
      .get<any>(url, { headers })
      .pipe(exhaustMap((data) => of(data)))
      .subscribe((data) => {
        this.trackUri = data.item.uri;
        this.trackProgress = data.progress_ms;
      });
  }

  // TODO: move to store
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
