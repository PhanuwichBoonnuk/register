import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/auth.guard';

// Import Components
import { MyQrComponent } from '../my-locker/components/my-qr/my-qr.component';
import { MyLockerComponent } from '../my-locker/my-locker.component';
import { PreRegisterComponents } from '../pages/preRegister/pre-register.component';
// Define routes in a separate constant for easier maintenance
const appRoutes: Routes = [
  // Login route
  {
    path: 'login',
    component: PreRegisterComponents,
  },
  // My Locker route with child route and AuthGuard
  {
    path: 'my-locker',
    component: MyLockerComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'qr', component: MyQrComponent },
    ],
  },
  // Lazy-loaded Admin module with AuthGuard
  {
    path: 'admin',
    loadChildren: () =>
      import('../admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuard],
  },
  // Default route
  {
    path: '',
    redirectTo: 'my-locker',
    pathMatch: 'full',
  },
  // Fallback route for undefined paths
  {
    path: '**',
    redirectTo: 'my-locker',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

