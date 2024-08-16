import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupService } from '@core/popup/popup.service';
import { TranslateService } from '@ngx-translate/core';
import { LocationService } from '@shared/service/location.service';
import { ManageLockerGroupService } from '../../manage-locker-group.service';
import * as dayjs from 'dayjs';

@Component({
    selector: 'app-set-open-time',
    templateUrl: './set-open-time.component.html',
    styleUrls: ['./set-open-time.component.scss'],
})
export class SetOpenTimeComponent implements OnInit {
    timeForm: FormGroup;
    lockerGroupId;
    loading: boolean = false;
    repeatTimeDefault = dayjs().hour(0).minute(0).format();

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private locationService: LocationService,
        private popupService: PopupService,
        private translateService: TranslateService,
        private manageLockerGroupService: ManageLockerGroupService
    ) { }

    ngOnInit(): void {
        this.timeForm = this.formBuilder.group({
            repeat: [false, Validators.required],
            repeatTime: [
                { value: this.repeatTimeDefault, disabled: true },
                Validators.required,
            ],
            repeatType: [{ value: '', disabled: true }, Validators.required],
        });

        this.lockerGroupId = this.route.snapshot.paramMap.get('lockerGroupId');

        if (this.lockerGroupId) {
            this.manageLockerGroupService
                .getLockerGroupById(this.lockerGroupId)
                .subscribe(
                    (response: any) => {
                        /* set repeat */
                        this.repeat.setValue(response.lockergroup.repeat ? true : false);
                        /* set repeatTime */
                        let time = dayjs()
                            .hour(response.lockergroup.repeatTime.split(':')[0])
                            .minute(response.lockergroup.repeatTime.split(':')[1])
                            .format();
                        this.repeatTime.setValue(time);
                        /* set repeatType */
                        this.repeatType.setValue(response.lockergroup.repeatType);
                    },
                    (error) => { }
                );
        }

        this.repeat.valueChanges.subscribe((repeat) => {
            if (repeat) {
                this.timeForm.controls['repeatTime'].enable();
                this.timeForm.controls['repeatType'].enable();
            } else {
                this.timeForm.controls['repeatTime'].disable();
                this.timeForm.controls['repeatType'].disable();
                this.repeatTime.setValue(this.repeatTimeDefault);
                this.repeatType.setValue('');
            }
        });
    
        
        setTimeout(() => {
            this.loading = true;
        }, 1000);
    }

    update() {
        Object.keys(this.timeForm.controls).map((key) => {
            this.timeForm.get(key).markAsTouched();
        });
        if (this.timeForm.invalid) {
            return;
        }

        this.manageLockerGroupService
            .updateLockerGroupSchedule(this.lockerGroupId, {
                ...this.timeForm.value,
                repeatTime: dayjs(this.repeatTime.value).format('HH:mm'),
            })
            .subscribe(
                (response: any) => {
                    this.popupService.openModal({
                        type: 'notification',
                        class: 'success',
                        header: this.translateService.instant('modal.success'),
                        content: 'Unlock time was updated.',
                    });
                    this.cancel();
                },
                (error) => { }
            );
    }

    cancel() {
        this.router.navigate(['.'], { relativeTo: this.route.parent });
    }

    get repeat() {
        return this.timeForm.get('repeat');
    }

    get repeatTime() {
        return this.timeForm.get('repeatTime');
    }

    get repeatType() {
        return this.timeForm.get('repeatType');
    }
}
