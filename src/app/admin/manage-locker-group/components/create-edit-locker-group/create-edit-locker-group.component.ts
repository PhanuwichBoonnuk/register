import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupService } from '@core/popup/popup.service';
import { TranslateService } from '@ngx-translate/core';
import { LocationService } from '@shared/service/location.service';
import { PanelService } from '@shared/service/panel.service';
import { ManageLockerGroupService } from '../../manage-locker-group.service';

@Component({
    selector: 'app-create-edit-locker-group',
    templateUrl: './create-edit-locker-group.component.html',
    styleUrls: ['./create-edit-locker-group.component.scss'],
})
export class CreateEditLockerGroupComponent implements OnInit {
    lockerGroupForm: FormGroup;
    lockerGroupId;

    buildings: any = [];
    floors: any = [];
    zones: any = [];
    panels: any = [];
    loading: boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private locationService: LocationService,
        private panelService: PanelService,
        private popupService: PopupService,
        private manageLockerGroupService: ManageLockerGroupService,
        private translateService: TranslateService
    ) { }

    ngOnInit(): void {
        this.lockerGroupForm = this.formBuilder.group({
            name: ['', Validators.required],
            buildingId: ['', Validators.required],
            floorId: ['', Validators.required],
            zoneId: ['', Validators.required],
            autoAssign: [false, Validators.required],
            allowGuest: [false, Validators.required],
            panel: [''],
            layout: [''],
        });

        this.lockerGroupId = this.route.snapshot.paramMap.get('lockerGroupId');

        if (this.lockerGroupId) {
            this.manageLockerGroupService
                .getLockerGroupById(this.lockerGroupId)
                .subscribe(
                    (response: any) => {
                        this.lockerGroupForm.patchValue(response.lockergroup);
                    },
                    (error) => { }
                );
        }

        this.locationService.getLocations().subscribe(
            (response: any) => {
                this.buildings = response.locations;
            },
            (error) => { }
        );

        this.panelService.getPanels().subscribe(
            (response: any) => {
                this.panels = response.panels;
            },
            (error) => { }
        );

        /* select building -> get floor */
        this.buildingId.valueChanges.subscribe((buildingId) => {
            this.floorId.setValue('');
            this.zoneId.setValue('');
            if (buildingId) {
                this.locationService.getBuildingById(buildingId).subscribe(
                    (response: any) => {
                        this.floors = response.locations.floors;
                    },
                    (error) => { }
                );
            }
        });

        /* select floor -> get zone */
        this.floorId.valueChanges.subscribe((floorId) => {
            this.zoneId.setValue('');
            if (floorId) {
                this.locationService
                    .getFloorById(this.buildingId.value, floorId)
                    .subscribe(
                        (response: any) => {
                            this.zones = response.locations.zones;
                        },
                        (error) => { }
                    );
            }
        });
        setTimeout(() => {
            this.loading = true;
        }, 1000);    }

    create() {
        Object.keys(this.lockerGroupForm.controls).map((key) => {
            this.lockerGroupForm.get(key).markAsTouched();
        });
        if (this.lockerGroupForm.invalid) {
            return;
        }

        this.manageLockerGroupService
            .createLockerGroup(this.lockerGroupForm.value)
            .subscribe(
                (response) => {
                    this.popupService.openModal({
                        type: 'notification',
                        class: 'success',
                        header: 'Locker Group Created',
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
        Object.keys(this.lockerGroupForm.controls).map((key) => {
            this.lockerGroupForm.get(key).markAsTouched();
        });
        if (this.lockerGroupForm.invalid) {
            return;
        }

        this.manageLockerGroupService
            .updateLockerGroup(this.lockerGroupId, this.lockerGroupForm.value)
            .subscribe(
                (response) => {
                    this.popupService.openModal({
                        type: 'notification',
                        class: 'success',
                        header: this.translateService.instant('modal.success'),
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

    setLayout(imageUrl) {
        this.layout.setValue(imageUrl);
    }

    get name() {
        return this.lockerGroupForm.get('name');
    }

    get buildingId() {
        return this.lockerGroupForm.get('buildingId');
    }

    get floorId() {
        return this.lockerGroupForm.get('floorId');
    }

    get zoneId() {
        return this.lockerGroupForm.get('zoneId');
    }

    get autoAssign() {
        return this.lockerGroupForm.get('autoAssign');
    }

    get allowGuest() {
        return this.lockerGroupForm.get('allowGuest');
    }

    get panel() {
        return this.lockerGroupForm.get('panel');
    }

    get layout() {
        return this.lockerGroupForm.get('layout');
    }
}
