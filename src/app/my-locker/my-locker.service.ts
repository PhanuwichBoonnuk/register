import { Injectable } from '@angular/core';
import { HttpCustom } from '@core/http-custom';

@Injectable({
  providedIn: 'root',
})
export class MyLockerService {
  constructor(private http: HttpCustom) {}

  getMyLocker() {
    return this.http.get('/users/lockers');
  }

  openLocker(data: any) {
    return this.http.post('/actions/open', data);
  }

  returnLocker(data: any) {
    return this.http.post('/actions/return', data);
  }
}
