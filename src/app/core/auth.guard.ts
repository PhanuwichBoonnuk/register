import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { HttpCustom } from './http-custom';
import { PopupService } from './popup/popup.service';
import { AuthState } from './store/auth/auth.reducer';
import { scopesSelector } from './store/auth/auth.selector';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private http: HttpCustom,
    private cookieService: CookieService,
    private popupService: PopupService,
    private authStore: Store<AuthState>
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    let routeScopes = route.data.scopes;

    if (this.cookieService.get('access-token')) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }

    if (routeScopes) {
      return this.authStore.select(scopesSelector).pipe(
        filter((scopes) => (scopes ? true : false)),
        take(1),
        map((scopes) => {
          /* have scope and access token */
          for (let scope of scopes) {
            if (
              routeScopes.indexOf(scope) > -1 &&
              this.cookieService.get('access-token')
            ) {
              return true;
            }
          }

          /* not have scope but have access token */
          if (this.cookieService.get('access-token')) {
            this.router.navigate(['/']);
            return false;
          }

          /* no access token */
          this.popupService.openModal({
            type: 'notifications',
            header: 'Unsuccess',
            content: 'Please login again.',
          });
          this.router.navigate(['/login']);
          return false;
        })
      );
    } else {
      if (this.cookieService.get('access-token')) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    }
  }
}
