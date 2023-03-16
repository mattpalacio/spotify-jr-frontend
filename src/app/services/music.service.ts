import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { TrackData } from "../model/track.model";
import { AuthStore } from "../store/auth.store";

@Injectable ()
export class MusicService {
    constructor(private authStore: AuthStore, private router: Router, private http: HttpClient){

    }

    searchTrack(trackTitle: string): Observable<TrackData> {
        const url = 'https://api.spotify.com/v1/search';

        const headers = new HttpHeaders({
      Authorization:
        'Bearer ' + JSON.parse(localStorage.getItem('auth_data')!).access_token
    });
    const params = new HttpParams({
      fromObject: {
        q: 'track:'+ trackTitle,
        type: 'track',
        limit: 10
      }
    });

    return this.http.get<TrackData>(url, { headers, params });
    }
}