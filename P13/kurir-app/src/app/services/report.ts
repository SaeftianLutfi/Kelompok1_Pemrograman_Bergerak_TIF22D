import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { from, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportService {

  api = 'http://192.168.43.128:3000';

  constructor(private http: HttpClient) {}

  kirim(data: any) {

    return from(Preferences.get({ key: 'token' })).pipe(
      switchMap(({ value }) => {

        return this.http.post(
          `${this.api}/home`,
          data,
          {
            headers: {
              Authorization: `Bearer ${value}`
            }
          }
        );

      })
    );

  }
}
