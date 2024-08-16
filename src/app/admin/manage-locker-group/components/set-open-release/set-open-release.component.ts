import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupService } from '@core/popup/popup.service';
import { TranslateService } from '@ngx-translate/core';
import { ManageLockerGroupService } from '../../manage-locker-group.service';
import { HttpCustom } from '@core/http-custom';

@Component({
    selector: 'app-set-open-release',
    templateUrl: './set-open-release.component.html',
    styleUrls: ['./set-open-release.component.scss'],
})
export class SetOpenAutoReleaseComponent implements OnInit {
    timeForm: FormGroup;
    lockerGroupForm: FormGroup;
    lockerGroupId;
    ngmodel_AutoReleaseLockers;
    ngmodel_SendReminderEmail;
    loading: boolean = false;
    maxMinConfigTime = {
        maxHours: 744,
        maxMinutes: 59
    }
    lockerGroups: any = [];
    
    constructor(
        private http: HttpCustom,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private popupService: PopupService,
        private translateService: TranslateService,
        private manageLockerGroupService: ManageLockerGroupService,
    ) { }

    async ngOnInit(): Promise<void> {
        // สร้าง Form Controller สำหรับตรวจสอบข้อมูลในแต่ละ field ใน Form Controller
        this.timeForm = this.formBuilder.group({
            hours: [0, [Validators.required, Validators.min(0), Validators.max(this.maxMinConfigTime.maxHours)]],
            minutes: [0, [Validators.required, Validators.min(0), Validators.max(this.maxMinConfigTime.maxMinutes)]],
            reminderHours: [0, [Validators.required, Validators.min(0), Validators.max(this.maxMinConfigTime.maxHours)]],
            reminderMinutes: [0, [Validators.required, Validators.min(0), Validators.max(this.maxMinConfigTime.maxMinutes)]],
        });
        await this.getDataConfig();
        
    }

    // ! START check validate

    validateHours(value: any) {
        let hours = parseInt(value, 10);
        if (isNaN(hours) || hours < 0 || hours > this.maxMinConfigTime.maxHours) {
            hours = 0;
        }
        if(hours == this.maxMinConfigTime.maxHours){
            const minutes = 0;
            this.timeForm.get('minutes')?.setValue(minutes, { emitEvent: false });
        }
        this.timeForm.get('hours')?.setValue(hours, { emitEvent: false });
    }

    validateMinutes(value: any) {
        let minutes = parseInt(value, 10);
    if (isNaN(minutes) || minutes < 0 || minutes > this.maxMinConfigTime.maxMinutes) {
        minutes = 0;
    }
    const currentHours = this.timeForm.get('hours')?.value;
    if (currentHours === this.maxMinConfigTime.maxHours) {
        minutes = 0;  
    }
    this.timeForm.get('minutes')?.setValue(minutes, { emitEvent: false });
    }

    validateReminderHours(value: any) {
        let hours = parseInt(value, 10);
        if (isNaN(hours) || hours < 0 || hours > this.maxMinConfigTime.maxHours) {
            hours = 0;
        }
        if(hours == this.maxMinConfigTime.maxHours){
            const minutes = 0;
            this.timeForm.get('reminderMinutes')?.setValue(minutes, { emitEvent: false });
        }
        this.timeForm.get('reminderHours')?.setValue(hours, { emitEvent: false });
    }

    validateReminderMinutes(value: any) {
        let minutes = parseInt(value, 10);
        if (isNaN(minutes) || minutes < 0 || minutes > this.maxMinConfigTime.maxMinutes) {
            minutes = 0;
        }
        const currentHours = this.timeForm.get('reminderHours')?.value;
        if (currentHours === this.maxMinConfigTime.maxHours) {
        minutes = 0;  
        }

        this.timeForm.get('reminderMinutes')?.setValue(minutes, { emitEvent: false });
    }
    // ! END check validate


