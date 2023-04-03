import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
  standalone: true,
  selector: "app-music-player-controls",
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="flex-container">
      <p>{{ duration | date : "mm:ss" }}</p>
      <div>
        <input (change)="getValue(trackProgress.value)" #trackProgress class="range" type="range" min="0" max="{{trackTotalDuration}}" step="1" value="{{duration}}">
        </div>
      <!-- <div class="progress-bar">
        <div
          [style.width.%]="percentageComplete"
          class="progress-bar-inside"
        ></div>
      </div> -->
      <p>-{{ songCountDown | date : "mm:ss" }}</p>
    </div>

    <div class="flex-container">
      <!-- shuffle button -->
      <button type="button" class="prev-btn" aria-label="shuffle track">
        <mat-icon>shuffle</mat-icon>
      </button>
      <!-- previous button -->
      <button type="button" class="prev-btn" aria-label="search">
        <mat-icon>skip_previous</mat-icon>
      </button>
      <!-- play button -->
      <button
        type="button"
        class="play-button-large"
        *ngIf="!running"
        aria-label="play"
        (click)="play(trackUri, songCountDown)"
      >
        <mat-icon>play_arrow</mat-icon>
      </button>
      <!-- pause button -->
      <button
        type="button"
        class="play-button-large"
        *ngIf="running"
        aria-label="pause"
        (click)="pause()"
      >
        <mat-icon>pause</mat-icon>
      </button>
      <!-- next button -->
      <button 
        type="button" 
        class="next_btn" 
        aria-label="next track"
        (click)="nextTrack()">
        <mat-icon>skip_next</mat-icon>
      </button>
      <!-- repeat button -->
      <button type="button" class="next_btn" aria-label="repeat track" (click)="repeat()">
        <mat-icon>repeat</mat-icon>
      </button>
    </div>
  `,
  styleUrls: ["./music-player-controls.css"],
})
export class MusicPlayerControlsComponent {
  @Output() playEvent = new EventEmitter<{ uri: string; duration: number }>();
  @Output() pauseEvent = new EventEmitter<string>();
  @Output() repeatTrackEvent = new EventEmitter<string>();
  @Output() seekEvent = new EventEmitter<string>();
  @Output() nextTrackEvent = new EventEmitter<string>();
  @Input() running: boolean;
  @Input() duration: number;
  @Input() trackTotalDuration: number;
  @Input() percentageComplete: number;
  @Input() trackUri: string;
  @Input() songCountDown: number;


  pause() {
    this.pauseEvent.emit();
  }

  play(uri: string, durationMs: number) {
    this.playEvent.emit({ uri: uri, duration: durationMs });
  }

  repeat() {
    this.repeatTrackEvent.emit();
  }

  getValue(value: string) {
    this.seekEvent.emit(value);
    console.log(value);
  }

  nextTrack() {
    this.nextTrackEvent.emit();
  }
  
}
