import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/auth.guard';

// นำเข้า Components ที่ต้องใช้
import { PreRegisterComponents } from '../pages/register/register.component';
import { ErrorPageComponent } from '../pages/errorPage/errorPage.component';

// กำหนดเส้นทางในรูปแบบคงที่เพื่อให้ง่ายต่อการบำรุงรักษา
const appRoutes: Routes = [
  {
    path: '', // เส้นทางเริ่มต้น (Home route)
    component: PreRegisterComponents,
    pathMatch: 'full',
  },
  {
    path: 'error', // เส้นทางสำหรับแสดงหน้า Error Page
    component: ErrorPageComponent,
  },
  {
    path: '**', // เส้นทาง fallback สำหรับเส้นทางที่ไม่ได้กำหนดไว้
    redirectTo: '/error', // เปลี่ยนเส้นทางไปยังหน้า Error Page เมื่อเส้นทางไม่ถูกต้อง
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)], // ใช้ RouterModule เพื่อกำหนดเส้นทางหลักของแอปพลิเคชัน
  exports: [RouterModule], // ทำให้ RouterModule พร้อมใช้งานในส่วนอื่น ๆ ของแอปพลิเคชัน
})
export class AppRoutingModule {}
