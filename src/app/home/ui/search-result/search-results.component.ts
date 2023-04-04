import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule, NgFor } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { TrackData } from "../../data-access/track.model";

@Component({
    selector: 'app-search-results',
    imports: [MatIconModule, NgFor, CommonModule],
    standalone: true,
    template: `
      <div class="music-player-container scroller" *ngIf="tracks">
          <ng-container *ngFor="let track of tracks.tracks.items">
            <div class="wrapper">
              <div class="box1">
                <button
                  *ngIf="trackUri !== track.uri || !running"
                  type="button"
                  class="play-button-small"
                  aria-label="play"
                  (click)="play(track.uri, track.duration_ms, track.album.uri)"
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
    `,
    styleUrls: ["./search-results.component.css"]
  })
  export class SearchResultsComponent {
    @Output() playEvent = new EventEmitter<{uri: string, duration: number}>();
    @Output() pauseEvent = new EventEmitter<string>();
    @Input() tracks: TrackData;
    @Input() trackUri: string;
    @Input() running: boolean;

    pause() {
        this.pauseEvent.emit();
    }

    play(uri: string, durationMs: number, abulmUri: string ) {
        this.playEvent.emit({uri: uri, duration: durationMs});
    }
  }