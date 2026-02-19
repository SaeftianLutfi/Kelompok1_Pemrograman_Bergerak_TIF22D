import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, CommonModule],
})
export class HomePage {

  result: any;

  constructor(private http: HttpClient) {}

  async generateUser() {
    try {
      const response: any = await lastValueFrom(
        this.http.get('https://randomuser.me/api/?results=1')
      );

      const user = response.results[0];

      this.result = {
        name: `${user.name.first} ${user.name.last}`,
        email: user.email,
        photo: user.picture.large
      };

      console.log(this.result);

    } catch (error) {
      console.error('Error:', error);
    }
  }
}
