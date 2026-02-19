import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HomePage implements OnInit {

  map!: L.Map;

  latitude: number = 0;
  longitude: number = 0;
  barcodeResult: string = '-';
  capturedImage?: string;

  // Koordinat target (ubah sesuai lokasi tugas)
  targetLat: number = -6.200000;
  targetLng: number = 106.816666;

  constructor(private alertCtrl: AlertController) {}

  async ngOnInit() {
    await this.initMap();
  }

  // =============================
  // INIT MAP + GPS
  // =============================
  async initMap() {

    const position = await Geolocation.getCurrentPosition();

    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;

    // Buat map
    this.map = L.map('map').setView(
      [this.latitude, this.longitude],
      18
    );

    // Tambahkan tile OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Marker posisi user
    L.marker([this.latitude, this.longitude])
      .addTo(this.map)
      .bindPopup('Posisi Anda')
      .openPopup();

    // Marker lokasi target
    L.marker([this.targetLat, this.targetLng])
      .addTo(this.map)
      .bindPopup('Lokasi Target');

    // Tambahkan lingkaran radius 100m
    L.circle([this.targetLat, this.targetLng], {
      radius: 100,
    }).addTo(this.map);
  }

  // =============================
  // MULAI PATROLI
  // =============================
  async mulaiPatroli() {

    const { barcodes } = await BarcodeScanner.scan();

    if (barcodes.length > 0) {

      this.barcodeResult = barcodes[0].rawValue ?? '-';

      await this.ambilFoto();
      await this.cekJarak();
    }
  }

  // =============================
  // AMBIL FOTO
  // =============================
  async ambilFoto() {

    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });

    this.capturedImage = image.webPath;
  }

  // =============================
  // CEK JARAK 100 METER
  // =============================
  async cekJarak() {

    const jarak = this.hitungJarak(
      this.latitude,
      this.longitude,
      this.targetLat,
      this.targetLng
    );

    if (jarak > 100) {

      const alert = await this.alertCtrl.create({
        header: 'Peringatan!',
        message: 'Anda berada di luar jangkauan patroli (100m)!',
        buttons: ['OK']
      });

      await alert.present();
    }
  }

  // =============================
  // RUMUS HAVERSINE
  // =============================
  hitungJarak(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {

    const R = 6371e3; // meter
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}
