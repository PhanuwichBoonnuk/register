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
import { PanelService } from '@shared/service/panel.service';
import { UtilService } from '@shared/service/util.service';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-manage-panel',
  templateUrl: './manage-panel.component.html',
  styleUrls: ['./manage-panel.component.scss'],
  animations: [
    trigger('fade', [transition('* => *', [useAnimation(fadeAnimation)])]),
  ],
})
export class ManagePanelComponent implements OnInit {
  openFilter: boolean = this.utilService.isMobile() ? false : true;
  openSearch: boolean = this.utilService.isMobile() ? false : true;
  filterForm: FormGroup;

  buildings: any = [];
  floors: any = [];
  zones: any = [];

  panels: any = [];

  sort = { order: 'asc', property: 'name' };

  profile$: Observable<any>;
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private popupService: PopupService,
    private panelService: PanelService,
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
      - create, update and delete device
    */
    this.profile$ = this.authStore.select(userSelector);

    this.getPanels();
    this.router.events
      .pipe(
        filter((event: RouterEvent) => event instanceof NavigationEnd),
        takeUntil(this.unsubscribe)
      )
      .subscribe(() => {
        this.getPanels();
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

  getPanels() {
    this.panelService.getPanels().subscribe(
      (response: any) => {
        this.panels = response.panels;
      },
      (error) => {}
    );
  }

  createPanel() {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  updatePanel(panelId) {
    this.router.navigate(['update/' + panelId], { relativeTo: this.route });
  }

  deletePanel(panel) {
    this.popupService
      .openModal({
        type: 'confirm',
        class: 'danger',
        header: 'Delete Panel',
        content: 'You want to delete ' + panel.name + ' ?',
      })
      .subscribe((result) => {
        if (result) {
          this.panelService.deletePanel(panel.id).subscribe(
            (response: any) => {
              this.popupService.openModal({
                type: 'notification',
                class: 'success',
                header: this.translateService.instant('modal.success'),
                content: panel.name + 'was deleted.',
              });
              this.getPanels();
            },
            (error) => {
              this.popupService.openModal({
                type: 'notification',
                class: 'danger',
                header: this.translateService.instant('modal.fail'),
                content: error.error.info,
              });
              this.getPanels();
            }
          );
        }
      });
  }

  settingPanel(panelId: string) {
    this.router.navigate(['setting/' + panelId], { relativeTo: this.route });
  }

  updateDefaultSetting() {
    this.router.navigate(['setting/default'], { relativeTo: this.route });
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
