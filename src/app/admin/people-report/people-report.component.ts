import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PopupService } from '@core/popup/popup.service';
import { TranslateService } from '@ngx-translate/core';
import { ActionService } from '@shared/service/action.service';
import { LocationService } from '@shared/service/location.service';
import { UtilService } from '@shared/service/util.service';
import { debounceTime } from 'rxjs/operators';
import * as dayjs from 'dayjs';
import { merge } from 'rxjs';
import { transition, trigger, useAnimation } from '@angular/animations';
import { fadeInAnimation } from '@shared/animations';

@Component({
  selector: 'app-people-report',
  templateUrl: './people-report.component.html',
  styleUrls: ['./people-report.component.scss'],
  animations: [
    trigger('fadeIn', [transition('void => *', useAnimation(fadeInAnimation))]),
  ],
})
export class PeopleReportComponent implements OnInit {
  filterForm: FormGroup;
  openFilter: boolean = this.utilService.isMobile() ? false : true;
  openSearch: boolean = this.utilService.isMobile() ? false : true;
  showLoading: boolean = true;

  reports: any = [];

  buildings: any = [];
  floors: any = [];

  today: any = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private popupService: PopupService,
    private locationService: LocationService,
    private actionService: ActionService,
    private translateService: TranslateService,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      startTime: [''],
      endTime: [''],
      buildingId: [''],
      floorId: [''],
      searchText: [''],
      page: 1,
      totalPage: 1,
    });

    this.startTime.setValue(new Date());
    this.endTime.setValue(new Date());

    this.getLockerReport();

    /* re-search actions */
    merge(
      this.startTime.valueChanges,
      this.endTime.valueChanges,
      this.buildingId.valueChanges,
      this.floorId.valueChanges
    ).subscribe(([startTime, endTime, buildingId, floorId]) => {
      /* clear page and transactions */
      this.page.setValue(1);
      this.reports = [];
      this.getLockerReport();
    });

    this.locationService.getLocations().subscribe(
      (response: any) => {
        this.buildings = response.locations;
      },
      (error) => {}
    );

    /* search action */
    this.searchText.valueChanges
      .pipe(debounceTime(300))
      .subscribe((searchText) => {
        this.search();
      });

    /* select building -> get floor */
    this.buildingId.valueChanges.subscribe((buildingId) => {
      this.floorId.setValue('');
      this.floors = [];
      if (buildingId) {
        this.locationService.getBuildingById(buildingId).subscribe(
          (response: any) => {
            this.floors = response.locations.floors;
          },
          (error) => {}
        );
      }
    });
  }

  getLockerReport() {
    this.showLoading = true;
    const params = {
      start_time: dayjs(this.startTime.value)
        .startOf('day')
        .format('YYYYMMDDHHmmss'),
      end_time: dayjs(this.endTime.value).endOf('day').format('YYYYMMDDHHmmss'),
      building_id: this.buildingId.value,
      floor_id: this.floorId.value,
      keyword: this.searchText.value,
      page: this.page.value,
    };

    // this.actionService.getActions(params).subscribe(
    //   (response: any) => {
    //     this.transactions = [...this.transactions, ...response.actions];
    //     this.page.setValue(response.page);
    //     this.totalPage.setValue(response.totalPage);
    //     this.showLoading = false;
    //   },
    //   (error) => {
    //     this.showLoading = false;
    //   }
    // );

    this.showLoading = false;
  }

  search() {
    this.page.setValue(1);
    this.reports = [];
    this.getLockerReport();
  }

  export() {}

  onScroll() {
    if (this.page.value < this.totalPage.value) {
      /* not last page -> fetch next page */
      this.page.setValue(this.page.value + 1);
      this.getLockerReport();
    }
  }

  get page() {
    return this.filterForm.get('page');
  }

  get totalPage() {
    return this.filterForm.get('totalPage');
  }

  get startTime() {
    return this.filterForm.get('startTime');
  }

  get endTime() {
    return this.filterForm.get('endTime');
  }

  get buildingId() {
    return this.filterForm.get('buildingId');
  }

  get floorId() {
    return this.filterForm.get('floorId');
  }

  get searchText() {
    return this.filterForm.get('searchText');
  }
}
