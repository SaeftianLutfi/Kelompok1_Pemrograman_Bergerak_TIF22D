import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Barang } from '../services/barang';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage implements OnInit {

  nama_barang = '';
  harga: number | null = null;

  listBarang: any[] = [];

  constructor(private barangService: Barang) {}

  ngOnInit() {
    this.loadBarang();
  }

  loadBarang() {
    this.barangService.getBarang().subscribe(data => {
      this.listBarang = data;
    });
  }

  simpan() {

    if (!this.nama_barang || !this.harga) return;

    const data = {
      nama_barang: this.nama_barang,
      harga: this.harga
    };

    this.barangService.tambahBarang(data).subscribe(() => {

      this.nama_barang = '';
      this.harga = null;

      this.loadBarang(); 
    });
  }
}
