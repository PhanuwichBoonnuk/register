import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupService } from '@core/popup/popup.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '@shared/service/user.service';

@Component({
  selector: 'app-ban-user',
  templateUrl: './ban-user.component.html',
  styleUrls: ['./ban-user.component.scss'],
})
export class BanUserComponent implements OnInit {
  banForm: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private popupService: PopupService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.banForm = this.formBuilder.group({
      userId: ['', Validators.required],
      userName: [''],
      reason: [''],
    });
  }

  selectUser(users) {
    this.userId.setValue(users[0]['id']);
    this.userName.setValue(users[0]['name']);
  }

  ban() {
    Object.keys(this.banForm.controls).map((key) => {
      this.banForm.get(key).markAsTouched();
    });
    if (this.banForm.invalid) {
      return;
    }

    this.userService.banUser(this.userId.value, this.banForm.value).subscribe(
      (response) => {
        this.popupService.openModal({
          type: 'notification',
          class: 'success',
          header: 'Ban User',
          content: this.userName.value + ' was banned.',
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

  get userId() {
    return this.banForm.get('userId');
  }

  get userName() {
    return this.banForm.get('userName');
  }

  get reason() {
    return this.banForm.get('reason');
  }
}
