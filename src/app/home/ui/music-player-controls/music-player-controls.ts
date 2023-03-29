import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
    standalone: true,
    selector: 'app-music-player-controls',
    imports: [CommonModule, MatIconModule],
    template: `
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
        <button type="button" class="prev-btn" aria-label="search">
          <mat-icon>skip_previous</mat-icon>
        </button>
        <button
          type="button"
          class="play-button-large"
          *ngIf="!running"
          aria-label="play"
          (click)="play(trackUri, songCountDown)"
          
        >
          <mat-icon>play_arrow</mat-icon>
        </button>
        <button
          type="button"
          class="play-button-large"
          *ngIf="running"
          aria-label="pause"
          (click)="pause()"
        >
          <mat-icon>pause</mat-icon>
        </button>
        <button type="button" class="next_btn" aria-label="next track">
          <mat-icon>skip_next</mat-icon>
        </button>
      </div>
    `,
    styleUrls: ["./music-player-controls.css"]
  })
  export class MusicPlayerControlsComponent {
    @Output() playEvent = new EventEmitter<{uri: string, duration: number}>();
    @Output() pauseEvent = new EventEmitter<string>();
    @Input() running: boolean;
    @Input() duration: number;
    @Input() percentageComplete: number;
    @Input() trackUri: string;
    @Input() songCountDown: number;

    pause() {
        this.pauseEvent.emit();
    }

    play(uri: string, durationMs: number) {
        this.playEvent.emit({uri: uri, duration: durationMs});
    }
  }