// Mengimpor tipe Routes dari Angular Router
// Digunakan untuk mendefinisikan daftar routing di aplikasi
import { Routes } from '@angular/router';

// Mengimpor halaman Merchant
// Halaman ini digunakan untuk input nominal dan generate QR
import { MerchantPage } from './merchant/merchant.page';

// Mengimpor halaman User (DanaKilat)
// Halaman ini digunakan untuk scan QR dan mengurangi saldo
import { UserPage } from './user/user.page';


// Mendefinisikan konfigurasi routing aplikasi
export const routes: Routes = [

  {
    // Jika path kosong (localhost:8100/)
    path: '',
    
    // Maka otomatis diarahkan ke halaman merchant
    redirectTo: 'merchant',
    
    // pathMatch full artinya harus cocok sepenuhnya dengan ''
    pathMatch: 'full'
  },

  {
    // Jika URL = /merchant
    path: 'merchant',
    
    // Maka tampilkan MerchantPage
    component: MerchantPage
  },

  {
    // Jika URL = /user
    path: 'user',
    
    // Maka tampilkan UserPage
    component: UserPage
  }
];
