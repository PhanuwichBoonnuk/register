import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from '@config';
import { PopupService } from '@core/popup/popup.service';
import { AuthState } from '@core/store/auth/auth.reducer';
import { userSelector } from '@core/store/auth/auth.selector';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { LocationService } from '@shared/service/location.service';
import { LockerService } from '@shared/service/locker.service';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-create-edit-locker',
  templateUrl: './create-edit-locker.component.html',
  styleUrls: ['./create-edit-locker.component.scss'],
})
export class CreateEditLockerComponent implements OnInit {
  lockerId: string;
  lockerForm: FormGroup;
  enableAutoAssign = this.config.getConfig('enableAutoAssign');

  buildings: any = [];
  floors: any = [];
  zones: any = [];
  groups: any = [];

  profile$: Observable<any>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private popupService: PopupService,
    private lockerService: LockerService,
    private translateService: TranslateService,
    private authStore: Store<AuthState>,
    private config: AppConfig,
  ) {}

  ngOnInit(): void {
    this.lockerForm = this.formBuilder.group({
      name: ['', Validators.required],
      buildingId: ['', Validators.required],
      floorId: ['', Validators.required],
      zoneId: ['', Validators.required],
      groupId: [''],
      type: ['', Validators.required],
      owners: [[]],
      cu: [''],
      relay: [''],
    });

    /*
      NOTE: Only SuperAdmin can update building, floor, zone, group, cu, relay
    */
    this.profile$ = this.authStore.select(userSelector);

    this.lockerId = this.route.snapshot.paramMap.get('lockerId');

    if (this.lockerId) {
      this.lockerService.getLockerById(this.lockerId).subscribe(
        (response: any) => {
          this.lockerForm.patchValue(response.locker);
          this.owners.setValue(response.locker.ownerDetails);
        },
        (error) => {}
      );
    }

    this.locationService.getLocations().subscribe(
      (response: any) => {
        this.buildings = response.locations;
      },
      (error) => {}
    );

    /* select building -> get floor */
    this.buildingId.valueChanges.subscribe((buildingId) => {
      this.floorId.setValue('');
      this.zoneId.setValue('');
      this.groupId.setValue('');
      if (buildingId) {
        this.locationService.getBuildingById(buildingId).subscribe(
          (response: any) => {
            this.floors = response.locations.floors;
          },
          (error) => {}
        );
      }
    });

    /* select floor -> get zone */
    this.floorId.valueChanges.subscribe((floorId) => {
      this.zoneId.setValue('');
      this.groupId.setValue('');
      if (floorId) {
        this.locationService
          .getFloorById(this.buildingId.value, floorId)
          .subscribe(
            (response: any) => {
              this.zones = response.locations.zones;
            },
            (error) => {}
          );
      }
    });

    /* select zone -> get group */
    this.zoneId.valueChanges.subscribe((zoneId) => {
      this.groupId.setValue('');
      if (zoneId) {
        this.locationService
          .getZoneById(this.buildingId.value, this.floorId.value, zoneId)
          .subscribe(
            (response: any) => {
              this.groups = response.locations.groups;
            },
            (error) => {}
          );
      }
    });

    this.type.valueChanges.subscribe((type) => {
      if (type !== 'personal') {
        this.owners.setValue([]);
      }
    });
  }

  addSelectedUser(selectedUsers) {
    this.owners.setValue(selectedUsers);
  }

  create() {
    Object.keys(this.lockerForm.controls).map((key) => {
      this.lockerForm.get(key).markAsTouched();
    });
    if (this.lockerForm.invalid) {
      return;
    }

    this.lockerService
      .createLocker({
        ...this.lockerForm.value,
        owners: this.owners.value.map((user) => user.id),
      })
      .subscribe(
        (response) => {
          this.popupService.openModal({
            type: 'notification',
            class: 'success',
            header: 'Locker Created',
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
    Object.keys(this.lockerForm.controls).map((key) => {
      this.lockerForm.get(key).markAsTouched();
    });
    if (this.lockerForm.invalid) {
      return;
    }

    this.lockerService
      .updateLocker(this.lockerId, {
        ...this.lockerForm.value,
        owners: this.owners.value.map((user) => user.id),
      })
      .subscribe(
        (response) => {
          this.popupService.openModal({
            type: 'notification',
            class: 'success',
            header: 'Locker Updated',
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

  get name() {
    return this.lockerForm.get('name');
  }

  get buildingId() {
    return this.lockerForm.get('buildingId');
  }

  get floorId() {
    return this.lockerForm.get('floorId');
  }

  get zoneId() {
    return this.lockerForm.get('zoneId');
  }

  get groupId() {
    return this.lockerForm.get('groupId');
  }

  get type() {
    return this.lockerForm.get('type');
  }

  get owners(): FormArray {
    return this.lockerForm.get('owners') as FormArray;
  }

  get cu() {
    return this.lockerForm.get('cu');
  }

  get relay() {
    return this.lockerForm.get('relay');
  }
}
