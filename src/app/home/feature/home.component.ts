import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from 'src/app/header/feature/header.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, NgFor } from '@angular/common';
import { exhaustMap, Observable, of, Subject, takeUntil } from 'rxjs';
import { MusicStore } from 'src/app/home/data-access/music.store';
import { WebPlaybackService } from '../data-access/web-playback/web-playback.service';
import { WebPlaybackState } from '../data-access/web-playback/web-playback.model';
import { SearchComponent } from "../ui/search/search.component";
import { SearchResultsComponent } from "../ui/search-result/search-results.component";
import { TrackData } from "../data-access/track.model";
import { MusicPlayerControlsComponent } from "../ui/music-player-controls/music-player-controls";
import { MusicService } from '../data-access/music.service';
import { environment } from 'src/environments/environment.development';

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
          [trackUri]="trackUri"
          [songCountDown]="songCountDown"
          [trackTotalDuration]="trackTotalDuration"
          (playEvent)="playEvent($event)"
          (pauseEvent)="pauseEvent()"
          (seekEvent)="seekEvent($event)"
          (nextTrack)="nextTrackEvent()"
          (repeatTrackEvent)="repeatEvent()">>
        </app-music-player-controls>
      </div>
    </div>
  `,
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  tracks$: Observable<TrackData>;
  deviceId: string | null = null;
  trackUri: string | null = null;
  running: boolean;
  repeat = false;
  trackProgress = 0;
  songCountDown = 0;
  duration = 0;
  startTimer: any;
  trackTotalDuration = 0;
  player: Spotify.Player;

  webPlaybackState: WebPlaybackState;
  isPlaying = false;
  private unsubsciber$: Subject<void> = new Subject();

  constructor(
    private webPlayback: WebPlaybackService,
    private http: HttpClient,
    private musicStore: MusicStore,
    private musicService: MusicService
  ) {}

  ngOnInit(): void {
    this.webPlayback.initWebPlayback();
    this.webPlayback
      .loadPlaybackState$()
      .pipe(takeUntil(this.unsubsciber$))
      .subscribe((state) => {
        this.webPlaybackState = { ...state };
        this.isPlaying = !state?.state?.paused;
      });
  }

  ngOnDestroy(): void {
    this.unsubsciber$.next();
    this.unsubsciber$.complete();
  }

  start(trackDuration: number): void {
    if (!this.running) {
      this.running = true;
      this.startTimer = setInterval(() => {
        this.songCountDown = this.songCountDown - 1000;
        this.duration = this.duration + 1000;
        if (this.duration > trackDuration) {
          this.duration = 0;
          this.songCountDown = 0;
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
    if(this.songCountDown <= 0 && this.repeat === true){
      this.songCountDown = this.trackTotalDuration;
      this.start(this.trackTotalDuration);
    }
  }

  search(trackName: string) {
    this.musicStore.getTracks(trackName);
    this.tracks$ = this.musicStore.loadTracks();
  }

  seekEvent($event: string) {
    this.webPlayback.seek(+$event);
    this.songCountDown = this.trackTotalDuration - +$event;
    this.duration = +$event;
  }

  receiveSearch($event: string) {
    this.musicStore.getTracks($event);
    this.tracks$ = this.musicStore.loadTracks();
  }

  repeatEvent() {
    this.repeat = !this.repeat;
    //this.musicService.repeatTrack(this.webPlaybackState?.deviceId, this.repeat === true ? "track" : "off").subscribe();
  }

  nextTrackEvent() {
    this.player?.nextTrack();
  }

  // TODO: move to store
  playEvent($event): void {
    // if user clicked a new track, reset durations and progress bar
    if (this.trackUri == null || this.trackUri != $event.uri) {
      this.songCountDown = 0;
      this.duration = 0;
      this.trackTotalDuration = $event.duration;
      this.stop();
    }

    const url = environment.apiUrl + '/player/play';

    const params = new HttpParams({
      fromObject: {
        device_id: this.webPlaybackState?.deviceId
      }
    });
    this.trackUri = $event.uri;
    this.songCountDown = $event.duration;
    this.start($event.duration);

    const body = {
      uris: [$event.uri],
      position_ms: this.duration

    };

    this.http.put(url, body, { params }).subscribe();
  }

  bigPlay() {
    this.webPlayback.togglePlay();
  }

  nextTrack() {
    this.webPlayback.nextTrack();
  }

  prevTrack() {
    this.webPlayback.prevTrack();
  }

  pauseEvent(): void {
    this.getCurrentlyPlaying();

    const url = environment.apiUrl + '/player/pause';

    const params = new HttpParams({
      fromObject: {
        device_id: this.webPlaybackState?.deviceId
      }
    });

    this.stop();
    this.http.put(url, {}, { params }).subscribe();
  }

  // TODO: move to store
  getDevices(): void {
    const url = environment.apiUrl + '/player/devices';

    this.http.get<any>(url).subscribe((data) => {
      console.log('DEVICE DATA', data);
      this.deviceId = data.devices[0].id;
      console.log('DEVICE ID', this.deviceId);
    });
  }

  // TODO: move to store
  transfer(deviceId: string): void {
    const url = environment.apiUrl + '/player';

    const body = {
      device_ids: [deviceId],
      play: true
    };

    this.http.put(url, body).subscribe();
  }

  getCurrentlyPlaying(): void {
    const url = environment.apiUrl + '/player/currently-playing';

    this.http
      .get<any>(url)
      .pipe(exhaustMap((data) => of(data)))
      .subscribe((data) => {
        this.trackUri = data.item.uri;
        this.trackProgress = data.progress_ms;
      });
  }
}


