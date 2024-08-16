import { Injectable } from '@angular/core';
import { HttpCustom } from '@core/http-custom';

@Injectable({
  providedIn: 'root',
})
export class QrcodeService {
  constructor(private http: HttpCustom) {}

  getQrCode() {
    return this.http.getData('/people/my-qr');
  }
}
