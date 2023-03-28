import { Component, EventEmitter, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: "app-search",
    imports: [MatIconModule],
    standalone: true,
    template: `
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
    `,
    styleUrls: ["./search.component.css"],
  })
  export class SearchComponent {
    @Output() searchEvent = new EventEmitter<string>();
    // constructor() {}
    search(trackName: string) {
      this.searchEvent.emit(trackName);
    }
  }
  