import { Injectable } from '@angular/core';
import { AppConfig } from '@config';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor(
    private cookieService: CookieService,
    private config: AppConfig
  ) {}

  isMobile() {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      return true;
    } else {
      return false;
    }
  }

  clearToken(token: string): void {
    const hostname = window.location.hostname.split('.');
    const pathname = window.location.pathname.split('/').slice(1);

    /* current domain */
    this.cookieService.delete(token, '/', hostname.join('.'));
    this.cookieService.delete(token, '/', '.' + hostname.join('.'));

    /* config domain */
    this.cookieService.delete(
      token,
      '/',
      this.config.getConfig('webDomain') as string
    );
    this.cookieService.delete(
      token,
      '/',
      '.' + this.config.getConfig('webDomain')
    );
    for (let i = 1; i <= hostname.length; i++) {
      /* subdomain */
      this.cookieService.delete(token, '/', hostname.slice(i).join('.'));
      this.cookieService.delete(token, '/', '.' + hostname.slice(i).join('.'));

      for (let j = 0; j < pathname.length; j++) {
        /* current path */
        this.cookieService.delete(
          token,
          '/' + pathname.slice(j).join('/'),
          hostname.slice(i).join('.')
        );
        this.cookieService.delete(
          token,
          '/' + pathname.slice(j).join('/'),
          '.' + hostname.slice(i).join('.')
        );

        this.cookieService.delete(
          token,
          '/' + pathname.reverse().slice(j).reverse().join('/'),
          hostname.slice(i).join('.')
        );
        this.cookieService.delete(
          token,
          '/' + pathname.reverse().slice(j).reverse().join('/'),
          '.' + hostname.slice(i).join('.')
        );
      }
    }
  }
}
