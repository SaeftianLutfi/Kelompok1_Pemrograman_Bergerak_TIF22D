import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth';
import { from, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MahasiswaService {

  api = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  // GET DATA
  getAll() {
    return from(this.auth.getToken()).pipe(
      switchMap(token =>
        this.http.get<any>(this.api + '/home', {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
      )
    );
  }

  // ADD DATA
  add(data: any) {
    return from(this.auth.getToken()).pipe(
      switchMap(token =>
        this.http.post<any>(this.api + '/home', data, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
      )
    );
  }
}
