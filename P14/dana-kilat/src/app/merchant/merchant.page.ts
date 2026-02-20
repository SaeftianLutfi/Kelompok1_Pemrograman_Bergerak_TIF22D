// Mengimpor decorator Component dari Angular
import { Component } from '@angular/core';

// Mengimpor module Ionic agar bisa menggunakan komponen UI Ionic
import { IonicModule } from '@ionic/angular';

// Mengimpor CommonModule untuk directive seperti *ngIf, *ngFor
import { CommonModule } from '@angular/common';

// Mengimpor FormsModule untuk menggunakan ngModel (two-way binding)
import { FormsModule } from '@angular/forms';

// Mengimpor komponen QR Code dari library angularx-qrcode
import { QRCodeComponent } from 'angularx-qrcode';

// Mengimpor Router untuk navigasi antar halaman
import { Router } from '@angular/router';

@Component({
  selector: 'app-merchant', // Nama selector komponen
  templateUrl: './merchant.page.html', // File HTML yang digunakan
  standalone: true, // Menggunakan standalone component (tanpa module terpisah)
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    QRCodeComponent
  ]
})
export class MerchantPage {

  // Variabel untuk menyimpan nama merchant (diinput dari user)
  merchantName: string = '';

  // Variabel untuk menyimpan nominal pembayaran
  amount: number = 0;

  // Variabel untuk menyimpan data QR dalam bentuk string JSON
  qrData: string = '';

  // Constructor digunakan untuk mengakses Router (navigasi halaman)
  constructor(private router: Router) {}

  // Function untuk generate QR Code
  generateQR() {

    // Validasi: jika nama merchant atau nominal kosong
    if (!this.merchantName || !this.amount) {
      alert('Isi semua data!');
      return;
    }

    // Membuat data dalam format JSON string sesuai instruksi tugas
    // Format: {"merchant": "...", "harga": ...}
    // Data ini nanti akan di-scan dan diproses di halaman User
    this.qrData = JSON.stringify({
      merchant: this.merchantName,
      harga: this.amount
    });
  }

  // Function untuk pindah ke halaman User (DanaKilat)
  goToUser() {
    this.router.navigate(['/user']);
  }

}
