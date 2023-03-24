import { Component } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: "app-search",
    imports: [MatIconModule],
    standalone: true,
    template: `
      <div class="search-bar-container">
      <!-- (keydown.enter)="search(searchInput.value)" -->
        <input
          
          type="text"
          class="search"
          placeholder="Search Tracks"
          #searchInput
        />
        <button *ngIf="searchInput.value" class="search" type="button" aria-label="clear" (click)="searchInput.value = ''">
          <mat-icon>clear</mat-icon>
        </button>
        <!-- (click)="search(searchInput.value)" -->
        <button class="search" type="button" aria-label="search" > 
          <mat-icon>search</mat-icon>
        </button>
      </div>
    `,
    styleUrls: ["./search.component.css"],
  })
  export class SearchComponent {
    // constructor() {}
    
  }
  