import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TrackData } from "./track.model";

@Injectable()
export class MusicService {
  constructor(private http: HttpClient) {}

  searchTrack(trackTitle: string): Observable<TrackData> {
    const url = "http://127.0.0.1:8000/search";

    const headers = new HttpHeaders({
      Authorization:
        "Bearer " + JSON.parse(localStorage.getItem("auth_data")!).access_token,
    });
    const params = new HttpParams({
      fromObject: {
        q: "track:" + trackTitle,
        type: "track",
        limit: 10,
      },
    });

    return this.http.get<TrackData>(url, { headers, params });
  }

  repeatTrack(deviceId: string, repeatState: string) {
    const url = "https://api.spotify.com/v1/me/player/repeat";

    const headers = new HttpHeaders({
      Authorization:
        "Bearer " + JSON.parse(localStorage.getItem("auth_data")!).access_token,
    });
    const params = new HttpParams({
      fromObject: {
        state: repeatState,
        device_id: deviceId
      },
    });
    return this.http.put(url, {}, { headers, params });
  }

  changeDuration(duration: number, deviceId: string) {
    const url = "http://127.0.0.1:8000/player/seek";

    const headers = new HttpHeaders({
      Authorization:
        "Bearer " + JSON.parse(localStorage.getItem("auth_data")!).access_token,
    });
    const params = new HttpParams({
      fromObject: {
        position_ms: duration,
        device_id: deviceId
      },
    });
    return this.http.put(url, { headers, params }).subscribe();
  }
}
