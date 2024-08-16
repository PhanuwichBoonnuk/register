import { Injectable } from '@angular/core';
import { HttpCustom } from '@core/http-custom';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  constructor(private http: HttpCustom) {}

  getCards(params?: any) {
    let queryString = '';
    if (params) {
      queryString = '?';
      queryString += Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');
    }
    return this.http.get('/cards' + queryString);
  }

  getCardById(cardId: string) {
    return this.http.get('/cards/' + cardId);
  }

  createCard(data: any) {
    return this.http.post('/cards', data);
  }

  updateCard(cardId: string, data: any) {
    return this.http.put('/cards/' + cardId, data);
  }

  deleteCard(cardId: string) {
    return this.http.delete('/cards/' + cardId);
  }

  downloadTemplateCard() {
    return this.http.downloadData('/card/import/template');
  }

  importCards(data: any) {
    return this.http.uploadData('/card/import', data);
  }
}
