import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupService } from '@core/popup/popup.service';
import { TranslateService } from '@ngx-translate/core';
import { LocationService } from '@shared/service/location.service';
import { UserGroupService } from '@shared/service/user-group.service';
import { ManageLockerGroupService } from 'src/app/admin/manage-locker-group/manage-locker-group.service';

@Component({
  selector: 'app-add-locker-group',
  templateUrl: './add-locker-group.component.html',
  styleUrls: ['./add-locker-group.component.scss'],
})
export class AddLockerGroupComponent implements OnInit {
  filterForm: FormGroup;

  buildings: any = [];
  floors: any = [];
  zones: any = [];

  userGroupId;
  lockerGroup;
  lockerGroups: any = [];
  selectedLockerGroup: any = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private popupService: PopupService,
    private manageLockerGroupService: ManageLockerGroupService,
    private userGroupService: UserGroupService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      buildingId: [''],
      floorId: [''],
      zoneId: [''],
    });

    this.userGroupId = this.route.snapshot.paramMap.get('userGroupId');

    this.userGroupService.getUserGroupById(this.userGroupId).subscribe(
      (response: any) => {
        this.selectedLockerGroup = response.group.lockerGroups.map(
          (lockerGroup) => lockerGroup.id
        );
      },
      (error) => {}
    );

    this.getLockerGroups();

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
      this.floors = [];
      this.zones = [];
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
      this.zones = [];
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
  }

  getLockerGroups() {
    this.manageLockerGroupService.getLockerGroups().subscribe(
      (response: any) => {
        this.lockerGroups = response.lockergroup;
      },
      (error) => {}
    );
  }

  add() {
    this.userGroupService
      .updateUserGroup(this.userGroupId, {
        lockerGroups: this.selectedLockerGroup,
      })
      .subscribe(
        (response: any) => {
          this.popupService.openModal({
            type: 'notification',
            class: 'success',
            header: this.translateService.instant('modal.success'),
            content: 'Locker group was updated to user group.',
          });
          this.cancel();
        },
        (error) => {}
      );
  }

  cancel() {
    this.router.navigate(['.'], { relativeTo: this.route.parent });
  }

  filteredLockerGroup() {
    return this.lockerGroups
      .filter(
        (lockerGroup) =>
          (this.buildingId.value &&
            lockerGroup.buildingId === this.buildingId.value) ||
          !this.buildingId.value
      )
      .filter(
        (lockerGroup) =>
          (this.floorId.value && lockerGroup.floorId === this.floorId.value) ||
          !this.floorId.value
      )
      .filter(
        (lockerGroup) =>
          (this.zoneId.value && lockerGroup.zoneId === this.zoneId.value) ||
          !this.zoneId.value
      );
  }

  /* Locker Selection */
  selectAllLockerGroup() {
    if (!this.isSelectedAllLockerGroup()) {
      this.selectedLockerGroup = this.filteredLockerGroup().map(
        (lockerGroup) => lockerGroup.id
      );
    } else {
      this.selectedLockerGroup = [];
    }
  }
  isSelectedAllLockerGroup() {
    return (
      this.selectedLockerGroup.length === this.filteredLockerGroup().length &&
      this.filteredLockerGroup().length > 0
    );
  }
  isSelectedSomeLockerGroup() {
    return (
      this.selectedLockerGroup.length > 0 &&
      this.selectedLockerGroup.length < this.filteredLockerGroup().length
    );
  }
  addSelectedLockerGroup(lockerId: string) {
    if (this.selectedLockerGroup.indexOf(lockerId) === -1) {
      this.selectedLockerGroup.push(lockerId);
    } else {
      this.selectedLockerGroup.splice(
        this.selectedLockerGroup.indexOf(lockerId),
        1
      );
    }
  }
  isSelectedLockerGroup(lockerId: string) {
    return this.selectedLockerGroup.indexOf(lockerId) === -1 ? false : true;
  }

  get buildingId() {
    return this.filterForm.get('buildingId');
  }

  get floorId() {
    return this.filterForm.get('floorId');
  }

  get zoneId() {
    return this.filterForm.get('zoneId');
  }
}
