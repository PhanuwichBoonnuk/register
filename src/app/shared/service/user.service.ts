import { Injectable } from '@angular/core';
import { HttpCustom } from '@core/http-custom';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpCustom) {}

  getUsers(params?: any) {
    let queryString = '';
    if (params) {
      queryString = '?';
      queryString += Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');
    }

    return this.http.get('/users' + queryString);
  }

  getUserById(userId: string) {
    return this.http.get('/users/id/' + userId);
  }

  getProfile() {
    return this.http.get('/users/token');
  }

  createUser(data: any) {
    return this.http.post('/users', data);
  }

  updateUser(userId: string, data) {
    return this.http.put('/users/' + userId, data);
  }

  deleteUser(userId: string) {
    return this.http.delete('/users/' + userId);
  }

  changePassword(data: any) {
    return this.http.post('/users/pwd/me', data);
  }

  changePasswordByAdmin(userId: string, data: any) {
    return this.http.post('/users/pwd/' + userId, data);
  }

  getBanUsers(params?: any) {
    let queryString = '';
    if (params) {
      queryString = '?';
      queryString += Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');
    }

    return this.http.get('/users/ban' + queryString);
  }

  banUser(userId: string, data: any) {
    return this.http.put('/users/' + userId + '/ban', data);
  }

  unbanUser(userId: string, data: any) {
    return this.http.put('/users/' + userId + '/unban', data);
  }

  downloadTemplateUser() {
    return this.http.downloadData('/people/import/template/local');
  }

  importUsers(data: File) {
    return this.http.uploadData('/people/import/local', data);
  }

}
