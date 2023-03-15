///  <reference types="@types/spotify-web-playback-sdk"/>
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="container">
      <button (click)="search()">Search</button>
      <button (click)="getDevices()">Get devices</button>
      <button (click)="play()">Play</button>
      <button (click)="pause()">Pause</button>
      <button (click)="getCurrentlyPlaying()">Currently Playing</button>
    </div>
  `,
  styles: [
    '.container { background: linear-gradient(to left, #7600bc, #a000c8 ); width: 100%; height: 100vh;}'
  ]
})
export class HomeComponent implements AfterViewInit {
  deviceId: string | null = null;
  trackUri: string | null = null;
  trackProgress = 0;

  constructor(private http: HttpClient) {}

  // ngOnInit(): void {}
  // this.getDevices();
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
      }
    );

    player.addListener('ready', ({ device_id }: { device_id: string }) => {
      console.log('[Not-ify] Ready with Device ID', device_id);

      this.transfer(device_id);
    });

    player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
      console.log('[Not-ify] Device ID has gone offline', device_id);
    });

    await player.connect();
  }

  search(): void {
    const url = 'http://127.0.0.1:8000/search';
    const headers = new HttpHeaders({
      Authorization:
        'Bearer ' + JSON.parse(localStorage.getItem('auth_data')!).access_token
    });
    const params = new HttpParams({
      fromObject: {
        q: 'track:Casio',
        type: 'track'
      }
    });

    this.http.get(url, { headers, params }).subscribe((data) => {
      console.log(data);
    });
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

    this.http.put(url, body, { headers }).subscribe((data) => {
      console.log(data);
    });
  }

  getCurrentlyPlaying(): void {
    const url = 'http://127.0.0.1:8000/player/currently-playing';
    const headers = new HttpHeaders({
      Authorization:
        'Bearer ' + JSON.parse(localStorage.getItem('auth_data')!).access_token
    });

    this.http.get<any>(url, { headers }).subscribe((data) => {
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
