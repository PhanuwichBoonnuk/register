import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/auth.guard';

// นำเข้า Components ที่ต้องใช้
import { PreRegisterComponents } from '../pages/register/register.component';

// กำหนดเส้นทางในรูปแบบคงที่เพื่อให้ง่ายต่อการบำรุงรักษา
const appRoutes: Routes = [
  // เส้นทางสำหรับ Login ที่ใช้ AuthGuard ตรวจสอบ
  {
    path: 'register',
    component: PreRegisterComponents,
    canActivate: [AuthGuard],  // ใช้ middleware (AuthGuard) ในการตรวจสอบก่อนเข้าถึง
  },
  // เส้นทางเริ่มต้น (Home route)
  {
    path: '',
    component: PreRegisterComponents, // หรือสามารถเปลี่ยนไปใช้ component อื่นตามที่ต้องการ
    pathMatch: 'full',
  },
  // เส้นทาง fallback สำหรับเส้นทางที่ไม่ได้กำหนดไว้
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full', // หากเส้นทางไม่ถูกต้อง ให้เปลี่ยนเส้นทางกลับไปที่หน้าแรก
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
