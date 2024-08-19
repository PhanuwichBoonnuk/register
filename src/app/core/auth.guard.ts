import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { PopupService } from './popup/popup.service';
import { AuthState } from './store/auth/auth.reducer';
import { scopesSelector } from './store/auth/auth.selector';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private cookieService: CookieService,
    private popupService: PopupService,
    private authStore: Store<AuthState>
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    const routeScopes = route.data.scopes;
    const accessToken = this.cookieService.get('access-token');

    // ตรวจสอบว่ามี access token หรือไม่
    if (!accessToken) {
      this.popupService.openModal({
        type: 'notifications',
        header: 'Unsuccess',
        content: 'Please login again.',
      });
      this.router.navigate(['/login']);
      return false;
    }

    // ถ้าไม่มี scope ที่ระบุใน route ให้อนุญาตการเข้าถึงได้ทันที
    if (!routeScopes) {
      return true;
    }

    // ตรวจสอบ scope ของผู้ใช้
    return this.authStore.select(scopesSelector).pipe(
      filter(scopes => !!scopes),
      take(1),
      map(scopes => {
        const hasScope = scopes.some(scope => routeScopes.includes(scope));
        if (hasScope) {
          return true;
        } else {
          this.router.navigate(['/']);
          return false;
        }
      })
    );
  }
}
