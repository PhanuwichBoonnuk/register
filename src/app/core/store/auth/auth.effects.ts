import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthState } from './auth.reducer';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  AuthActionTypes,
  Login,
  Logout,
  LoadAuthFail,
  UpdateReturnUrl,
} from './auth.actions';
import { HttpCustom } from '../../http-custom';
import {
  mergeMap,
  map,
  catchError,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { timer, of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '@core/auth.service';
import { AppConfig } from '@config';
import { UtilService } from '@shared/service/util.service';

@Injectable()
export class AuthEffects {
  constructor(
    private router: Router,
    private actions$: Actions,
    private http: HttpCustom,
    private cookieService: CookieService,
    private store: Store<AuthState>,
    private location: Location,
    private authService: AuthService,
    private config: AppConfig,
    private utilService: UtilService
  ) {}

  @Effect()
  // loginEffect$ = this.actions$.pipe(
  //   ofType(AuthActionTypes.Login),
  //   switchMap((action) =>
  //     timer(0, 60000).pipe(
  //       takeUntil(this.actions$.pipe(ofType(AuthActionTypes.Logout)))
  //     )
  //   )
  // );
  @Effect({ dispatch: false })
  LoadAuthFailEffect$ = this.actions$.pipe(
    ofType(AuthActionTypes.LoadAuthFail),
    map((action) => {
      this.router.navigate(['login']);
    })
  );

  @Effect({ dispatch: false })
  logoutEffect$ = this.actions$.pipe(
    ofType(AuthActionTypes.Logout),
    map((action) => {
      this.utilService.clearToken('access-token');
      this.utilService.clearToken('acl-token');
      
      this.cookieService.set('check-sso', 'true');
      if (this.config.getConfig('logoutReturnUrl')) {
        window.location.href = this.config.getConfig('logoutReturnUrl');
      }
      this.router.navigate(['login']);
    })
  );

  @Effect({ dispatch: false })
  tokenExpiredEffect$ = this.actions$.pipe(
    ofType(AuthActionTypes.TokenExpired),
    map((action) => {
      const redirectUrl = this.location.path();
      if (redirectUrl !== '/login') {
        this.store.dispatch(new UpdateReturnUrl(redirectUrl));
      }
      this.router.navigate(['login']);
    })
  );

  @Effect()
  loadEffect$ = this.actions$.pipe(
    ofType(AuthActionTypes.LoadAuths),
    mergeMap((action) =>
      this.http.get('/self').pipe(
        map((data) => {
          return new Login(data['profile'], data['lockerScopes']);
        }),
        catchError((err) => {
          return of(new LoadAuthFail());
        })
      )
    )
  );
}
