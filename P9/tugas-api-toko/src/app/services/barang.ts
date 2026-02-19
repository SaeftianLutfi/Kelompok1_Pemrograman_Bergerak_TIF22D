import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Barang {

  private apiUrl = 'http://localhost:3000/api/barang';

  constructor(private http: HttpClient) {}

  getBarang(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  tambahBarang(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
