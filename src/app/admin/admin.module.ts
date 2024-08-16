import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { TransactionComponent } from './transaction/transaction.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ManageLockerComponent } from './manage-locker/manage-locker.component';
import { CreateEditLockerComponent } from './manage-locker/components/create-edit-locker/create-edit-locker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateLockerTypeComponent } from './manage-locker/components/update-locker-type/update-locker-type.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ManageLockerGroupComponent } from './manage-locker-group/manage-locker-group.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ManageUserGroupComponent } from './manage-user-group/manage-user-group.component';
import { ServerSettingComponent } from './server-setting/server-setting.component';
import { CreateEditLockerGroupComponent } from './manage-locker-group/components/create-edit-locker-group/create-edit-locker-group.component';
import { AddLockerComponent } from './manage-locker-group/components/add-locker/add-locker.component';
import { CreateEditUserGroupComponent } from './manage-user-group/components/create-edit-user-group/create-edit-user-group.component';
import { CreateEditUserComponent } from './manage-user/components/create-edit-user/create-edit-user.component';
import { AddLockerGroupComponent } from './manage-user-group/components/add-locker-group/add-locker-group.component';
import { PanelSettingComponent } from './manage-panel/components/panel-setting/panel-setting.component';
import { ChangePasswordComponent } from './manage-user/components/change-password/change-password.component';
import { CreateEditPanelComponent } from './manage-panel/components/create-edit-panel/create-edit-panel.component';
import { ManagePanelComponent } from './manage-panel/manage-panel.component';
import { LocationSettingComponent } from './server-setting/components/location-setting/location-setting.component';
import { HolidaySettingComponent } from './server-setting/components/holiday-setting/holiday-setting.component';
import { SetOpenTimeComponent } from './manage-locker-group/components/set-open-time/set-open-time.component';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { ManageCardComponent } from './manage-card/manage-card.component';
import { ManageBanComponent } from './manage-ban/manage-ban.component';
import { CreateEditCardComponent } from './manage-card/components/create-edit-card/create-edit-card.component';
import { BanUserComponent } from './manage-ban/components/ban-user/ban-user.component';
import { LockerReportComponent } from './locker-report/locker-report.component';
import { PeopleReportComponent } from './people-report/people-report.component';
import { SendEmailToAdminComponent } from './server-setting/components/send-email-to-admin/send-email-to-admin.component';
import { SetOpenAutoReleaseComponent } from './manage-locker-group/components/set-open-release/set-open-release.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';


@NgModule({
  declarations: [
    TransactionComponent,
    ManageLockerComponent,
    CreateEditLockerComponent,
    UpdateLockerTypeComponent,
    ManageLockerGroupComponent,
    ManageUserComponent,
    ManageUserGroupComponent,
    ServerSettingComponent,
    CreateEditLockerGroupComponent,
    AddLockerComponent,
    CreateEditUserGroupComponent,
    CreateEditUserComponent,
    AddLockerGroupComponent,
    PanelSettingComponent,
    ChangePasswordComponent,
    CreateEditPanelComponent,
    ManagePanelComponent,
    LocationSettingComponent,
    HolidaySettingComponent,
    SetOpenTimeComponent,
    ManageCardComponent,
    ManageBanComponent,
    CreateEditCardComponent,
    BanUserComponent,
    LockerReportComponent,
    PeopleReportComponent,
    SendEmailToAdminComponent,
    SetOpenAutoReleaseComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    SharedModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    TimepickerModule.forRoot(),
    TooltipModule.forRoot()
  ],
})
export class AdminModule {}
