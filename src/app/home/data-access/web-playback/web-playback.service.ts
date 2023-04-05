///  <reference types="@types/spotify-web-playback-sdk"/>
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  defer,
  first,
  from,
  fromEvent,
  takeUntil,
  tap
} from 'rxjs';
import { WebPlaybackState } from './web-playback.model';
import { TokenStorageService } from 'src/app/login/data-access/token-storage/token-storage.service';

@Injectable()
export class WebPlaybackService {
  private unsubscriber$: Subject<void> = new Subject();
  private playbackState$: BehaviorSubject<WebPlaybackState> =
    new BehaviorSubject({
      player: null,
      state: null,
      deviceId: null,
      volume: 1
    });

  constructor(private tokenStorage: TokenStorageService) {}

  private get playbackState(): WebPlaybackState {
    return this.playbackState$.getValue();
  }

  togglePlay(): void {
    defer(() => this.playbackState.player?.togglePlay())
      .pipe(first())
      .subscribe();
  }

  seek(positionMs: number): void {
    defer(() => this.playbackState.player?.seek(positionMs))
      .pipe(first())
      .subscribe();
  }

  nextTrack(): void {
    defer(() => this.playbackState.player?.nextTrack())
      .pipe(first())
      .subscribe();
  }

  prevTrack(): void {
    defer(() => this.playbackState.player?.previousTrack())
      .pipe(first())
      .subscribe();
  }

  setVolume(percentage: number): void {
    const volume = Number((percentage / 100).toFixed(2));

    defer(() => this.playbackState.player?.setVolume(volume))
      .pipe(first())
      .subscribe(() =>
        this.playbackState$.next({ ...this.playbackState, volume })
      );
  }

  loadPlaybackState$(): Observable<WebPlaybackState> {
    return this.playbackState$.asObservable();
  }

  initWebPlayback(): void {
    from<Promise<void>>(
      new Promise((resolve) => {
        this.loadScript();
        resolve();
      })
    )
      .pipe(
        first(),
        tap(() => '[Not-ify Web Playback Service] Loading Spotify SDK script')
      )
      .subscribe(() => {
        window.onSpotifyWebPlaybackSDKReady = () => this.connectPlayer();
      });
  }

  // Clean up method
  disconnectPlayer(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
    this.playbackState.player.disconnect();
  }

  private loadScript(): void {
    const node = document.createElement('script');
    node.src = 'https://sdk.scdn.co/spotify-player.js';
    node.async = true;

    document.getElementsByTagName('head')[0].appendChild(node);
  }

  private connectPlayer(): void {
    const player = new window.Spotify.Player({
      name: 'Not-ify Web Player',
      getOAuthToken: (cb) => {
        cb(this.tokenStorage.getAuthData().access_token);
      },
      volume: this.playbackState.volume
    });

    this.addPlayerListeners(player);
    this.addErrorListeners(player);

    defer(() => player.connect())
      .pipe(
        first(),
        tap(() =>
          console.log(
            '[Not-ify Web Playback Service] The Web Playback SDK successfully connected to Spotify!'
          )
        )
      )
      .subscribe();

    this.playbackState$.next({ ...this.playbackState, player });
  }

  private addPlayerListeners(player: Spotify.Player): void {
    fromEvent(player, 'ready')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe(({ device_id }: Spotify.WebPlaybackInstance) => {
        console.log(
          '[Not-ify Web Playback Service] Ready with Device ID',
          device_id
        );

        this.playbackState$.next({
          ...this.playbackState,
          deviceId: device_id
        });
      });

    fromEvent(player, 'player_state_changed')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe((state: Spotify.PlaybackState) => {
        if (!state) return;
        this.playbackState$.next({ ...this.playbackState, state });
      });

    fromEvent(player, 'not_ready')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe(({ device_id }: Spotify.WebPlaybackInstance) => {
        console.log(
          '[Not-ify Web Playback Service] Device ID has gone offline',
          device_id
        );
      });
  }

  private addErrorListeners(player: Spotify.Player): void {
    fromEvent(player, 'initialization_error')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe(({ message }: Spotify.Error) => {
        console.error(
          '[Not-ify Web Playback Service] Failed to initialize',
          message
        );
      });

    fromEvent(player, 'authentication_error')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe(({ message }: Spotify.Error) => {
        console.error(
          '[Not-ify Web Playback Service] Failed to authenticate',
          message
        );
      });

    fromEvent(player, 'account_error')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe(({ message }: Spotify.Error) => {
        console.error(
          '[Not-ify Web Playback Service] Account has to have Spotify Premium subscription',
          message
        );
      });

    fromEvent(player, 'playback_error')
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe(({ message }: Spotify.Error) => {
        console.error(
          '[Not-ify Web Playback Service] Failed to perform playback',
          message
        );
      });
  }
}
