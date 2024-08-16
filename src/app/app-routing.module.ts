import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/auth.guard';
import { LoginComponent } from './login/login.component';
import { MyQrComponent } from './my-locker/components/my-qr/my-qr.component';
import { MyLockerComponent } from './my-locker/my-locker.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'my-locker',
    component: MyLockerComponent,
    canActivate: [AuthGuard],
    children: [{ path: 'qr', component: MyQrComponent }],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: 'my-locker',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
