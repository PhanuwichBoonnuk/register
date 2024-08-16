import { Injectable } from '@angular/core';
import { HttpCustom } from '@core/http-custom';

@Injectable({
  providedIn: 'root',
})
export class ActionService {
  constructor(private http: HttpCustom) {}

  getActions(params?: any) {
    let queryString = '';
    if (params) {
      queryString = '?';
      queryString += Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');
    }

    return this.http.get('/actions' + queryString);
  }

  getActionById(actionId: string) {
    return this.http.get('/actions/' + actionId);
  }

  exportAction(params?: any) {
    let queryString = '';
    if (params) {
      queryString = '?';
      queryString += Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');
    }

    return this.http.get('/actions/export' + queryString);
  }

  openLocker(data: any) {
    return this.http.post('/actions/open', data);
  }

  openLockerByAdmin(data: any) {
    return this.http.post('/actions/open/admin', data);
  }

  returnLocker(data: any) {
    return this.http.post('/actions/return', data);
  }

  returnLockerByAdmin(data: any) {
    return this.http.post('/actions/return/admin', data);
  }
}
