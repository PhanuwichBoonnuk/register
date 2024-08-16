import { Injectable } from '@angular/core';
import { HttpCustom } from '@core/http-custom';

@Injectable({
  providedIn: 'root',
})
export class LockerService {
  constructor(private http: HttpCustom) {}

  getLockers(params?: any) {
    let queryString = '';
    if (params) {
      queryString = '?';
      queryString += Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');
    }

    return this.http.get('/manage' + queryString);
  }

  getLockerById(lockerId: string) {
    return this.http.get('/manage/' + lockerId);
  }

  createLocker(data: any) {
    return this.http.post('/manage', data);
  }

  updateLocker(lockerId: string, data: any) {
    return this.http.put('/manage/' + lockerId, data);
  }

  updateLockers(data: any) {
    return this.http.put('/manage', data);
  }

  deleteLocker(lockerId: string) {
    return this.http.delete('/manage/' + lockerId);
  }

  deleteLockers(data: any) {
    return this.http.post('/manage/delete', data);
  }

  importLocker(file) {
    return this.http.importLocker('/manage/import', file);
  }

  exportLocker(data: { lockerIds: string[] }) {
    return this.http.downloadPost('/manage/export', data);
  }
}
