///  <reference types="@types/spotify-web-playback-sdk"/>
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { AfterViewInit, Component } from "@angular/core";
import { HeaderComponent } from "src/app/header/feature/header.component";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule, NgFor } from "@angular/common";
import { exhaustMap, Observable, of } from "rxjs";
import { MusicStore } from "src/app/home/data-access/music.store";
import { SearchComponent } from "../ui/search/seach.component";
import { SearchResultsComponent } from "../ui/search-result/search-results.component";
import { TrackData } from "../data-access/track.model";
import { MusicPlayerControlsComponent } from "../ui/music-player-controls/music-player-controls";

@Component({
  selector: "app-home",
  imports: [
    HeaderComponent,
    MatIconModule,
    CommonModule,
    NgFor,
    SearchComponent,
    SearchResultsComponent,
    MusicPlayerControlsComponent
  ],
  standalone: true,
  template: `
    <app-header></app-header>
    <div class="container">
      <div class="flex-item">
        <app-search (searchEvent)="receiveSearch($event)"></app-search>
      </div>
      <div class="flex-item">
        <app-search-results 
          [tracks]="tracks$ | async" 
          [trackUri]="trackUri" 
          [running]="running" 
          (playEvent)="playEvent($event)"
          (pauseEvent)="pauseEvent()">
        </app-search-results>
      </div>
      <div class="flex-item">
        <app-music-player-controls 
          [running]="running" 
          [duration]="duration" 
          [percentageComplete]="percentageComplete"
          [trackUri]="trackUri"
          [songCountDown]="songCountDown"
          (playEvent)="playEvent($event)"
          (pauseEvent)="pauseEvent()">
        </app-music-player-controls>
      </div>
    </div>
  `,
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements AfterViewInit {
  // TODO: fix interface and replace, do not use any
  tracks$: Observable<TrackData>;
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

  receiveSearch($event: string) {
    this.musicStore.getTracks($event);
    this.tracks$ = this.musicStore.loadTracks();
  }

  // TODO: move to store
  playEvent($event): void {
    // if user clicked a new track, reset durations and progress bar
    if (this.trackUri == null || this.trackUri != $event.uri) {
      this.songCountDown = 0;
      this.duration = 0;
      this.percentageComplete = 0;
      this.trackTotalDuration = $event.duration;
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
    this.trackUri = $event.uri;
    this.songCountDown = $event.duration;
    this.start($event.duration);

    const body = {
      uris: [$event.uri],
      position_ms: this.duration,
    };

    this.http.put(url, body, { headers, params }).subscribe();
  }

  // TODO: move to store
  pauseEvent(): void {
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
