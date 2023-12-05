import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface IGeoIPData {
  network: string;
  geoname_id: string;
  continent_code: string;
  continent_name: string;
  country_iso_code: string;
  country_name: string;
  is_anonymous_proxy: string;
  is_satellite_provider: string;
}

@Injectable({
  providedIn: 'root'
})
export class GeoipDataService {

  http = inject(HttpClient);

  geoData: IGeoIPData[] = [];

  constructor() { }

  init(): Promise<boolean> {
    return new Promise( (res, rej) => {
      const request = this.http.get<IGeoIPData[]>('assets/geoip.json');
      request.subscribe({
        next: (data) => {
          this.geoData = data;
          res(true);
        },
        error: (err) => {
          rej(err);
        }
      });
    });
  }

}
