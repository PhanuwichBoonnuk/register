import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from '@config';
import { PopupService } from '@core/popup/popup.service';
import { TranslateService } from '@ngx-translate/core';
import { CustomValidators } from '@shared/custom.validators';
import { UserService } from '@shared/service/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: FormGroup;
  userId;

  constructor(
    private config: AppConfig,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private popupService: PopupService,
    private userService: UserService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            this.config.getConfig('passwordRegex')
              ? this.config.getConfig('passwordRegex')
              : /(?=.{8,})(?=.*?[^\w\s])(?=.*?[0-9])(?=.*?[A-Z]).*?[a-z].*/
          ),
        ],
      ],
      confirmPassword: [
        '',
        [Validators.required, CustomValidators.confirmPassword()],
      ],
    });

    this.userId = this.route.snapshot.paramMap.get('userId');
  }

  change() {
    Object.keys(this.passwordForm.controls).map((key) => {
      this.passwordForm.get(key).markAsTouched();
    });
    if (this.passwordForm.invalid) {
      return;
    }

    this.userService
      .changePasswordByAdmin(this.userId, { newPassword: this.password.value })
      .subscribe(
        (response) => {
          this.popupService.openModal({
            type: 'notification',
            class: 'success',
            header: this.translateService.instant('modal.success'),
            content: 'Password Changed.',
          });
          this.cancel();
        },
        (error) => {}
      );
  }

  cancel() {
    this.router.navigate(['.'], { relativeTo: this.route.parent });
  }

  get password() {
    return this.passwordForm.get('password');
  }

  get confirmPassword() {
    return this.passwordForm.get('confirmPassword');
  }
}
