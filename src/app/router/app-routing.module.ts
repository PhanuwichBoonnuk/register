import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/auth.guard';

// นำเข้า Components ที่ต้องใช้
import { PreRegisterComponents } from '../pages/register/register.component';
import { ErrorPageComponent } from '../pages/errorPage/errorPage.component';

// กำหนดเส้นทางในรูปแบบคงที่เพื่อให้ง่ายต่อการบำรุงรักษา
const appRoutes: Routes = [
  {
    path: 'register',
    component: PreRegisterComponents,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    component: PreRegisterComponents,
    pathMatch: 'full',
  },
  {
    path: 'error',
    component: ErrorPageComponent,
  },
  {
    path: '**',
    redirectTo: '/error',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
