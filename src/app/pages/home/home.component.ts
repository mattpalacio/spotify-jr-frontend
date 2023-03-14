import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="container">
      <button (click)="search()">Search</button>
      <button (click)="getDevices()">Get devices</button>
      <button (click)="play()">Play</button>
      <button (click)="pause()">Pause</button>
      <button (click)="transfer()">Transfer</button>
    </div>
  `,
  styles: [
    '.container { background: linear-gradient(to left, #7600bc, #a000c8 ); width: 100%; height: 100vh;}'
  ]
})
export class HomeComponent implements OnInit {
  deviceId: string | null = null;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getDevices();
  }

  search(): void {
    const url = 'http://127.0.0.1:8000/search';
    const headers = new HttpHeaders({
      Authorization:
        'Bearer ' + JSON.parse(localStorage.getItem('auth_data')!).access_token
    });
    const params = new HttpParams({
      fromObject: {
        q: 'track:Lvl',
        type: 'track'
      }
    });

    this.http.get(url, { headers, params }).subscribe((data) => {
      console.log(data);
    });
  }

  play(): void {
    const url = 'http://127.0.0.1:8000/player/play';
    const headers = new HttpHeaders({
      Authorization:
        'Bearer ' + JSON.parse(localStorage.getItem('auth_data')!).access_token
    });
    const params = new HttpParams({
      fromObject: {
        device_id: this.deviceId!
      }
    });
    const body = {
      uris: ['spotify:track:787rCZF9i4L1cXGMkdyIk4']
      // position_ms: 0
    };

    this.http.put(url, body, { headers, params }).subscribe();
  }

  pause(): void {
    const url = 'http://127.0.0.1:8000/player/pause';
    const headers = new HttpHeaders({
      Authorization:
        'Bearer ' + JSON.parse(localStorage.getItem('auth_data')!).access_token
    });
    const params = new HttpParams({
      fromObject: {
        device_id: this.deviceId!
      }
    });

    this.http.put(url, {}, { headers, params }).subscribe();
  }

  getDevices(): void {
    const url = 'http://127.0.0.1:8000/player/devices';
    const headers = new HttpHeaders({
      Authorization:
        'Bearer ' + JSON.parse(localStorage.getItem('auth_data')!).access_token
    });

    this.http.get<any>(url, { headers }).subscribe((data) => {
      console.log('DEVICE DATA', data);
      this.deviceId = data.devices[0].id;
      console.log('DEVICE ID', this.deviceId);
    });
  }

  transfer(): void {
    const url = 'http://127.0.0.1:8000/player';
    const headers = new HttpHeaders({
      Authorization:
        'Bearer ' + JSON.parse(localStorage.getItem('auth_data')!).access_token
    });
    const body = {
      device_ids: [this.deviceId],
      play: true
    };

    this.http.put(url, body, { headers }).subscribe((data) => {
      console.log(data);
    });
  }
}
