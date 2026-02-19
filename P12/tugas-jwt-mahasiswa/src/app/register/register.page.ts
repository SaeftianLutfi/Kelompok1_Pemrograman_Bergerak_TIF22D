import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  standalone: true,
  imports: [
    IonicModule,  
    CommonModule,
    RouterModule,
    FormsModule
  ]
})
export class RegisterPage {

  form = {
    username: '',
    password: '',
    role: 'mahasiswa'
  };

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  register() {
    this.auth.register(this.form).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