    async getDataConfig(): Promise<void> {
        try {
            this.timeForm = this.formBuilder.group({
                hours: [0, [Validators.required, Validators.min(0), Validators.max(this.maxMinConfigTime.maxHours)]],
                minutes: [0, [Validators.required, Validators.min(0), Validators.max(this.maxMinConfigTime.maxMinutes)]],
                reminderHours: [0, [Validators.required, Validators.min(0), Validators.max(this.maxMinConfigTime.maxHours)]],
                reminderMinutes: [0, [Validators.required, Validators.min(0), Validators.max(this.maxMinConfigTime.maxMinutes)]],
            });

            this.lockerGroupForm = this.formBuilder.group({
                maxBookingDuration: [''],
                reminderEmailOffset: ['']
            });

            this.lockerGroupId = this.route.snapshot.paramMap.get('lockerGroupId');
            if (this.lockerGroupId) {
                this.manageLockerGroupService.getLockerGroupById(this.lockerGroupId).subscribe(
                    (response: any) => {
                        this.lockerGroupForm.patchValue(response.lockergroup);
                        const autoReleaseLockerTime = this.lockerGroupForm.get('maxBookingDuration')?.value;
                        const sendReminderEmailTime = this.lockerGroupForm.get('reminderEmailOffset')?.value;
                        if (autoReleaseLockerTime && sendReminderEmailTime) {
                            const autoReleaseTimeParts = autoReleaseLockerTime.split(':');
                            const sendReminderEmailTimeParts = sendReminderEmailTime.split(':');
                            this.timeForm.patchValue({
                                hours: parseInt(autoReleaseTimeParts[0], 10),
                                minutes: parseInt(autoReleaseTimeParts[1], 10),
                                reminderHours: parseInt(sendReminderEmailTimeParts[0], 10),
                                reminderMinutes: parseInt(sendReminderEmailTimeParts[1], 10),
                            });
                        } else if(autoReleaseLockerTime && !sendReminderEmailTime){
                            const autoReleaseTimeParts = autoReleaseLockerTime.split(':');
                            this.timeForm.patchValue({
                                hours: parseInt(autoReleaseTimeParts[0], 10),
                                minutes: parseInt(autoReleaseTimeParts[1], 10),
                                reminderHours: 0,
                                reminderMinutes: 0,
                            });
                            
                        }else if(!autoReleaseLockerTime && sendReminderEmailTime){
                            const sendReminderEmailTimeParts = sendReminderEmailTime.split(':');
                            this.timeForm.patchValue({
                                hours: 0,
                                minutes: 0,
                                reminderHours: parseInt(sendReminderEmailTimeParts[0], 10),
                                reminderMinutes: parseInt(sendReminderEmailTimeParts[1], 10),
                            });
                        }
                        else{
                            this.timeForm.patchValue({
                                hours: 0,
                                minutes: 0,
                                reminderHours: 0,
                                reminderMinutes: 0,
                            });
                        }

                        this.timeForm.get('hours')?.valueChanges.subscribe(value => this.validateHours(value));
                        this.timeForm.get('minutes')?.valueChanges.subscribe(value => this.validateMinutes(value));
                        this.timeForm.get('reminderHours')?.valueChanges.subscribe(value => this.validateReminderHours(value));
                        this.timeForm.get('reminderMinutes')?.valueChanges.subscribe(value => this.validateReminderMinutes(value));

                        this.ngmodel_AutoReleaseLockers = autoReleaseLockerTime || '00:00';
                        this.ngmodel_SendReminderEmail = sendReminderEmailTime || '00:00';
                        this.loading = true;
                        
                    },
                    (error) => {
                        console.log(error);
                        this.loading = false;
                    }
                );
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    

    //! Save And Cancel
    
    async save(): Promise<void> {
        const returnFailPopup = (contentText: string = '') => {
            this.popupService.openModal({
                type: 'notification',
                class: 'danger',
                header: this.translateService.instant('modal.fail'),
                content: contentText,
            });
        };

        const returnSuccessPopup = (contentText: string = '') => {
            this.popupService.openModal({
                type: 'notification',
                class: 'success',
                header: this.translateService.instant('modal.success'),
                content: contentText,
            });
        };

        const convertToHHMM = (hours: number, minutes: number): string => {
            const hoursString = hours.toString();
            const minutesString = minutes.toString().padStart(2, '0');
            return `${hoursString}:${minutesString}`;
        };

        const autoReleaseTime = convertToHHMM(
            this.timeForm.get('hours')?.value,
            this.timeForm.get('minutes')?.value
        );
        const reminderEmailTime = convertToHHMM(
            this.timeForm.get('reminderHours')?.value,
            this.timeForm.get('reminderMinutes')?.value
        );

        const mapDataForInsertAndUpdate = async (autoReleaseTime: string, reminderEmailTime: string) => {
            const body = {
                maxBookingDuration: autoReleaseTime,
                reminderEmailOffset: reminderEmailTime
            };
            return body;
        };

        
        const callApiInsertOrEdit = async (data: any) => {
            try {
                const windowLocalUrl = window.location.href;
                const urlParts = windowLocalUrl.split('/');
                const lockerGroup = urlParts[urlParts.length - 1];
                const url = `/lockergroup/${lockerGroup}`;
                const response = await this.http.put(url, data).toPromise();
                return response;
            } catch (error) {
                console.log(error);
                return null;
            }
        };


        if (autoReleaseTime && reminderEmailTime) {
            // console.log('autoReleaseTime', autoReleaseTime);
            // console.log('reminderEmailTime', reminderEmailTime);
            const dataInsertAndUpdate = await mapDataForInsertAndUpdate(autoReleaseTime, reminderEmailTime);
            const responseApi : any = await callApiInsertOrEdit(dataInsertAndUpdate);
            if (responseApi && responseApi.status === 200 && responseApi.message === 'success') {
                returnSuccessPopup('');
            }else{
                returnFailPopup(responseApi.error.message);
            }
        } else {
            returnFailPopup();
        }
    }

    cancel(): void {
        this.router.navigate(['.'], { relativeTo: this.route.parent });
    }
}
