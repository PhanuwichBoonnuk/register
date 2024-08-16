import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfig } from '@config';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, delay, map, retryWhen, take } from 'rxjs/operators';
import { HttpCustom } from './http-custom';
import { PopupService } from './popup/popup.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = new BehaviorSubject<boolean>(false);

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
  });

  constructor(
    private http: HttpCustom,
    private router: Router,
    private config: AppConfig,
    private cookieService: CookieService,
    private popupService: PopupService
  ) {}

  // getSelf() {
  //   let headers = this.headers;
  //   if (this.cookieService.get('access-token')) {
  //     headers = headers.set(
  //       'access-token',
  //       this.cookieService.get('access-token')
  //     );
  //   }

  //   this.http
  //     .get(this.apiUrl + '/self', { headers: headers })
  //     .subscribe((response: any) => {
  //       this.isLoggedIn.next(true);
  //     });
  // }

  login(data) {
    return this.http.post('/users/login', data);
  }

  logout() {
    let headers = this.headers;
    if (this.cookieService.get('access-token')) {
      headers = headers.set(
        'access-token',
        this.cookieService.get('access-token')
      );
    }

    // return of(true);
    return this.http.get('/users/logout');
  }
}
