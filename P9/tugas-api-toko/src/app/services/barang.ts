// Mengimpor decorator Injectable
import { Injectable } from '@angular/core';

// Mengimpor HttpClient untuk melakukan HTTP request ke backend
import { HttpClient } from '@angular/common/http';

// Mengimpor Observable untuk menangani data asynchronous
import { Observable } from 'rxjs';

// Menjadikan service ini tersedia secara global (root)
@Injectable({
  providedIn: 'root',
})
export class Barang {

  // URL API backend
  private apiUrl = 'http://localhost:3000/api/barang';

  // Inject HttpClient melalui constructor
  constructor(private http: HttpClient) {}

  // Method untuk mengambil data barang (GET)
  getBarang(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Method untuk menambahkan barang (POST)
  tambahBarang(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
