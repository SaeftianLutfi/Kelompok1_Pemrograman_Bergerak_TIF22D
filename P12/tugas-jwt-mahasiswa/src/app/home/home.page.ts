import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../services/auth';
import { MahasiswaService } from '../services/mahasiswa';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ]
})
export class HomePage implements OnInit {

  mahasiswa: any[] = [];
  role: string = '';

  form = {
    nim: '',
    nama: '',
    program_studi: '',
    jenis_kelamin: ''
  };

  constructor(
    private auth: AuthService,
    private service: MahasiswaService,
    private router: Router
  ) {}

  // ======================
  // INIT
  // ======================
  async ngOnInit() {

    const token = await this.auth.getToken();

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const decoded: any = jwtDecode(token);
    this.role = decoded.role;

    this.loadData();
  }

  // ======================
  // LOAD DATA
  // ======================
  loadData() {
    this.service.getAll().subscribe({
      next: (data) => {
        this.mahasiswa = data;
      },
      error: (err) => {
        console.log("Error load:", err);
      }
    });
  }

  // ======================
  // TAMBAH DATA
  // ======================
  tambah() {

    if (!this.form.nim || !this.form.nama) {
      alert("NIM dan Nama wajib diisi!");
      return;
    }

    this.service.add(this.form).subscribe({
      next: () => {
        alert("Data berhasil ditambahkan");

        // reset form
        this.form = {
          nim: '',
          nama: '',
          program_studi: '',
          jenis_kelamin: ''
        };

        this.loadData();
      },
      error: (err) => {
        console.log("Error tambah:", err);
        alert("Gagal menambahkan data");
      }
    });
  }

  // ======================
  // LOGOUT
  // ======================
  async logout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}
