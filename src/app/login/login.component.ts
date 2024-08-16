import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from '@config';
import { AuthService } from '@core/auth.service';
import { PopupService } from '@core/popup/popup.service';
import { Login } from '@core/store/auth/auth.actions';
import { AuthState } from '@core/store/auth/auth.reducer';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { of } from 'rxjs';
import { catchError, delay, retryWhen, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

declare let google: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  name = environment.name;
  version = environment.version;
  webDomain: string = this.config.getConfig('webDomain');
  ADSSOLogin: string = this.config.getConfig('ADSSOLogin');
  ADFSLogin: string = this.config.getConfig('ADFSLogin');
  GoogleLogin: string = this.config.getConfig('GoogleLogin');
  loginReturnUrl: string = this.config.getConfig('loginReturnUrl');
  returnUrl: string = '/';

  userForm: FormGroup;

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
  });

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private config: AppConfig,
    private popupService: PopupService,
    private translateService: TranslateService,
    private cookieService: CookieService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private authStore: Store<AuthState>
  ) {}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.returnUrl = this.route.snapshot.queryParams['return'] || '/';

    if (this.ADSSOLogin && !this.cookieService.get('check-sso')) {
      this.ssoLogin();
    } else {
      this.cookieService.delete('check-sso', '/', this.webDomain);
    }

    /* loadGoogleSDK */
    if (this.config.getConfig('GoogleLogin')) {
      this.loadGoogleSDK();
    }
  }

  login() {
    Object.keys(this.userForm.controls).map((key) => {
      this.userForm.get(key).markAsTouched();
    });
    if (this.userForm.invalid) {
      return;
    }

    this.authService.login(this.userForm.value).subscribe(
      (response: any) => {
        this.cookieService.set(
          'access-token',
          response.profile.accessToken,
          99999,
          '/',
          this.webDomain
        );
        this.authStore.dispatch(
          new Login(response.profile, response.profile.lockerScopes)
        );

        this.router.navigateByUrl(this.returnUrl);
      },
      (error) => {
        this.popupService.openModal({
          type: 'notification',
          class: 'danger',
          header: this.translateService.instant('modal.fail'),
          content: error.error.message.message,
        });
      }
    );
  }

  ssoLogin() {
    console.log('SSO: Loging in ...');
    this.http
      .get(
        this.ADSSOLogin +
          '/sso/?rand=' +
          new Date().toISOString() +
          (this.loginReturnUrl
            ? '&path=' +
              encodeURIComponent(this.config.getConfig('loginReturnUrl'))
            : ''),
        { withCredentials: true }
      )
      .pipe(
        retryWhen((error) => {
          console.log('SSO: retrying again');
          return error.pipe(delay(500), take(5));
        }),
        catchError((error) => {
          console.log('SSO: Error: ' + error);
          return of(error);
        })
      )
      .subscribe(
        (response: any) => {
          console.log('SSO: token was received');
          if (response.accessToken) {
            console.log('SSO: ...');
            this.cookieService.set(
              'access-token',
              response.accessToken,
              99999,
              '/',
              this.webDomain
            );
          }
          console.log('SSO: Loged on');
          this.router.navigateByUrl('/');
        },
        (error: any) => {
          console.error('SSO: An error occurred:', error);
        },
        () => {
          console.log('SSO: HTTP request completed.');
        }
      );
  }

  adfsLogin() {
    window.location.href =
      this.ADFSLogin +
      (this.loginReturnUrl
        ? '?path=' + encodeURIComponent(this.config.getConfig('loginReturnUrl'))
        : '');
  }

  loadGoogleSDK() {
    /* Add script to header */
    const script: any = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.getElementsByTagName('head')[0].appendChild(script);
    let locale = localStorage.getItem('language') || 'en';

    if (locale === 'th') locale = 'th-TH';
    if (locale === 'en') locale = 'en-US';

    /* initialize google after script is loaded */
    script.addEventListener('load', () => {
      /* initialize google login */
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: this.config.getConfig('GoogleLogin').toString(),
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      /* render google login button */
      // @ts-ignore
      google.accounts.id.renderButton(
        // @ts-ignore
        document.getElementById('googleLoginButton'),
        {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          logo_alignment: 'center',
          text: 'signin_with',
          width: document.getElementById('googleLoginButton').offsetWidth,
          locale: locale,
        }
      );
    });
  }

  async handleCredentialResponse(response: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
      service: 'locker',
    });

    this.http
      .post(
        this.config.getConfig('apiUrlData') + '/login/google/online',
        {
          idToken: response.credential,
        },
        { headers }
      )
      .subscribe(
        (response: any) => {
          this.cookieService.set(
            'access-token',
            response.accessToken,
            99999,
            '/',
            this.webDomain
          );

          this.authStore.dispatch(
            new Login(response.details, response.details.lockerScopes)
          );
          this.ngZone.run(() => {
            this.router.navigateByUrl(this.returnUrl);
          });
        },
        (error) => {
          this.popupService.openModal({
            type: 'notification',
            class: 'danger',
            header: this.translateService.instant('modal.fail'),
            content: error.info,
          });
        }
      );
  }

  openPopup() {
    this.popupService.openModal({});
  }

  get username() {
    return this.userForm.get('username');
  }

  get password() {
    return this.userForm.get('password');
  }
}
