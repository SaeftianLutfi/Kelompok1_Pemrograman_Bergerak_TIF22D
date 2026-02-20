import { Component } from '@angular/core';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AuthService } from '../services/auth';
import { ReportService } from '../services/report';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/marker-icon-2x.png',
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png',
});

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage {

  map!: L.Map;
  latitude!: number;
  longitude!: number;

  no_resi: string = '';
  fotoFile: any;
  fotoPreview?: string;

  showMap: boolean = false;

  constructor(
    private auth: AuthService,
    private report: ReportService,
    private router: Router
  ) {}

  // Lifecycle Ionic (lebih stabil dari ngOnInit)
  async ionViewDidEnter() {
    const token = await this.auth.getToken();

    if (!token) {
      this.router.navigate(['/login']);
    }
  }

  async initMap() {

    if (this.map) {
      this.map.remove();
    }

    try {

      await Geolocation.requestPermissions();

      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      this.latitude = pos.coords.latitude;
      this.longitude = pos.coords.longitude;

      console.log('LAT:', this.latitude);
      console.log('LONG:', this.longitude);

    } catch (error) {

      console.log('Error ambil lokasi:', error);
      alert('Gagal mengambil lokasi. Pastikan GPS aktif.');

      return false;
    }

    this.map = L.map('map').setView([this.latitude, this.longitude], 18);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.map);

    L.marker([this.latitude, this.longitude])
      .addTo(this.map)
      .bindPopup('Lokasi Pengiriman')
      .openPopup();

    setTimeout(() => {
      this.map.invalidateSize();
    }, 800);

    return true;
  }

  async ambilFoto() {

    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });

    this.fotoPreview = `data:image/jpeg;base64,${image.base64String}`;
    this.fotoFile = image.base64String;

    this.showMap = true;

    // Tunggu DOM siap sebelum buat map
    setTimeout(async () => {
      await this.initMap();

      // Force resize lagi biar aman
      setTimeout(() => {
        this.map.invalidateSize();
      }, 500);

    }, 700);
  }

  async kirimLaporan() {

    if (!this.fotoFile) {
      alert('Silakan ambil foto terlebih dahulu!');
      return;
    }

    const data = {
      no_resi: this.no_resi,
      latitude: this.latitude,
      longitude: this.longitude,
      foto: this.fotoFile,
      status: 'Terkirim'
    };

    this.report.kirim(data).subscribe({
      next: () => {
        alert('Laporan berhasil dikirim!');
        this.no_resi = '';
        this.fotoPreview = '';
      },
      error: (err) => {
        console.log(err);
        alert('Gagal kirim laporan');
      }
    });
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}
