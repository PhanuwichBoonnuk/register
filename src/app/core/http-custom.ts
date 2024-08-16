import { Injectable } from '@angular/core';
import { AppConfig } from '../app.config';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { PopupService } from './popup/popup.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthState } from './store/auth/auth.reducer';
import { Store } from '@ngrx/store';
import { Logout } from './store/auth/auth.actions';

@Injectable()
export class HttpCustom {
  private accessToken: string;
  private urlPrefix: string;
  private urlPrefixData: string;
  private defaultCatchError = (error) => {
    if (error.error.status === 401) {
      this.authStore.dispatch(new Logout());
    }

    this.popupService.openModal({
      type: 'notification',
      class: 'danger',
      header: this.translateService.instant('modal.fail'),
      content: error.error.message,
    });
    throw error;
  };

  constructor(
    private config: AppConfig,
    private popupService: PopupService,
    private translateService: TranslateService,
    private cookieService: CookieService,
    private http: HttpClient,
    private authStore: Store<AuthState>
  ) {
    this.config
      .getLoadedConfig()
      .pipe(filter((result) => (result ? true : false)))
      .subscribe((result) => {
        this.urlPrefix = this.config.getConfig('apiUrl');
        this.urlPrefixData = this.config.getConfig('apiUrlData');
      });
  }

  createAuthorizationHeader() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
      service: 'locker',
    });
    if (this.cookieService.get('access-token')) {
      headers = headers.set(
        'access-token',
        this.cookieService.get('access-token')
      );
    }
    return headers;
  }

  get(url: string) {
    const headers = this.createAuthorizationHeader();
    return this.config.getLoadedConfig().pipe(
      take(1),
      map((result) => {
        return result;
      }),
      switchMap((result) =>
        this.http
          .get(this.urlPrefix + url, {
            headers: headers,
          })
          .pipe(catchError(this.defaultCatchError))
      )
    );
  }

  getData(url: string) {
    const headers = this.createAuthorizationHeader();
    return this.config.getLoadedConfig().pipe(
      take(1),
      map((result) => result),
      switchMap((result) =>
        this.http.get(this.urlPrefixData + url, {
          headers: headers
        })
          .pipe(catchError(this.defaultCatchError))
      )
    )
  }

  delete(url: string) {
    const headers = this.createAuthorizationHeader();
    return this.config.getLoadedConfig().pipe(
      take(1),
      switchMap((result) =>
        this.http
          .delete(this.urlPrefix + url, {
            headers: headers,
          })
          .pipe(catchError(this.defaultCatchError))
      )
    );
  }

  post(url: string, data: Object) {
    const headers = this.createAuthorizationHeader();
    return this.config.getLoadedConfig().pipe(
      take(1),
      switchMap((result) =>
        this.http
          .post(this.urlPrefix + url, data, {
            headers: headers,
          })
          .pipe(catchError(this.defaultCatchError))
      )
    );
  }

  postData(url: string, data: Object) {
    const headers = this.createAuthorizationHeader();
    return this.config.getLoadedConfig().pipe(
      take(1),
      map((result) => result),
      switchMap((result) =>
        this.http.post(this.urlPrefixData + url, data, {
          headers: headers
        })
          .pipe(catchError(this.defaultCatchError))
      )
    )
  }

  postFull(url: string, data: Object) {
    const headers = this.createAuthorizationHeader();
    return this.config.getLoadedConfig().pipe(
      take(1),
      switchMap((result) =>
        this.http
          .post(this.urlPrefix + url, data, {
            headers: headers,
            observe: 'response',
          })
          .pipe(catchError(this.defaultCatchError))
      )
    );
  }

  put(url: string, data: Object) {
    const headers = this.createAuthorizationHeader();
    return this.config.getLoadedConfig().pipe(
      take(1),
      switchMap((result) =>
        this.http
          .put(this.urlPrefix + url, data, {
            headers: headers,
          })
          .pipe(catchError(this.defaultCatchError))
      )
    );
  }

  putFull(url: string, data: Object) {
    const headers = this.createAuthorizationHeader();
    return this.config.getLoadedConfig().pipe(
      take(1),
      switchMap((result) =>
        this.http
          .put(this.urlPrefix + url, data, {
            headers: headers,
            observe: 'response',
          })
          .pipe(catchError(this.defaultCatchError))
      )
    );
  }

  upload(url: string, file: File) {
    const form: FormData = new FormData();
    form.append('file', file);
    const headers = new HttpHeaders({
      'access-token': this.cookieService.get('access-token'),
    });
    const req = new HttpRequest('POST', this.urlPrefix + url, form, {
      reportProgress: true,
      headers: headers,
    });
    return this.config.getLoadedConfig().pipe(
      take(1),
      switchMap((result) =>
        this.http.request(req).pipe(catchError(this.defaultCatchError))
      )
    );
  }

  uploadData(url: string, file: File) {
    const form: FormData = new FormData();
    form.append('file', file);
    const headers = new HttpHeaders({
      'access-token': this.cookieService.get('access-token'),
    });
    const req = new HttpRequest('POST', this.urlPrefixData + url, form, {
      reportProgress: true,
      headers: headers,
    });
    return this.config.getLoadedConfig().pipe(
      take(1),
      switchMap((result) =>
        this.http.request(req).pipe(catchError(this.defaultCatchError))
      )
    );
  }

  importLocker(url: string, file) {
    let form: FormData = new FormData();
    form.append('csvFile', file);
    
    const headers = new HttpHeaders({
      'access-token': this.cookieService.get('access-token'),
    });

    return this.config.getLoadedConfig().pipe(
      switchMap((result) => {
        return this.http.post(`${this.urlPrefix}${url}`, form, { headers })
      })
    );
  }

  download(url: string) {
    const headers = this.createAuthorizationHeader();
    return this.config.getLoadedConfig().pipe(
      take(1),
      switchMap((result) =>
        this.http
          .get(this.urlPrefix + url, {
            headers: headers,
            responseType: 'blob',
          })
          .pipe(catchError(this.defaultCatchError))
      )
    );
  }

  downloadData(url: string) {
    const headers = this.createAuthorizationHeader();
    return this.config.getLoadedConfig().pipe(
      take(1),
      switchMap((result) =>
        this.http
          .get(this.urlPrefixData + url, {
            headers: headers,
            responseType: 'blob',
          })
          .pipe(catchError(this.defaultCatchError))
      )
    );
  }


  downloadPost(url: string, data) {
    const headers = this.createAuthorizationHeader();
    return this.config.getLoadedConfig().pipe(
      take(1),
      switchMap((result) =>
        this.http
          .post(this.urlPrefix + url, data, {
            headers: headers,
            responseType: 'blob',
          })
          .pipe(catchError(this.defaultCatchError))
      )
    );
  }
}
