import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthStore } from "../store/auth.store";

@Injectable ()
export class MusicService {
    constructor(private authStore: AuthStore, private router: Router){

    }

    searchTracks(trackTitle: string) {
        const url = 'https://api.spotify.com/v1/search?q=track%3' + trackTitle
    }
}