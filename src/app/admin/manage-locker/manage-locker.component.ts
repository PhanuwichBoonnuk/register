import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
} from '@angular/router';
import { PopupService } from '@core/popup/popup.service';
import { AuthState } from '@core/store/auth/auth.reducer';
import {
  scopeObjectSelector,
  userSelector,
} from '@core/store/auth/auth.selector';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { fadeAnimation } from '@shared/animations';
import { ActionService } from '@shared/service/action.service';
import { LocationService } from '@shared/service/location.service';
import { LockerService } from '@shared/service/locker.service';
import { UtilService } from '@shared/service/util.service';
import { Observable, Subject } from 'rxjs';
import { catchError, filter, finalize, take, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-manage-locker',
  templateUrl: './manage-locker.component.html',
  styleUrls: ['./manage-locker.component.scss'],
  animations: [
    trigger('fade', [transition('* => *', [useAnimation(fadeAnimation)])]),
  ],
})
export class ManageLockerComponent implements OnInit {
  openFilter: boolean = this.utilService.isMobile() ? false : true;
  openSearch: boolean = this.utilService.isMobile() ? false : true;
  filterForm: FormGroup;

  buildings: any = [];
  floors: any = [];
  zones: any = [];
  groups: any = [];
  countSelected: any = [];
  lockers: any = [];

  selectedLocker: string[] = [];

  sort = { order: 'asc', property: 'name' };

  profile$: Observable<any>;

  private unsubscribe: Subject<void> = new Subject();

