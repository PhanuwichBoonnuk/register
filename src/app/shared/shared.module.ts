import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { LoadingComponent } from './loading/loading.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TranslateModule } from '@ngx-translate/core';
// import { SuggestUserComponent } from './suggest-user/suggest-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SearchPipe } from './pipes/search.pipe';
import { FilterLocationPipe } from './pipes/filter-location.pipe';
import { SortByPipe } from './pipes/sort-by.pipe';
// import { ImageUploadComponent } from './image-upload/image-upload.component';
import { DigitOnlyDirective } from './directives/digit-only.directive';
import { ImageUrlPipe } from './pipes/image-url.pipe';
// import { SuggestContentComponent } from './suggest-content/suggest-content.component';
// import { SuggestUserTagComponent } from './suggest-user-tag/suggest-user-tag.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { QRCodeModule } from 'angularx-qrcode';
// import { ChangeMyPasswordComponent } from './change-my-password/change-my-password.component';
import { DateFormatPipe } from './pipes/date-format.pipe';
// import { CookiesPreferenceModalComponent } from './cookies-preference-modal/cookies-preference-modal.component';
// import { CookiesConsentBannerComponent } from './cookies-consent-banner/cookies-consent-banner.component';
// import { ConsentComponent } from './pdpa/consent/consent.component';
// import { TermOfServicesComponent } from './pdpa/term-of-services/term-of-services.component';
// import { PersonalInformationManagementComponent } from './pdpa/personal-information-management/personal-information-management.component';
import { ModalModule } from 'ngx-bootstrap/modal';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  declarations: [
    SearchPipe,
    FilterLocationPipe,
    SortByPipe,
    DigitOnlyDirective,
    ImageUrlPipe,
    DateFormatPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    InfiniteScrollModule,
    ClickOutsideModule,
    TranslateModule,
    QRCodeModule,
    ModalModule.forRoot()
  ],
  exports: [
    PerfectScrollbarModule,
    InfiniteScrollModule,
    ClickOutsideModule,
    TranslateModule,
    QRCodeModule,
    SearchPipe,
    FilterLocationPipe,
    SortByPipe,
    ImageUrlPipe,
    DateFormatPipe,
    DigitOnlyDirective,
    ModalModule,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
    };
  }
}
