import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  async canActivate() {
    const token = await this.auth.getToken();

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
