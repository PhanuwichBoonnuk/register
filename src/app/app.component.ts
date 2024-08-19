import {
  animate,
  keyframes,
  query,
  state,
  style,
  transition,
  trigger,
  useAnimation,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  ActivationStart,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterEvent,
  RouterOutlet,
} from '@angular/router';
import { AuthService } from '@core/auth.service';
import { PopupService } from '@core/popup/popup.service';
import { Login, Logout } from '@core/store/auth/auth.actions';
import { AuthState } from '@core/store/auth/auth.reducer';
import {
  scopeObjectSelector,
  userSelector,
} from '@core/store/auth/auth.selector';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { fadeAnimation } from '@shared/animations';
// import { UserService } from '@shared/service/user.service';
import { UtilService } from '@shared/service/util.service';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import * as dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/th';
import { Title } from '@angular/platform-browser';
import { AppConfig } from '@config';
import { HttpCustom } from '@core/http-custom';
import { APPVERSION } from '@environments/version';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// import { ConsentComponent } from '@shared/pdpa/consent/consent.component';
// import { TermOfServicesComponent } from '@shared/pdpa/term-of-services/term-of-services.component';
// import { PersonalInformationManagementComponent } from '@shared/pdpa/personal-information-management/personal-information-management.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('slide', [
      transition(':enter', [
        style({ 'margin-left': '-18rem' }),
        animate('.5s ease', style({ 'margin-left': '0rem' })),
      ]),
      transition(':leave', [
        animate('.5s ease', style({ 'margin-left': '-18rem' })),
      ]),
    ]),
    trigger('fade', [transition('* => *', [useAnimation(fadeAnimation)])]),
    trigger('popup', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate('.2s ease', keyframes([style({ opacity: 1 })])),
      ]),
      transition('* => void', [
        style({ opacity: 1 }),
        animate('.2s ease', keyframes([style({ opacity: 0 })])),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  lang: string;
  showLoading: boolean = true;
  isOpenPopup$: Observable<boolean>;
  popupData$: Observable<any>;
  openSidebar: boolean = false;
  openProfile: boolean = false;
  openChangePassword: boolean = false;
  /* PDPA Cookie Consent */
  openCookiesConsentBanner = false;
  openCookiesPreferenceModal = false;
  isCookieConsented: any;
  isNonNecessaryCookieConsented: any;

  profile$: Observable<any>;
  scopes$: Observable<any>;

  otherLinkUrl = this.config.getConfig('otherLinkUrl');
  otherLinkLabel = this.config.getConfig('otherLinkLabel');
  isDev = this.config.getConfig('isDev');
  enablePersonalManagement = this.config.getConfig('enablePersonalManagement');
  enableTermOfService = this.config.getConfig('enableTermOfService');
  enablePDPA = this.config.getConfig('enablePDPA');
  enableCard = this.config.getConfig('enableCard');
  version = APPVERSION;

  bsModalRef: BsModalRef;

  constructor(
    private http: HttpCustom,
    private config: AppConfig,
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private popupService: PopupService,
    private translateService: TranslateService,
    private authService: AuthService,
    // private userService: UserService,
    private cookieService: CookieService,
    private utilService: UtilService,
    private authStore: Store<AuthState>,
    private modalService: BsModalService,
  ) {
    this.titleService.setTitle(config.getConfig('title'));
    /* init translate */
    this.translateService.setDefaultLang('en');
    /* init dayjs locale */
    dayjs.locale('en');

    router.events.subscribe((event: RouterEvent) => {
      if (this.isMobile()) {
        this.openSidebar = false;
      }
      this.navigationInterceptor(event);
    });
  }

  ngOnInit() {
    this.lang = 'en';
    this.translateService.use(this.lang);

    dayjs.locale('en');

    this.isOpenPopup$ = this.popupService.isOpen;
    this.popupData$ = this.popupService.popupData;

    this.profile$ = this.authStore.select(userSelector);
    this.scopes$ = this.authStore.select(scopeObjectSelector);

    /* Handle One Time Token to auto-login and redirect to specific path from WorkplacePlus */
    this.router.events.subscribe((event) => {
      if (event instanceof ActivationStart) {
        const ott = event.snapshot.queryParams.ott;
        const path = event.snapshot.queryParams.path || '';
        if (ott) {
          this.http.post('/login/ott', { ott }).subscribe((response: any) => {
            this.cookieService.set(
              'access-token',
              response.mitToken,
              99999,
              '/',
              this.config.getConfig('webDomain')
            );
            this.router.navigate([path]);
          });
        }
      }
    });

    // if (this.cookieService.get('access-token')) {
    //   this.userService.getProfile().subscribe(
    //     (response: any) => {
    //       this.authStore.dispatch(
    //         new Login(response.profile, response.profile.lockerScopes)
    //       );
    //     },
    //     (error) => {}
    //   );
    // }

    // this.profile$.subscribe(auth => {
    //   if (this.enablePDPA && auth?.pdpaData?.acceptDataConsent === false) this.openCookieConsent();
    // });

    // if (this.enablePDPA) {
    //   this.checkCookieConsent();
    // }

  }

  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.showLoading = true;
    }
    if (event instanceof NavigationEnd) {
      this.showLoading = false;
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.showLoading = false;
    }
    if (event instanceof NavigationError) {
      this.showLoading = false;
    }
  }

  showNavBar() {
    if (this.router.url.indexOf('/login') === -1) {
      return true;
    } else {
      return false;
    }
  }

  hideSideBar() {
    return this.router.url.indexOf('/login') > -1;
  }

  changePassword() {
    this.openChangePassword = true;
  }

  logout() {
    this.authService.logout().subscribe(
      (res)=>{
        this.openSidebar = false;
        this.openProfile = false;
        this.authStore.dispatch(new Logout());
      }
      ,(error) => {
        console.error('Logout failed', error);
      }
    )



  }

  changeLanguage(language: string) {
    this.openProfile = false;
    this.lang = language;
    this.translateService.use(language);

    dayjs.locale(language);
  }

  checkCookieConsent() {
    this.isCookieConsented = this.cookieService.get('cookie_consent');

    if (!this.isCookieConsented) {
      this.openCookiesConsentBanner = true;
    } else {
      this.openCookiesConsentBanner = false;
    }
  }

  isMobile() {
    return this.utilService.isMobile();
  }

//   openCookieConsent() {
//     if (!this.bsModalRef) {
//       this.bsModalRef = this.modalService.show(ConsentComponent, {
//         keyboard: true,
//         backdrop: 'static'
//       })
//     }
//   }

//   openTermOfService() {
//     this.modalService.show(TermOfServicesComponent, {
//       keyboard: false,
//       backdrop: 'static',
//       class: 'modal-lg modal-dialog-centered modal-fullscreen-md-down'
//     })
//   }

//   openPeronalInformation() {
//     this.modalService.show(PersonalInformationManagementComponent, {
//       keyboard: false,
//       backdrop: 'static',
//       class: 'modal-xl modal-dialog-centered'
//     })
//   }

}
