import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TrackData } from './track.model';
import { environment } from 'src/environments/environment.development';

@Injectable()
export class MusicService {
  constructor(private http: HttpClient) {}

  searchTrack(trackTitle: string): Observable<TrackData> {
    const url = environment.apiUrl + '/search';

    const params = new HttpParams({
      fromObject: {
        q: 'track:' + trackTitle,
        type: 'track',
        limit: 10
      }
    });

    return this.http.get<TrackData>(url, { params });
  }
}
