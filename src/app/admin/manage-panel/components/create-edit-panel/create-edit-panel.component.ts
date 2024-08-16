import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupService } from '@core/popup/popup.service';
import { TranslateService } from '@ngx-translate/core';
import { LocationService } from '@shared/service/location.service';
import { PanelService } from '@shared/service/panel.service';

@Component({
  selector: 'app-create-edit-panel',
  templateUrl: './create-edit-panel.component.html',
  styleUrls: ['./create-edit-panel.component.scss'],
})
export class CreateEditPanelComponent implements OnInit {
  panelId: string;
  panelForm: FormGroup;

  buildings: any = [];
  floors: any = [];
  zones: any = [];
  groups: any = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private popupService: PopupService,
    private panelService: PanelService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.panelForm = this.formBuilder.group({
      name: ['', Validators.required],
      id: ['', Validators.required],
      buildingId: ['', Validators.required],
      floorId: ['', Validators.required],
      zoneId: ['', Validators.required],
      groupId: [''],
    });

    this.panelId = this.route.snapshot.paramMap.get('panelId');

    if (this.panelId) {
      this.panelService.getPanelById(this.panelId).subscribe(
        (response: any) => {
          this.panelForm.patchValue(response.panel);
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
  }

  create() {
    Object.keys(this.panelForm.controls).map((key) => {
      this.panelForm.get(key).markAsTouched();
    });
    if (this.panelForm.invalid) {
      return;
    }

    this.panelService.createPanel(this.panelForm.value).subscribe(
      (response) => {
        this.popupService.openModal({
          type: 'notification',
          class: 'success',
          header: 'Panel Created',
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
    Object.keys(this.panelForm.controls).map((key) => {
      this.panelForm.get(key).markAsTouched();
    });
    if (this.panelForm.invalid) {
      return;
    }

    this.panelService.updatePanel(this.panelId, this.panelForm.value).subscribe(
      (response) => {
        this.popupService.openModal({
          type: 'notification',
          class: 'success',
          header: 'Panel Updated',
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
    return this.panelForm.get('name');
  }

  get id() {
    return this.panelForm.get('id');
  }

  get buildingId() {
    return this.panelForm.get('buildingId');
  }

  get floorId() {
    return this.panelForm.get('floorId');
  }

  get zoneId() {
    return this.panelForm.get('zoneId');
  }

  get groupId() {
    return this.panelForm.get('groupId');
  }
}
