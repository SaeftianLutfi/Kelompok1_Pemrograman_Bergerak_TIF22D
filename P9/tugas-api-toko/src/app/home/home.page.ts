// Mengimpor module dan dependency yang dibutuhkan
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Barang } from '../services/barang';

// Decorator komponen Home
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage implements OnInit {

  // Variabel untuk input form
  nama_barang = '';
  harga: number | null = null;

  // Array untuk menampung data barang dari API
  listBarang: any[] = [];

  // Inject service Barang
  constructor(private barangService: Barang) {}

  // Dijalankan saat halaman pertama kali dibuka
  ngOnInit() {
    this.loadBarang();
  }

  // Mengambil data barang dari backend
  loadBarang() {
    this.barangService.getBarang().subscribe(data => {
      this.listBarang = data;
    });
  }

  // Fungsi untuk menyimpan data barang baru
  simpan() {

    // Validasi sederhana
    if (!this.nama_barang || !this.harga) return;

    const data = {
      nama_barang: this.nama_barang,
      harga: this.harga
    };

    // Kirim data ke backend
    this.barangService.tambahBarang(data).subscribe(() => {

      // Reset form setelah berhasil
      this.nama_barang = '';
      this.harga = null;

      // Reload data
      this.loadBarang(); 
    });
  }
}
