import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from '@config';
import { PopupService } from '@core/popup/popup.service';
import { TranslateService } from '@ngx-translate/core';
import { LockerService } from '@shared/service/locker.service';

@Component({
  selector: 'app-update-locker-type',
  templateUrl: './update-locker-type.component.html',
  styleUrls: ['./update-locker-type.component.scss'],
})
export class UpdateLockerTypeComponent implements OnInit {
  lockerForm: FormGroup;
  enableAutoAssign = this.config.getConfig('enableAutoAssign');

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private popupService: PopupService,
    private lockerService: LockerService,
    private translateService: TranslateService,
    private config: AppConfig,
  ) {}

  ngOnInit(): void {
    this.lockerForm = this.formBuilder.group({
      lockers: [[], Validators.required],
      type: ['', Validators.required],
    });

    this.route.snapshot.paramMap.get('lockers');
    this.lockers.setValue(
      this.route.snapshot.paramMap.get('lockers').split(',')
    );
  }

  update() {
    Object.keys(this.lockerForm.controls).map((key) => {
      this.lockerForm.get(key).markAsTouched();
    });
    if (this.lockerForm.invalid) {
      return;
    }

    this.lockerService
      .updateLockers({ lockerIds: this.lockers.value, type: this.type.value })
      .subscribe(
        (response: any) => {
          this.popupService.openModal({
            type: 'notification',
            class: 'success',
            header: this.translateService.instant('modal.success'),
            content: 'Set type completed.',
          });
          this.cancel();
        },
        (error) => {}
      );
  }

  cancel() {
    this.router.navigate(['.'], { relativeTo: this.route.parent });
  }

  get lockers() {
    return this.lockerForm.get('lockers');
  }

  get type() {
    return this.lockerForm.get('type');
  }
}
