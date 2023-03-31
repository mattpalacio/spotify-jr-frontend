///  <reference types="@types/spotify-web-playback-sdk"/>
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, first, from } from 'rxjs';

@Injectable()
export class WebPlaybackService {
  private player$: BehaviorSubject<Spotify.Player> = new BehaviorSubject(null);
  private deviceId$: BehaviorSubject<string> = new BehaviorSubject(null);
  private playerState$: BehaviorSubject<Spotify.PlaybackState> =
    new BehaviorSubject(null);

  get player(): Spotify.Player {
    return this.player$.getValue();
  }

  get deviceId(): string {
    return this.deviceId$.getValue();
  }

  get playerState(): Spotify.PlaybackState {
    return this.playerState$.getValue();
  }

  loadPlayer(): Observable<Spotify.Player> {
    return this.player$.asObservable();
  }

  loadDeviceId(): Observable<string> {
    return this.deviceId$.asObservable();
  }

  loadPlayerState(): Observable<Spotify.PlaybackState> {
    return this.playerState$.asObservable();
  }

  initWebPlayback(): void {
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
        // TODO: Get token from auth service
        const accessToken = JSON.parse(
          localStorage.getItem('auth_data')
        ).access_token;

        cb(accessToken);
      },
      volume: 1
    });

    this.player$.next(player);

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
      'player_state_changed',
      (state: Spotify.PlaybackState) => {
        if (!state) return;

        this.playerState$.next(state);
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

    player.addListener('initialization_error', ({ message }: Spotify.Error) => {
      console.error(
        '[Not-ify Web Playback Service] Failed to initialize',
        message
      );
    });

    player.addListener('authentication_error', ({ message }: Spotify.Error) => {
      console.error(
        '[Not-ify Web Playback Service] Failed to authenticate',
        message
      );
    });

    player.addListener('account_error', ({ message }: Spotify.Error) => {
      console.error(
        '[Not-ify Web Playback Service] Account has to have Spotify Premium subscription',
        message
      );
    });

    player.addListener('playback_error', ({ message }: Spotify.Error) => {
      console.error(
        '[Not-ify Web Playback Service] Failed to perform playback',
        message
      );
    });

    player.connect();
  }
}
