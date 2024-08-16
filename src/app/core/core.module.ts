import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { AuthGuard } from './auth.guard';
import { HttpCustom } from './http-custom';
import { PopupComponent } from './popup/popup.component';
import { SharedModule } from '@shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromAuth from '@core/store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { PopupService } from './popup/popup.service';

@NgModule({
  declarations: [PopupComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    SharedModule.forRoot(),
    StoreModule.forFeature('auth', fromAuth.reducer),
    EffectsModule.forFeature([AuthEffects]),
  ],
  exports: [PopupComponent],
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [CookieService, PopupService, AuthGuard, HttpCustom],
    };
  }
}
