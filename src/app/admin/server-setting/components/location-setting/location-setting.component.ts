import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupService } from '@core/popup/popup.service';
import { TranslateService } from '@ngx-translate/core';
import { LocationService } from '@shared/service/location.service';

@Component({
  selector: 'app-location-setting',
  templateUrl: './location-setting.component.html',
  styleUrls: ['./location-setting.component.scss'],
})
export class LocationSettingComponent implements OnInit {
  selectedLocationForm: FormGroup;

  buildings: any = [];
  floors: any = [];
  zones: any = [];

  addBuilding;
  addFloor;
  addZone;
  editBuilding;
  editFloor;
  editZone;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private popupService: PopupService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.selectedLocationForm = this.formBuilder.group({
      buildingId: [''],
      buildingName: [''],
      floorId: [''],
      floorName: [''],
      zoneId: [''],
      zoneName: [''],
    });

    this.getBuildings();

    /* select building -> get floor */
    this.buildingId.valueChanges.subscribe((buildingId) => {
      this.floorId.setValue('');
      this.zoneId.setValue('');
      if (buildingId) {
        this.getFloors();
      }
    });

    /* select floor -> get zone */
    this.floorId.valueChanges.subscribe((floorId) => {
      this.zoneId.setValue('');
      if (floorId) {
        this.getZones();
      }
    });
  }

  selectBuilding(building) {
    if (this.buildingId.value !== building.id) {
      this.editBuilding = false;
      this.buildingId.setValue(building.id);
      this.buildingName.setValue(building.name);
      this.floorId.setValue('');
      this.floorName.setValue('');
      this.zoneId.setValue('');
      this.zoneName.setValue('');
      this.floors = [];
      this.zones = [];
    }
  }

  selectFloor(floor) {
    if (this.floorId.value !== floor.id) {
      this.editFloor = false;
      this.floorId.setValue(floor.id);
      this.floorName.setValue(floor.name);
      this.zoneId.setValue('');
      this.zoneName.setValue('');
      this.zones = [];
    }
  }

  selectZone(zone) {
    if (this.zoneId.value !== zone.id) {
      this.editZone = false;
      this.zoneId.setValue(zone.id);
      this.zoneName.setValue(zone.name);
    }
  }

  getBuildings() {
    this.locationService.getLocations().subscribe(
      (response: any) => {
        this.buildings = response.locations;
      },
      (error) => {}
    );
  }

  getFloors() {
    this.locationService.getBuildingById(this.buildingId.value).subscribe(
      (response: any) => {
        this.floors = response.locations.floors;
      },
      (error) => {}
    );
  }

  getZones() {
    this.locationService
      .getFloorById(this.buildingId.value, this.floorId.value)
      .subscribe(
        (response: any) => {
          this.zones = response.locations.zones;
        },
        (error) => {}
      );
  }

  createBuilding() {
    this.locationService
      .createBuilding({ name: this.buildingName.value })
      .subscribe(
        (response) => {
          this.getBuildings();
          this.addBuilding = false;
        },
        (error) => {}
      );
  }

  createFloor() {
    this.locationService
      .createFloor({
        name: this.floorName.value,
        buildingId: this.buildingId.value,
      })
      .subscribe(
        (response) => {
          this.getFloors();
          this.addFloor = false;
        },
        (error) => {}
      );
  }

  createZone() {
    this.locationService
      .createZone({ name: this.zoneName.value, floorId: this.floorId.value })
      .subscribe(
        (response) => {
          this.getZones();
          this.addZone = false;
        },
        (error) => {}
      );
  }

  updateBuilding() {
    this.locationService
      .updateBuilding(this.buildingId.value, { name: this.buildingName.value })
      .subscribe(
        (response) => {
          this.getBuildings();
          this.editBuilding = false;
        },
        (error) => {}
      );
  }

  updateFloor() {
    this.locationService
      .updateFloor(this.floorId.value, {
        name: this.floorName.value,
        buildingId: this.buildingId.value,
      })
      .subscribe(
        (response) => {
          this.getFloors();
          this.editFloor = false;
        },
        (error) => {}
      );
  }

  updateZone() {
    this.locationService
      .updateZone(this.zoneId.value, {
        name: this.zoneName.value,
        floorId: this.floorId.value,
        zoneId: this.zoneId.value,
      })
      .subscribe(
        (response) => {
          this.getZones();
          this.editZone = false;
        },
        (error) => {}
      );
  }

  deleteBuilding(building) {
    this.popupService
      .openModal({
        type: 'confirm',
        class: 'danger',
        header: 'Delete Building',
        content: 'You want to delete ' + building.name + ' ?',
      })
      .subscribe((result) => {
        if (result) {
          this.locationService.deleteBuilding(building.id).subscribe(
            (response: any) => {
              this.popupService.openModal({
                type: 'notification',
                class: 'success',
                header: this.translateService.instant('modal.success'),
                content: 'Building ' + building.name + ' was deleted.',
              });
              this.getBuildings();
            },
            (error) => {
              this.popupService.openModal({
                type: 'notification',
                class: 'danger',
                header: this.translateService.instant('modal.fail'),
                content: error.error.info,
              });
              this.getBuildings();
            }
          );
        }
      });
  }

  deleteFloor(floor) {
    this.popupService
      .openModal({
        type: 'confirm',
        class: 'danger',
        header: 'Delete Floor',
        content: 'You want to delete ' + floor.name + ' ?',
      })
      .subscribe((result) => {
        if (result) {
          this.locationService.deleteFloor(floor.id).subscribe(
            (response: any) => {
              this.popupService.openModal({
                type: 'notification',
                class: 'success',
                header: this.translateService.instant('modal.success'),
                content: 'Floor ' + floor.name + ' was deleted.',
              });
              this.getFloors();
            },
            (error) => {
              this.popupService.openModal({
                type: 'notification',
                class: 'danger',
                header: this.translateService.instant('modal.fail'),
                content: error.error.info,
              });
              this.getFloors();
            }
          );
        }
      });
  }

  deleteZone(zone) {
    this.popupService
      .openModal({
        type: 'confirm',
        class: 'danger',
        header: 'Delete Zone',
        content: 'You want to delete ' + zone.name + ' ?',
      })
      .subscribe((result) => {
        if (result) {
          this.locationService.deleteZone(zone.id).subscribe(
            (response: any) => {
              this.popupService.openModal({
                type: 'notification',
                class: 'success',
                header: this.translateService.instant('modal.success'),
                content: 'Zone ' + zone.name + ' was deleted.',
              });
              this.getZones();
            },
            (error) => {
              this.popupService.openModal({
                type: 'notification',
                class: 'danger',
                header: this.translateService.instant('modal.fail'),
                content: error.error.info,
              });
              this.getZones();
            }
          );
        }
      });
  }

  get buildingId() {
    return this.selectedLocationForm.get('buildingId');
  }

  get buildingName() {
    return this.selectedLocationForm.get('buildingName');
  }

  get floorId() {
    return this.selectedLocationForm.get('floorId');
  }

  get floorName() {
    return this.selectedLocationForm.get('floorName');
  }

  get zoneId() {
    return this.selectedLocationForm.get('zoneId');
  }

  get zoneName() {
    return this.selectedLocationForm.get('zoneName');
  }
}
