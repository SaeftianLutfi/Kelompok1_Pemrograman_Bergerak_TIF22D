import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PatrolService {

  api = 'http://localhost:3000';

  constructor(private http: HttpClient){}

  kirimData(data:any){
    return this.http.post(this.api+'/laporan', data);
  }
}
