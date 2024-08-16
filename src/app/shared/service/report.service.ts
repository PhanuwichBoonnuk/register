import { Injectable } from '@angular/core';
import { HttpCustom } from '@core/http-custom';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpCustom) {}

  getLockerReport(params?: any) {
    let queryString = '';
    if (params) {
      queryString = '?';
      queryString += Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');
    }

    return this.http.get('/reports/lockers' + queryString);
  }

  getTransactionReport(params?: any) {
    let queryString = '';
    if (params) {
      queryString = '?';
      queryString += Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');
    }

    return this.http.download('/actions/export' + queryString);
  }
}
