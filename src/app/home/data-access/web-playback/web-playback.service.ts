///  <reference types="@types/spotify-web-playback-sdk"/>
import { Injectable } from '@angular/core';
import { BehaviorSubject, first, from } from 'rxjs';

@Injectable()
export class WebPlaybackService {
  private player$: BehaviorSubject<Spotify.Player> = new BehaviorSubject(null);
  private deviceId$: BehaviorSubject<string> = new BehaviorSubject(null);

  get player() {
    return this.player$.getValue();
  }

  get deviceId() {
    return this.deviceId$.getValue();
  }

  loadPlayer() {
    return this.player$.asObservable();
  }

  loadDeviceId() {
    return this.deviceId$.asObservable();
  }

  initWebPlayback() {
    from<Promise<void>>(
      new Promise((resolve) => {
        this.loadScript();
        resolve();
      })
    )
      .pipe(first())
      .subscribe(() => {
        window.onSpotifyWebPlaybackSDKReady = () => this.connectPlayer();
      });
  }

  private loadScript(): void {
    console.log('[Not-ify Web Playback Service] Loading Spotify SDK script');

    const node = document.createElement('script');
    node.src = 'https://sdk.scdn.co/spotify-player.js';
    node.async = true;

    document.getElementsByTagName('head')[0].appendChild(node);
  }

  private connectPlayer(): void {
    const player = new window.Spotify.Player({
      name: 'Not-ify Web Player',
      getOAuthToken: (cb) => {
        const accessToken = JSON.parse(
          localStorage.getItem('auth_data')
        ).access_token;

        cb(accessToken);
      },
      volume: 1
    });

    this.player$.next(player);

    player.addListener('initialization_error', ({ message }: Spotify.Error) => {
      console.error(message);
    });

    player.addListener('authentication_error', ({ message }: Spotify.Error) => {
      console.error(message);
    });

    player.addListener('account_error', ({ message }: Spotify.Error) => {
      console.error(message);
    });

    player.addListener('playback_error', ({ message }: Spotify.Error) => {
      alert(
        `Your account has to have Spotify Premium for playing music ${message}`
      );
    });

    player.addListener(
      'player_state_changed',
      (state: Spotify.PlaybackState) => {
        if (!state) return;
        console.log(state);
      }
    );

    player.addListener(
      'ready',
      ({ device_id }: Spotify.WebPlaybackInstance) => {
        console.log(
          '[Not-ify Web Playback Service] Ready with Device ID',
          device_id
        );

        this.deviceId$.next(device_id);
      }
    );

    player.addListener(
      'not_ready',
      ({ device_id }: Spotify.WebPlaybackInstance) => {
        console.log(
          '[Not-ify Web Playback Service] Device ID has gone offline',
          device_id
        );
      }
    );

    player.connect();
  }
}
