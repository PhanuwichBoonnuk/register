import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
} from '@angular/router';
import { PopupService } from '@core/popup/popup.service';
import { AuthState } from '@core/store/auth/auth.reducer';
import { userSelector } from '@core/store/auth/auth.selector';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { fadeAnimation } from '@shared/animations';
import { LocationService } from '@shared/service/location.service';
import { UtilService } from '@shared/service/util.service';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ManageLockerGroupService } from './manage-locker-group.service';

@Component({
  selector: 'app-manage-locker-group',
  templateUrl: './manage-locker-group.component.html',
  styleUrls: ['./manage-locker-group.component.scss'],
  animations: [
    trigger('fade', [transition('* => *', [useAnimation(fadeAnimation)])]),
  ],
})
export class ManageLockerGroupComponent implements OnInit {
  openFilter: boolean = this.utilService.isMobile() ? false : true;
  openSearch: boolean = this.utilService.isMobile() ? false : true;
  filterForm: FormGroup;

  buildings: any = [];
  floors: any = [];
  zones: any = [];

  lockerGroups: any = [];

  sort = { order: 'asc', property: 'name' };

  profile$: Observable<any>;
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private popupService: PopupService,
    private manageLockerGroupService: ManageLockerGroupService,
    private translateService: TranslateService,
    private utilService: UtilService,
    private authStore: Store<AuthState>
  ) {}

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      buildingId: [''],
      floorId: [''],
      zoneId: [''],
      searchText: [''],
    });

    /*
      NOTE: Only SuperAdmin can
      - create, update and delete lockergroup
      - add locker to group
    */
    this.profile$ = this.authStore.select(userSelector);

    this.getLockerGroup();
    this.router.events
      .pipe(
        filter((event: RouterEvent) => event instanceof NavigationEnd),
        takeUntil(this.unsubscribe)
      )
      .subscribe(() => {
        this.getLockerGroup();
      });

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

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getLockerGroup() {
    this.manageLockerGroupService.getLockerGroups().subscribe(
      (response: any) => {
        this.lockerGroups = response.lockergroup.sort((a, b) =>
          a['name'] < b['name'] ? -1 : 1
        );
      },
      (error) => {}
    );
  }

  createLockerGroup() {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  updateLockerGroup(lockerGroupId) {
    this.router.navigate(['update/' + lockerGroupId], {
      relativeTo: this.route,
    });
  }

  deleteLockerGroup(lockerGroup) {
    this.popupService
      .openModal({
        type: 'confirm',
        class: 'danger',
        header: 'Delete Locker Group',
        content: 'You want to delete ' + lockerGroup.name + ' ?',
      })
      .subscribe((result) => {
        if (result) {
          this.manageLockerGroupService
            .deleteLockerGroup(lockerGroup.id)
            .subscribe(
              (response: any) => {
                this.popupService.openModal({
                  type: 'notification',
                  class: 'success',
                  header: this.translateService.instant('modal.success'),
                  content: lockerGroup.name + 'was deleted.',
                });
                this.getLockerGroup();
              },
              (error) => {
                this.popupService.openModal({
                  type: 'notification',
                  class: 'danger',
                  header: this.translateService.instant('modal.fail'),
                  content: error.error.info,
                });
                this.getLockerGroup();
              }
            );
        }
      });
  }

  addLockerToLockerGroup(lockerGroupId) {
    this.router.navigate(['add/' + lockerGroupId], { relativeTo: this.route });
  }

  setOpenTimeLockerGroup(lockerGroupId) {
    this.router.navigate(['open/' + lockerGroupId], { relativeTo: this.route });
  }
  setOpenAutoRelease(lockerGroupId){
    this.router.navigate(['openRelease/' + lockerGroupId], { relativeTo: this.route });
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

  get buildingId() {
    return this.filterForm.get('buildingId');
  }

  get floorId() {
    return this.filterForm.get('floorId');
  }

  get zoneId() {
    return this.filterForm.get('zoneId');
  }

  get searchText() {
    return this.filterForm.get('searchText');
  }
}
