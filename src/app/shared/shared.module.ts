import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DigitOnlyDirective } from './directives/digit-only.directive';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { QRCodeModule } from 'angularx-qrcode';
import { ModalModule } from 'ngx-bootstrap/modal';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  declarations: [
    DigitOnlyDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    InfiniteScrollModule,
    TranslateModule,
    QRCodeModule,
    ModalModule.forRoot()
  ],
  exports: [
    PerfectScrollbarModule,
    InfiniteScrollModule,
    TranslateModule,
    QRCodeModule,
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
