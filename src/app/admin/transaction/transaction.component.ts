import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActionService } from '@shared/service/action.service';
import { LocationService } from '@shared/service/location.service';
import { merge } from 'rxjs';
import * as dayjs from 'dayjs';
import { UtilService } from '@shared/service/util.service';
import { debounceTime } from 'rxjs/operators';
import { transition, trigger, useAnimation } from '@angular/animations';
import { fadeInAnimation } from '@shared/animations';
import { ReportService } from '@shared/service/report.service';
import { AppConfig } from '@config';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
  animations: [
    trigger('fadeIn', [transition('void => *', useAnimation(fadeInAnimation))]),
  ],
})
export class TransactionComponent implements OnInit {
  filterForm: FormGroup;
  openFilter: boolean = this.utilService.isMobile() ? false : true;
  openSearch: boolean = this.utilService.isMobile() ? false : true;
  showLoading: boolean = true;
  transactions: any = [];
  buildings: any = [];
  floors: any = [];

  today: any = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private actionService: ActionService,
    private utilService: UtilService,
    private reportService: ReportService,
    private config: AppConfig,
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

    this.getActions();

    /* re-search actions */
    merge(
      this.startTime.valueChanges,
      this.endTime.valueChanges,
      this.buildingId.valueChanges,
      this.floorId.valueChanges
    ).subscribe((data) => {
      if (data && data[0] === 'b') {
        /* select building -> get floor */
        this.floorId.setValue('', { emitEvent: false });
        this.floors = [];
        if (data) {
          this.locationService.getBuildingById(data).subscribe(
            (response: any) => {
              this.floors = response.locations.floors;
            },
            (error) => {}
          );
        }
      }
      /* clear page and transactions */
      this.search();
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

    this.buildingId.valueChanges.subscribe((buildingId) => {});
  }

  getActions() {
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

    this.actionService.getActions(params).subscribe(
      (response: any) => {
        let responseActions;
        if(response && response.actions && response.actions.length > 0){
            // console.warn("response",response.actions);
            const formatDateResponseExpiredOn = this.config.getConfig('timeFormatForShowExpireDateLocker') || "YYYY-MM-DD HH:mm:ss";
            // responseExpiredOn คือ format ที่ได้มาจาด response
            const responseExpiredOn = "YYYY-MM-DD HH:mm:ss"
            const isValidFormat = responseExpiredOn === formatDateResponseExpiredOn;
            if(isValidFormat){
                // console.log("match");
                responseActions = response.actions;
            }else{
                // console.log("not match");
                responseActions = this.convertDateFormat(response.actions,formatDateResponseExpiredOn);
            }
        }else{
            responseActions = response.actions;
        }
        this.transactions = [...this.transactions, ...responseActions];
        this.page.setValue(response.page, { emitEvent: false });
        this.totalPage.setValue(response.totalPage, { emitEvent: false });
        this.showLoading = false;
      },
      (error) => {
        this.showLoading = false;
      }
    );
  }

  search() {
    this.page.setValue(1, { emitEvent: false });
    this.transactions = [];
    this.getActions();
  }

  export() {
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

    this.reportService.getTransactionReport(params).subscribe(
      (response: any) => {
        const fileName =
          'Dashboard ' +
          dayjs(this.startTime.value, 'YYYYMMDD').format('DD MMM YYYY') +
          ' - ' +
          dayjs(this.endTime.value, 'YYYYMMDD').format('DD MMM YYYY') +
          '.xlsx';

        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        this.showLoading = false;
      },
      (error) => {
        this.showLoading = false;
      }
    );
  }

  onScroll() {
    if (this.page.value < this.totalPage.value) {
      /* not last page -> fetch next page */
      this.page.setValue(this.page.value + 1);
      this.getActions();
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
  convertDateFormat(response, timeFormat) {
    let valueTimeFormat = timeFormat || "DD/MM/YYYY HH:mm:ss";
    try {
        if (response && Array.isArray(response)) {
            const convertDateMap = response.map(item => {
                if (item) {
                    if(!item.expiredOn || item.expiredOn == "-") {
                        item.expiredOn = "-"
                    }else{
                        item.expiredOn = dayjs(item.expiredOn).format(valueTimeFormat);
                    } 
                    return item;
                } else {
                    return null; 
                }
            }); 
            // console.log("convertDateMap",convertDateMap);
            return  convertDateMap;
        } else {
            return [];
        }
    } catch (error) {
        console.log("Error:", error);
        return [];
    }
}

}