  @ViewChild('fileUpload') fileUpload;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private popupService: PopupService,
    private locationService: LocationService,
    private lockerService: LockerService,
    private actionService: ActionService,
    private translateService: TranslateService,
    private utilService: UtilService,
    private authStore: Store<AuthState>
  ) { }

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      buildingId: [''],
      floorId: [''],
      zoneId: [''],
      groupId: [''],
      searchText: [''],
    });

    this.profile$ = this.authStore.select(userSelector);

    this.getLockers();
    this.router.events
      .pipe(
        filter((event: RouterEvent) => event instanceof NavigationEnd),
        takeUntil(this.unsubscribe)
      )
      .subscribe(() => {
        this.getLockers();
        this.selectedLocker = [];
        this.sort = { order: 'asc', property: 'name' };
      });

    this.locationService.getLocations()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response: any) => {
          this.buildings = response.locations;
        },
        (error) => { }
      );

    /* filter change -> clear selected locker */
    this.filterForm.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((filterForm) => {
        this.selectedLocker = [];
      });

    /* select building -> get floor */
    this.buildingId.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((buildingId) => {
        this.floorId.setValue('');
        this.zoneId.setValue('');
        this.groupId.setValue('');
        this.floors = [];
        this.zones = [];
        this.groups = [];
        if (buildingId) {
          this.locationService.getBuildingById(buildingId).pipe(take(1)).subscribe(
            (response: any) => {
              this.floors = response.locations.floors;
            },
            (error) => { }
          );
        }
      });

    /* select floor -> get zone */
    this.floorId.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((floorId) => {
        this.zoneId.setValue('');
        this.groupId.setValue('');
        this.zones = [];
        this.groups = [];
        if (floorId) {
          this.locationService
            .getFloorById(this.buildingId.value, floorId)
            .pipe(take(1))
            .subscribe(
              (response: any) => {
                this.zones = response.locations.zones;
              },
              (error) => { }
            );
        }
      });

    /* select zone -> get group */
    this.zoneId.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((zoneId) => {
        this.groupId.setValue('');
        this.groups = [];
        if (zoneId) {
          this.locationService
            .getZoneById(this.buildingId.value, this.floorId.value, zoneId)
            .subscribe(
              (response: any) => {
                this.groups = response.locations.groups;
              },
              (error) => { }
            );
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getLockers() {
    this.lockerService.getLockers().pipe(takeUntil(this.unsubscribe)).subscribe(
      (response: any) => {
        this.lockers = response.lockers.sort((a, b) =>
          a['name'] < b['name'] ? -1 : 1
        );
      },
      (error) => { }
    );
  }

  createLocker() {
    this.router.navigate(['create'], {
      relativeTo: this.route,
    });
  }

  updateLocker(lockerId) {
    this.router.navigate(['update/' + lockerId], {
      relativeTo: this.route,
    });
  }

  deleteLocker(locker) {
    this.popupService
      .openModal({
        type: 'confirm',
        class: 'danger',
        header: 'Delete Locker',
        content: 'You want to delete ' + locker.name + ' ?',
      })
      .subscribe((result) => {
        if (result) {
          this.lockerService.deleteLocker(locker.id).subscribe(
            (reponse) => {
              this.popupService.openModal({
                type: 'notification',
                class: 'success',
                header: this.translateService.instant('modal.success'),
                content: 'Locker was deleted',
              });
              this.getLockers();
            },
            (error) => {
              this.popupService.openModal({
                type: 'notification',
                class: 'danger',
                header: this.translateService.instant('modal.fail'),
                content: error.error.info,
              });
              this.getLockers();
            }
          );
        }
      });
  }

  disableLocker(locker) {
    this.popupService
      .openModal({
        type: 'confirm',
        class: 'danger',
        header: 'Disable Locker',
        content: 'You want to disable ' + locker.name + ' ?',
      })
      .subscribe((result) => {
        if (result) {
          this.lockerService
            .updateLocker(locker.id, { disabled: true })
            .subscribe(
              (response: any) => {
                this.popupService.openModal({
                  type: 'notification',
                  class: 'success',
                  header: this.translateService.instant('modal.success'),
                  content: 'Locker ' + locker.name + ' was disabled.',
                });
                this.getLockers();
              },
              (error) => {
                this.popupService.openModal({
                  type: 'notification',
                  class: 'danger',
                  header: this.translateService.instant('modal.fail'),
                  content: error.error.info,
                });
                this.getLockers();
              }
            );
        }
      });
  }

  enableLocker(locker) {
    this.popupService
      .openModal({
        type: 'confirm',
        class: 'danger',
        header: 'Enable Locker',
        content: 'You want to enable ' + locker.name + ' ?',
      })
      .subscribe((result) => {
        if (result) {
          this.lockerService
            .updateLocker(locker.id, { disabled: false })
            .subscribe(
              (response: any) => {
                this.popupService.openModal({
                  type: 'notification',
                  class: 'success',
                  header: this.translateService.instant('modal.success'),
                  content: 'Locker ' + locker.name + ' was enabled.',
                });
                this.getLockers();
              },
              (error) => {
                this.popupService.openModal({
                  type: 'notification',
                  class: 'danger',
                  header: this.translateService.instant('modal.fail'),
                  content: error.error.info,
                });
                this.getLockers();
              }
            );
        }
      });
  }

  returnLocker(locker) {
    this.popupService
      .openModal({
        type: 'confirm',
        class: 'danger',
        header: 'Return Locker',
        content: 'You want to force return ' + locker.name + ' ?',
      })
      .subscribe((result) => {
        if (result) {
          this.actionService
            .returnLockerByAdmin({ lockerId: locker.id })
            .subscribe(
              (response: any) => {
                this.popupService.openModal({
                  type: 'notification',
                  class: 'success',
                  header: this.translateService.instant('modal.success'),
                  content: 'Locker ' + locker.name + ' was returned.',
                });
                this.getLockers();
              },
              (error) => {
                this.popupService.openModal({
                  type: 'notification',
                  class: 'danger',
                  header: this.translateService.instant('modal.fail'),
                  content: error.error.info,
                });
                this.getLockers();
              }
            );
        }
      });
  }

  updateSelectedLockerType() {
    if (this.selectedLocker.length === 0) {
      this.popupService.openModal({
        type: 'notification',
        class: 'warning',
        header: 'Set Type Locker',
        content: 'Please select at least one locker.',
      });
      return;
    }

    this.router.navigate(['type', { lockers: this.selectedLocker }], {
      relativeTo: this.route,
    });
  }

  unlockSelectedLocker() {
    if (this.selectedLocker.length === 0) {
      this.popupService.openModal({
        type: 'notification',
        class: 'warning',
        header: 'Unlock Locker',
        content: 'Please select at least one locker.',
      });
      return;
    }

    this.popupService
      .openModal({
        type: 'confirm',
        class: 'danger',
        header: 'Unlock Locker',
        content: 'You want to unlock your selected locker ?',
      })
      .subscribe((result) => {
        if (result) {
          this.actionService
            .openLockerByAdmin({ lockerIds: this.selectedLocker })
            .subscribe(
              (response: any) => {
                this.popupService.openModal({
                  type: 'notification',
                  class: 'success',
                  header: this.translateService.instant('modal.success'),
                  content: this.translateService.instant('page.manage-locker.unlocked'),
                });
              },
              (error) => { }
            );
        }
      });
  }

  deleteSelectedLocker() {
    if (this.selectedLocker.length === 0) {
      this.popupService.openModal({
        type: 'notification',
        class: 'warning',
        header: 'Delete Locker',
        content: 'Please select at least one locker.',
      });
      return;
    }

    this.popupService
      .openModal({
        type: 'confirm',
        class: 'danger',
        header: 'Delete Locker',
        content: 'You want to delete your selected locker ?',
      })
      .subscribe((result) => {
        if (result) {
          this.lockerService
            .deleteLockers({ lockerIds: this.selectedLocker })
            .subscribe(
              (response: any) => {
                this.popupService.openModal({
                  type: 'notification',
                  class: 'success',
                  header: this.translateService.instant('modal.success'),
                  content: 'Locker are deleted.',
                });
                this.getLockers();
              },
              (error) => { }
            );
        }
      });
  }

  goToManageLockerGroup() {
    this.router.navigate(['/admin/manage-locker-group']);
  }

  changeSort(property) {
    this.sort = {
      order:
        property === this.sort.property
          ? this.sort.order === 'asc'
            ? 'desc'
            : 'asc'
          : 'asc',
      property: property,
    };
  }

  filteredLocker() {
    return this.lockers
      .filter(
        (locker) =>
          (this.buildingId.value &&
            locker.buildingId === this.buildingId.value) ||
          !this.buildingId.value
      )
      .filter(
        (locker) =>
          (this.floorId.value && locker.floorId === this.floorId.value) ||
          !this.floorId.value
      )
      .filter(
        (locker) =>
          (this.zoneId.value && locker.zoneId === this.zoneId.value) ||
          !this.zoneId.value
      )
      .filter(
        (locker) =>
          (this.groupId.value && locker.groupId === this.groupId.value) ||
          !this.groupId.value
      )
      .filter(
        (locker) =>
          JSON.stringify(locker)
            .toLowerCase()
            .indexOf(this.searchText.value) !== -1
      );
  }

  onFileSelected(e) {

    const file = e?.target?.files[0];

    if (file) {
      this.lockerService.importLocker(file).pipe(
        take(1),
        tap((res: any) => {
          if (res.success) {
            this.popupService.openModal({
              type: 'notification',
              class: 'success',
              header: this.translateService.instant('modal.success'),
              content: res.msg,
            });
          } else {
            const error = [...res.msg?.data]
            this.popupService.openModal({
              type: 'notification',
              class: 'danger',
              header: this.translateService.instant('modal.fail'),
              list: error.map(e => `Error at row ${e.row} name ${e.name}`),
            });
          }
        }),
        finalize(() => this.getLockers())
      ).subscribe();
    }

    this.fileUpload.nativeElement.value = "";

  }

  export() {
    let lockerIds = this.selectedLocker || [];

    this.lockerService.exportLocker({ lockerIds }).pipe(take(1)).subscribe(
      (response: any) => {
        const now = new Date(Date.now()).toLocaleDateString();
        const fileName = `locker_data_${now}.csv`;
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    )
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
    return (
      this.selectedLocker.length === this.filteredLocker().length &&
      this.filteredLocker().length > 0

    );
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

  get buildingId() {
    return this.filterForm.get('buildingId');
  }

  get floorId() {
    return this.filterForm.get('floorId');
  }

  get zoneId() {
    return this.filterForm.get('zoneId');
  }

  get groupId() {
    return this.filterForm.get('groupId');
  }

  get searchText() {
    return this.filterForm.get('searchText');
  }
}
