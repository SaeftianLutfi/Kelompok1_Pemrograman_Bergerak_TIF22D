import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  api = 'http://192.168.100.171:3000';

  constructor(private http: HttpClient) {}

  // LOGIN
  login(data: any) {
    return this.http.post<any>(this.api + '/login', data);
  }

  // REGISTER
  register(data: any) {
    return this.http.post<any>(this.api + '/register', data);
  }

  // SIMPAN TOKEN
  async saveToken(token: string) {
    await Preferences.set({
      key: 'token',
      value: token
    });
  }

  // AMBIL TOKEN
  async getToken() {
    const { value } = await Preferences.get({ key: 'token' });
    return value;
  }

  // LOGOUT
  async logout() {
    await Preferences.remove({ key: 'token' });
  }
}
