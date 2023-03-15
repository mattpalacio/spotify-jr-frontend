import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, shareReplay } from "rxjs";
import { TrackData } from "../model/track.model";
import { MusicService } from "../services/music.service";

@Injectable({
    providedIn: 'root'
})

export class MusicStore {
    private tracks$: BehaviorSubject<TrackData> = new BehaviorSubject(null);
    constructor(private musicService: MusicService){
    }

    get tracks(){
        return this.tracks$.getValue();
    }

    loadTracks() {
        return this.tracks$.asObservable();
    }
    
    getTracks(trackName: string) {
        const https$: Observable<TrackData> = this.musicService.searchTrack(trackName)
            .pipe(shareReplay({bufferSize: 1, refCount: true}));
        
            https$.subscribe({
                next: (res) => {
                    this.tracks$.next(res);
                },
                error: (err) => {
                    console.log('Unable to retrieve music', err)
                }
            });
        return https$
    }
}
