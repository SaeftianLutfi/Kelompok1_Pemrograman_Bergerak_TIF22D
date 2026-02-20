// Import decorator Component dari Angular
import { Component } from '@angular/core';

// Import komponen-komponen Ionic (ion-header, ion-button, dll)
import { IonicModule } from '@ionic/angular';

// Module Angular umum seperti *ngIf, *ngFor
import { CommonModule } from '@angular/common';

// Module scanner untuk membaca QR Code menggunakan kamera
import { ZXingScannerModule } from '@zxing/ngx-scanner';

// Digunakan untuk navigasi antar halaman
import { Router } from '@angular/router';

@Component({
  selector: 'app-user', // Nama selector component
  templateUrl: './user.page.html', // File HTML tampilan
  standalone: true, // Menggunakan standalone component (tanpa module terpisah)
  imports: [
    IonicModule,
    CommonModule,
    ZXingScannerModule
  ]
})
export class UserPage {

  // Saldo awal user (bisa dianggap saldo DanaKilat)
  saldo: number = 100000;

  // Menyimpan transaksi terakhir setelah scan berhasil
  lastTransaction: any = null;

  // Constructor untuk inject Router (agar bisa pindah halaman)
  constructor(private router: Router) {}

  // Function ini otomatis dipanggil ketika QR berhasil discan
  // resultString adalah isi data dari QR (berupa string JSON)
  // WAJIB menggunakan JSON.parse() sesuai instruksi tugas
  onCodeResult(resultString: string) {
    try {

      // Mengubah string JSON dari QR menjadi object JavaScript
      const data = JSON.parse(resultString);

      // Validasi: pastikan QR memiliki properti "harga"
      if (!data.harga) {
        alert('Format QR tidak valid!');
        return;
      }

      // Cek apakah saldo mencukupi untuk membayar
      if (this.saldo >= data.harga) {

        // Saldo dikurangi sesuai nominal yang ada di QR (TIDAK HARDCODE)
        this.saldo -= data.harga;

        // Simpan data transaksi untuk ditampilkan di UI
        this.lastTransaction = data;

        alert('Pembayaran berhasil!');
      } else {

        // Jika saldo kurang
        alert('Saldo tidak cukup!');
      }

    } catch {

      // Jika QR bukan format JSON yang valid
      alert('QR tidak valid!');
    }
  }

  // Function untuk kembali ke halaman Merchant
  goToMerchant() {
    this.router.navigate(['/merchant']);
  }

}
