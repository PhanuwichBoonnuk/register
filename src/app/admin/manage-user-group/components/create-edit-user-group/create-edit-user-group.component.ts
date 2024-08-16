import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupService } from '@core/popup/popup.service';
import { userSelector } from '@core/store/auth/auth.selector';
import { TranslateService } from '@ngx-translate/core';
import { LocationService } from '@shared/service/location.service';
import { UserGroupService } from '@shared/service/user-group.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-create-edit-user-group',
  templateUrl: './create-edit-user-group.component.html',
  styleUrls: ['./create-edit-user-group.component.scss'],
})
export class CreateEditUserGroupComponent implements OnInit {
  userGroupId;
  userGroupForm: FormGroup;

  users: any = [];
  selectedUsers: any = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private userGroupService: UserGroupService,
    private popupService: PopupService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.userGroupForm = this.formBuilder.group({
      name: ['', Validators.required],
      lockerLimit: [1, Validators.required],
      users: [''],
    });

    this.userGroupId = this.route.snapshot.paramMap.get('userGroupId');

    if (this.userGroupId) {
      this.userGroupService.getUserGroupById(this.userGroupId).subscribe(
        (response: any) => {
          this.userGroupForm.patchValue(response.group);
          this.users = response.group.users;
          this.users = this.users.map((user: any) => {
            return { ...user, id: user.userId };
          });
        },
        (error) => {}
      );
    }
  }

  create() {
    Object.keys(this.userGroupForm.controls).map((key) => {
      this.userGroupForm.get(key).markAsTouched();
    });
    if (this.userGroupForm.invalid) {
      return;
    }

    const users = this.users.map((user) => user.id);

    this.userGroupService
      .createUserGroup({ ...this.userGroupForm.value, users: users })
      .subscribe(
        (response) => {
          this.popupService.openModal({
            type: 'notification',
            class: 'success',
            header: 'User Group Created',
            content: this.name.value + ' was created.',
          });
          this.cancel();
        },
        (error) => {
          this.popupService.openModal({
            type: 'notification',
            class: 'danger',
            header: this.translateService.instant('modal.fail'),
            content: error.error.info,
          });
        }
      );
  }

  update() {
    Object.keys(this.userGroupForm.controls).map((key) => {
      this.userGroupForm.get(key).markAsTouched();
    });
    if (this.userGroupForm.invalid) {
      return;
    }

    const users = this.users.map((user) => user.id);

    this.userGroupService
      .updateUserGroup(this.userGroupId, {
        ...this.userGroupForm.value,
        users: users,
      })
      .subscribe(
        (response) => {
          this.popupService.openModal({
            type: 'notification',
            class: 'success',
            header: 'User Group Updated',
            content: this.name.value + ' was updated.',
          });
          this.cancel();
        },
        (error) => {
          this.popupService.openModal({
            type: 'notification',
            class: 'danger',
            header: this.translateService.instant('modal.fail'),
            content: error.error.info,
          });
        }
      );
  }

  cancel() {
    this.router.navigate(['.'], { relativeTo: this.route.parent });
  }

  addUser(user) {
    if (!_.find(this.users, { id: user.id })) {
      /* check user exists */
      this.users.push(user);
    }
  }

  /* User Selection */
  selectAllUsers() {
    if (!this.isSelectedAllUsers()) {
      this.selectedUsers = this.users.map((user) => user.id);
    } else {
      this.selectedUsers = [];
    }
  }
  isSelectedAllUsers() {
    return (
      this.selectedUsers.length === this.users.length && this.users.length > 0
    );
  }
  isSelectedSomeUser() {
    return (
      this.selectedUsers.length > 0 &&
      this.selectedUsers.length < this.users.length
    );
  }
  addSelectedUser(userId: string) {
    if (this.selectedUsers.indexOf(userId) === -1) {
      this.selectedUsers.push(userId);
    } else {
      this.selectedUsers.splice(this.selectedUsers.indexOf(userId), 1);
    }
  }
  isSelectedUser(userId: string) {
    return this.selectedUsers.indexOf(userId) === -1 ? false : true;
  }

  deleteSelectedUser() {
    this.users = this.users.filter((user) =>
      this.selectedUsers.indexOf(user.id) === -1 ? true : false
    );
    this.selectedUsers = [];
  }

  get name() {
    return this.userGroupForm.get('name');
  }

  get lockerLimit() {
    return this.userGroupForm.get('lockerLimit');
  }
}
