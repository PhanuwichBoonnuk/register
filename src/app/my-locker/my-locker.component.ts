import {
    animate,
    query,
    style,
    transition,
    trigger,
    useAnimation,
} from '@angular/animations';
import * as dayjs from 'dayjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupService } from '@core/popup/popup.service';
import { TranslateService } from '@ngx-translate/core';
import { fadeAnimation } from '@shared/animations';
import { Observable } from 'rxjs';
import { MyLockerService } from './my-locker.service';
import { AppConfig } from '@config';

@Component({
    selector: 'app-my-locker',
    templateUrl: './my-locker.component.html',
    styleUrls: ['./my-locker.component.scss'],
    animations: [
        trigger('fade', [transition('* => *', [useAnimation(fadeAnimation)])]),
    ],
})
export class MyLockerComponent implements OnInit {
    privateLockers: any = [];
    shareLockers: any = [];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private myLockerService: MyLockerService,
        private popupService: PopupService,
        private translateService: TranslateService,
        private config: AppConfig,
    ) { }

    ngOnInit(): void {
        this.getMyLocker();
    }

    getMyLocker() {
        this.myLockerService.getMyLocker().subscribe(
            (response: any) => {
                this.privateLockers = response.lockers.privateLockers;
                if(response.lockers.shareLockers.length > 0) {
                    response.lockers.shareLockers[0].expiredOn  = this.convertDateFormat(response, this.config.getConfig('timeFormatForShowExpireDateLocker')), 
                    this.shareLockers = response.lockers.shareLockers;
                }
                },
            (error) => { }
        );
    }

    open(locker: any) {
        this.myLockerService.openLocker({ lockerId: locker.id }).subscribe(
            (response) => {
                this.getMyLocker();
                this.popupService.openModal({
                    type: 'notification',
                    class: 'success',
                    header: this.translateService.instant('modal.success'),
                    content: 'Locker ' + locker.name + ' Opened.',
                });
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

    return(locker: any) {
        this.popupService
            .openModal({
                type: 'confirm',
                class: 'warning',
                header: 'Return Locker',
                content: 'You want to return ' + locker.name + ' ?',
            })
            .subscribe((result) => {
                if (result) {
                    this.myLockerService.returnLocker({ lockerId: locker.id }).subscribe(
                        (response) => {
                            this.getMyLocker();
                            this.popupService.openModal({
                                type: 'notification',
                                class: 'success',
                                header: this.translateService.instant('modal.success'),
                                content: 'Locker ' + locker.name + ' Returned.',
                            });
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
            });
    }

    openMyQr() {
        this.router.navigate(['/my-locker/qr']);
    }

    convertDateFormat(response, timeFormat) {
        let valueTimeFormat = timeFormat;
        if (!valueTimeFormat) valueTimeFormat = "DD/MM/YYYY HH:mm:ss"
        try {
            if (response && response.lockers && response.lockers.shareLockers[0]) {
                let expiredOn = response.lockers.shareLockers[0].expiredOn;
                let formattedEndTime = dayjs(expiredOn).format(valueTimeFormat);
                return formattedEndTime;
            }else{
                return
            }
        } catch (error) {
            console.log(error);
        }
    }
}
