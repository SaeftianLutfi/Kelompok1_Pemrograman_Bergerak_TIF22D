import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { Subject, of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class HomePage {

  private textInput$ = new Subject<string>();

  result: any = null;
  loading = false;

  // GANTI DENGAN API KEY BARU
  private API_KEY = 'AIzaSyAuVTT9ZzhpAGto0ZgGeuXETGqmcTn9vWQ';

  private apiUrl =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

  constructor(private http: HttpClient) {

    this.textInput$
      .pipe(

        // Tunggu 1 detik setelah user berhenti mengetik
        debounceTime(1000),

        // Batalkan request lama jika user mengetik lagi
        switchMap(text => {

          if (!text || !text.trim()) {
            this.loading = false;
            this.result = null;
            return of(null); // WAJIB Observable
          }

          this.loading = true;

          const body = {
            contents: [{
              parts: [{
                text: `Check grammar for: "${text}".Return ONLY valid JSON like this:{ "status": "Correct/Incorrect", "correction": "..." }`
              }]
            }]
          };

          return this.http.post<any>(
            `${this.apiUrl}?key=${this.API_KEY}`,
            body
          ).pipe(

            // Jika API error, hentikan loading
            catchError(error => {
              console.error("API ERROR:", error);
              this.loading = false;
              return of(null);
            })

          );
        })

      )
      .subscribe((response: any) => {
        this.loading = false;

        if (!response) return;

        try {

          const aiText =
            response.candidates?.[0]?.content?.parts?.[0]?.text;

          if (!aiText) {
            throw new Error("Invalid AI response");
          }

          console.log("RAW AI RESPONSE:", aiText);

          // ✅ Ambil hanya bagian JSON menggunakan regex
          const jsonMatch = aiText.match(/\{[\s\S]*\}/);

          if (!jsonMatch) {
            throw new Error("No JSON found in AI response");
          }

          this.result = JSON.parse(jsonMatch[0]);

        } catch (error) {

          console.error("JSON PARSE ERROR:", error);

          this.result = {
            status: "Error",
            correction: "AI response format not valid JSON"
          };
        }
      });
    }

  onTextChange(event: any) {
    const value = event.target.value;
    this.textInput$.next(value);
  }
}
