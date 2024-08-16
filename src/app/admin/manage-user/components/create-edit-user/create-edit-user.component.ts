import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupService } from '@core/popup/popup.service';
import { TranslateService } from '@ngx-translate/core';
import { CustomValidators } from '@shared/custom.validators';
import { RoleService } from '@shared/service/role.service';
import { UserService } from '@shared/service/user.service';

@Component({
  selector: 'app-create-edit-user',
  templateUrl: './create-edit-user.component.html',
  styleUrls: ['./create-edit-user.component.scss'],
})
export class CreateEditUserComponent implements OnInit {
  userForm: FormGroup;
  userId;
  type;

  roles: any = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private popupService: PopupService,
    private userService: UserService,
    private roleService: RoleService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      imgUrl: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, CustomValidators.emailPattern]],
      initial: ['', Validators.required],
      password: [''],
      confirmPassword: [''],
      section: [''],
      division: [''],
      phone: [''],
      lockerRoles: [''],
      userGroups: [''],
    });

    this.userId = this.route.snapshot.paramMap.get('userId');
    this.type = this.route.snapshot.paramMap.get('type');

    /* set password validators */
    if (this.type === 'create') {
      this.userForm.controls['password'].setValidators([Validators.required]);
      this.userForm.controls['confirmPassword'].setValidators([
        Validators.required,
        CustomValidators.confirmPassword,
      ]);
    }

    /* get user detail */
    if (this.type !== 'create') {
      this.userService.getUserById(this.userId).subscribe(
        (response: any) => {
          this.userForm.patchValue(response.profile);
          this.lockerRoles.setValue(response.profile.lockerRoles[0]);
        },
        (error) => {}
      );

      this.roleService.getRoles().subscribe(
        (response: any) => {
          /* filter SuperAdmin */
          this.roles = response.roles.filter((role) => role.id !== '0');
        },
        (error) => {}
      );
    }
  }

  create() {
    Object.keys(this.userForm.controls).map((key) => {
      this.userForm.get(key).markAsTouched();
    });
    if (this.userForm.invalid) {
      return;
    }

    this.userService.createUser(this.userForm.value).subscribe(
      (response) => {
        this.popupService.openModal({
          type: 'notification',
          class: 'success',
          header: 'User Created',
          content: this.name.value + ' was created.',
        });
        this.cancel();
      },
      (error) => {
        this.popupService.openModal({
          type: 'notification',
          class: 'danger',
          header: this.translateService.instant('modal.fail'),
          content: error.error.message,
        });
      }
    );
  }

  update() {
    Object.keys(this.userForm.controls).map((key) => {
      this.userForm.get(key).markAsTouched();
    });
    if (this.userForm.invalid) {
      return;
    }

    this.userService
      .updateUser(this.userId, {
        ...this.userForm.value,
        lockerRoles: [this.lockerRoles.value],
      })
      .subscribe(
        (response) => {
          this.popupService.openModal({
            type: 'notification',
            class: 'success',
            header: 'User Updated',
            content: this.name.value + ' was updated.',
          });
          this.cancel();
        },
        (error) => {
          this.popupService.openModal({
            type: 'notification',
            class: 'danger',
            header: this.translateService.instant('modal.fail'),
            content: error.error.message,
          });
        }
      );
  }

  cancel() {
    this.router.navigate(['.'], { relativeTo: this.route.parent });
  }

  goToEdit() {
    this.type = 'update';
    this.router.navigate(['./update/' + this.userId], {
      relativeTo: this.route.parent,
    });
  }

  goToManageUserGroup() {
    this.router.navigate(['/admin/manage-user-group']);
  }

  setProfileImage(imageUrl) {
    this.imgUrl.setValue(imageUrl);
  }

  get imgUrl() {
    return this.userForm.get('imgUrl');
  }

  get name() {
    return this.userForm.get('name');
  }

  get email() {
    return this.userForm.get('email');
  }

  get initial() {
    return this.userForm.get('initial');
  }

  get password() {
    return this.userForm.get('password');
  }

  get confirmPassword() {
    return this.userForm.get('confirmPassword');
  }

  get section() {
    return this.userForm.get('section');
  }

  get division() {
    return this.userForm.get('division');
  }

  get phone() {
    return this.userForm.get('phone');
  }

  get userGroups() {
    return this.userForm.get('userGroups');
  }

  get lockerRoles() {
    return this.userForm.get('lockerRoles');
  }
}
