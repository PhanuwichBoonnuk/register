import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './router/app-routing.module';
import { AppComponent } from './app.component';
import {
TranslateCompiler,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { AppConfig, loadConfiguration } from './app.config';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
// ! CAPTCHA
import { RecaptchaModule } from 'ng-recaptcha';

// ! BLOCK UI
import { BloclUIComponents } from './layout/block-ui/block-ui.component';
// ! FOOTER
import { footerReducer } from './layout/footer/footer.reducer';
import { footerComponents } from './layout/footer/footer.component';
// ! COMPONENT PAGE
import { NavbarComponents } from './layout/navbar/navbar.component';
import { PreRegisterComponents } from './pages/register/register.component';
import { CaptchaComponent } from './layout/captcha/captcha.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponents,
    footerComponents,
    PreRegisterComponents,
    BloclUIComponents,
    CaptchaComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageFormatCompiler,
      },
    }),
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    CoreModule.forRoot(),
    SharedModule.forRoot(),
    RxReactiveFormsModule,
    StoreModule.forRoot({ footer: footerReducer }),
    RecaptchaModule
  ],
  providers: [
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfiguration,
      deps: [AppConfig],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient) {
  let resources = [
    {
      prefix: './assets/locales/',
      suffix: '.json?date=' + new Date().toISOString(),
    },
  ];
  resources.push({
    prefix: './config/locales/',
    suffix: '.json?date=' + new Date().toISOString(),
  });
  return new MultiTranslateHttpLoader(http, resources);
}
