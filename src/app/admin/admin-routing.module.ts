import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/auth.guard';
import { create } from 'lodash';
import { TransactionComponent } from './transaction/transaction.component';
import { AddLockerComponent } from './manage-locker-group/components/add-locker/add-locker.component';
import { CreateEditLockerGroupComponent } from './manage-locker-group/components/create-edit-locker-group/create-edit-locker-group.component';
import { ManageLockerGroupComponent } from './manage-locker-group/manage-locker-group.component';
import { CreateEditLockerComponent } from './manage-locker/components/create-edit-locker/create-edit-locker.component';
import { UpdateLockerTypeComponent } from './manage-locker/components/update-locker-type/update-locker-type.component';
import { ManageLockerComponent } from './manage-locker/manage-locker.component';
import { AddLockerGroupComponent } from './manage-user-group/components/add-locker-group/add-locker-group.component';
import { CreateEditUserGroupComponent } from './manage-user-group/components/create-edit-user-group/create-edit-user-group.component';
import { ManageUserGroupComponent } from './manage-user-group/manage-user-group.component';
import { CreateEditUserComponent } from './manage-user/components/create-edit-user/create-edit-user.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ServerSettingComponent } from './server-setting/server-setting.component';
import { PanelSettingComponent } from './manage-panel/components/panel-setting/panel-setting.component';
import { ChangePasswordComponent } from './manage-user/components/change-password/change-password.component';
import { CreateEditPanelComponent } from './manage-panel/components/create-edit-panel/create-edit-panel.component';
import { ManagePanelComponent } from './manage-panel/manage-panel.component';
import { SetOpenTimeComponent } from './manage-locker-group/components/set-open-time/set-open-time.component';
import { ManageCardComponent } from './manage-card/manage-card.component';
import { CreateEditCardComponent } from './manage-card/components/create-edit-card/create-edit-card.component';
import { ManageBanComponent } from './manage-ban/manage-ban.component';
import { BanUserComponent } from './manage-ban/components/ban-user/ban-user.component';
import { LockerReportComponent } from './locker-report/locker-report.component';
import { PeopleReportComponent } from './people-report/people-report.component';
import { SetOpenAutoReleaseComponent } from './manage-locker-group/components/set-open-release/set-open-release.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'manage-locker',
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'transaction',
    component: TransactionComponent,
    canActivate: [AuthGuard],
    data: { scopes: ['actions.readWrite', 'actions.full'] },
  },
  {
    path: 'manage-locker',
    component: ManageLockerComponent,
    canActivate: [AuthGuard],
    data: { scopes: ['lockers.readWrite', 'lockers.full'] },
    children: [
      {
        path: 'create',
        component: CreateEditLockerComponent,
        data: { scopes: ['lockers.readWrite', 'lockers.full'] },
      },
      {
        path: 'update/:lockerId',
        component: CreateEditLockerComponent,
        data: { scopes: ['lockers.readWrite', 'lockers.full'] },
      },
      {
        path: 'type',
        component: UpdateLockerTypeComponent,
        data: { scopes: ['lockers.readWrite', 'lockers.full'] },
      },
    ],
  },
  {
    path: 'manage-locker-group',
    component: ManageLockerGroupComponent,
    canActivate: [AuthGuard],
    data: {
      scopes: ['lockergroups.readWrite', 'lockergroups.full'],
    },
    children: [
      {
        path: 'create',
        component: CreateEditLockerGroupComponent,
        data: { scopes: ['lockergroups.full'] },
      },
      {
        path: 'update/:lockerGroupId',
        component: CreateEditLockerGroupComponent,
        data: { scopes: ['lockergroups.full'] },
      },
      {
        path: 'add/:lockerGroupId',
        component: AddLockerComponent,
        data: { scopes: ['lockergroups.full'] },
      },
      {
        path: 'open/:lockerGroupId',
        component: SetOpenTimeComponent,
        data: { scopes: ['lockergroups.full'] },
      },
      {
        path: 'openRelease/:lockerGroupId',
        component: SetOpenAutoReleaseComponent,
        data: { scopes: ['lockergroups.full'] },
      }
    ],
  },
  {
    path: 'manage-user',
    component: ManageUserComponent,
    canActivate: [AuthGuard],
    data: { scopes: ['users.readWrite', 'users.full'] },
    children: [
      {
        path: 'change-password/:userId',
        component: ChangePasswordComponent,
        data: { scopes: ['users.readWrite', 'users.full'] },
      },
      {
        path: ':type',
        component: CreateEditUserComponent,
        data: { scopes: ['users.readWrite', 'users.full'] },
      },
      {
        path: ':type/:userId',
        component: CreateEditUserComponent,
        data: { scopes: ['users.readWrite', 'users.full'] },
      },
    ],
  },
  {
    path: 'manage-user-group',
    component: ManageUserGroupComponent,
    canActivate: [AuthGuard],
    data: {
      scopes: ['usergroups.readWrite', 'usergroups.full'],
    },
    children: [
      {
        path: 'create',
        component: CreateEditUserGroupComponent,
        data: { scopes: ['usergroups.readWrite', 'usergroups.full'] },
      },
      {
        path: 'update/:userGroupId',
        component: CreateEditUserGroupComponent,
        data: { scopes: ['usergroups.readWrite', 'usergroups.full'] },
      },
      {
        path: 'add/:userGroupId',
        component: AddLockerGroupComponent,
        data: { scopes: ['usergroups.readWrite', 'usergroups.full'] },
      },
    ],
  },
  {
    path: 'manage-panel',
    component: ManagePanelComponent,
    canActivate: [AuthGuard],
    data: { scopes: ['panels.readWrite', 'panels.full'] },
    children: [
      {
        path: 'create',
        component: CreateEditPanelComponent,
        data: { scopes: ['panels.readWrite', 'panels.full'] },
      },
      {
        path: 'update/:panelId',
        component: CreateEditPanelComponent,
        data: { scopes: ['panels.readWrite', 'panels.full'] },
      },
      {
        path: 'setting',
        component: PanelSettingComponent,
        data: { scopes: ['panels.readWrite', 'panels.full'] },
      },
      {
        path: 'setting/:panelId',
        component: PanelSettingComponent,
        data: { scopes: ['panels.readWrite', 'panels.full'] },
      },
    ],
  },
  {
    path: 'manage-card',
    component: ManageCardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'create',
        component: CreateEditCardComponent,
      },
      {
        path: 'update/:cardId',
        component: CreateEditCardComponent,
      },
    ],
  },
  {
    path: 'manage-ban',
    component: ManageBanComponent,
    canActivate: [AuthGuard],
    children: [{ path: 'ban', component: BanUserComponent }],
  },
  {
    path: 'server-setting',
    component: ServerSettingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'locker-report',
    component: LockerReportComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'people-report',
    component: PeopleReportComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
