// Import Component untuk membuat halaman Angular
import { Component } from '@angular/core';

// Import IonicModule agar bisa menggunakan komponen Ionic seperti ion-button, ion-header, dll
import { IonicModule } from '@ionic/angular';

// Import CommonModule untuk fitur dasar Angular seperti *ngIf, *ngFor
import { CommonModule } from '@angular/common';

// Import Router untuk navigasi antar halaman
import { Router } from '@angular/router';

@Component({
  selector: 'app-home', // Nama selector halaman
  templateUrl: './home.page.html', // File tampilan HTML
  styleUrls: ['./home.page.scss'], // File styling
  standalone: true, // Menandakan ini standalone component (tanpa module)
  imports: [
    IonicModule,     // Supaya bisa pakai komponen Ionic
    CommonModule     // Supaya bisa pakai directive Angular
  ]
})
export class HomePage {

  // Constructor digunakan untuk inject Router
  // Router ini dipakai untuk pindah halaman
  constructor(private router: Router) {}

  // Method ini dipanggil saat tombol ditekan
  // Fungsinya untuk navigasi ke halaman Merchant
  goToMerchant() {
    this.router.navigate(['/merchant']);
  }

}
