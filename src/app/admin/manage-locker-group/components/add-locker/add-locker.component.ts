import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupService } from '@core/popup/popup.service';
import { TranslateService } from '@ngx-translate/core';
import { LocationService } from '@shared/service/location.service';
import { LockerService } from '@shared/service/locker.service';
import { ManageLockerGroupService } from '../../manage-locker-group.service';

@Component({
  selector: 'app-add-locker',
  templateUrl: './add-locker.component.html',
  styleUrls: ['./add-locker.component.scss'],
})
export class AddLockerComponent implements OnInit {
  filterForm: FormGroup;

  zones: any = [];

  lockerGroupId;
  lockerGroup;
  lockers: any = [];
  selectedLocker: any = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private popupService: PopupService,
    private manageLockerGroupService: ManageLockerGroupService,
    private lockerService: LockerService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      zoneId: [''],
    });

    this.lockerGroupId = this.route.snapshot.paramMap.get('lockerGroupId');

    /* get locker group */
    this.manageLockerGroupService
      .getLockerGroupById(this.lockerGroupId)
      .subscribe(
        (response: any) => {
          this.lockerGroup = response.lockergroup;
          this.zoneId.setValue(response.lockergroup.zoneId);
          this.selectedLocker = response.lockergroup.lockers.map(
            (locker) => locker.id
          );

          this.locationService
            .getFloorById(this.lockerGroup.buildingId, this.lockerGroup.floorId)
            .subscribe(
              (response: any) => {
                this.zones = response.locations.zones;
              },
              (error) => {}
            );
        },
        (error) => {}
      );

    /* get locker */
    this.getLockers();

    /* filter change */
    this.filterForm.valueChanges.subscribe((filterForm) => {
      this.selectedLocker = [];
    });
  }

  getLockers() {
    this.lockerService.getLockers({ zone_id: this.zoneId.value }).subscribe(
      (response: any) => {
        this.lockers = response.lockers;
      },
      (error) => {}
    );
  }

  add() {
    this.manageLockerGroupService
      .updateLockerToLockerGroup(this.lockerGroupId, {
        zoneId: this.zoneId.value,
        lockerIds: this.selectedLocker,
      })
      .subscribe(
        (response: any) => {
          this.popupService.openModal({
            type: 'notification',
            class: 'success',
            header: this.translateService.instant('modal.success'),
            content: 'Locker was updated to group.',
          });
          this.cancel();
        },
        (error) => {}
      );
  }

  cancel() {
    this.router.navigate(['.'], { relativeTo: this.route.parent });
  }

  filteredLocker() {
    return this.lockers.filter(
      (locker) =>
        (this.zoneId.value && locker.zoneId === this.zoneId.value) ||
        !this.zoneId.value
    );
  }

  /* Locker Selection */
  selectAllLocker() {
    if (!this.isSelectedAllLocker()) {
      this.selectedLocker = this.filteredLocker().map((locker) => locker.id);
    } else {
      this.selectedLocker = [];
    }
  }
  isSelectedAllLocker() {
    return this.selectedLocker.length === this.filteredLocker().length;
  }
  isSelectedSomeLocker() {
    return (
      this.selectedLocker.length > 0 &&
      this.selectedLocker.length < this.filteredLocker().length
    );
  }
  addSelectedLocker(lockerId: string) {
    if (this.selectedLocker.indexOf(lockerId) === -1) {
      this.selectedLocker.push(lockerId);
    } else {
      this.selectedLocker.splice(this.selectedLocker.indexOf(lockerId), 1);
    }
  }
  isSelectedLocker(lockerId: string) {
    return this.selectedLocker.indexOf(lockerId) === -1 ? false : true;
  }

  get zoneId() {
    return this.filterForm.get('zoneId');
  }
}
