import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class Mahasiswa {
  apiUrl = 'http://localhost:3000/api/mahasiswa';
  constructor(private http: HttpClient) {}
  
  getAll(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  add(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
}
