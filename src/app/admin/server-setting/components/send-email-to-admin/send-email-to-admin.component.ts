import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { HttpCustom } from '@core/http-custom';
import { PopupService } from '@core/popup/popup.service';

@Component({
  selector: 'app-send-email-to-admin',
  templateUrl: './send-email-to-admin.component.html',
  styleUrls: ['./send-email-to-admin.component.scss']
})
export class SendEmailToAdminComponent implements OnInit {

  listOfEmail = "";
  emailValid = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  isInValidEmail = false;
  isInValidEmailMsg = "";

  constructor(
    private translateService: TranslateService,
    private http: HttpCustom,
    private popupService: PopupService,
  ) { }

  ngOnInit(): void {
    this.onGettingData();
  }

  onGettingData() {

    let data = [];

    this.http.getData('/filters/manage/locker-admin').subscribe((res: any) => {
      if (res.data) {
        this.listOfEmail = res.data.join(',');
      }
    });

  }

  onUpdate() {

    this.isInValidEmail = false;
    this.isInValidEmailMsg = "";

    const emails = this.listOfEmail.split(',').map(el => el.trim()).filter(res => res !== '');

    let data = [];

    for (let email of emails) {
      if (!email.toLowerCase().match(this.emailValid)) {
        this.isInValidEmail = true;
        this.isInValidEmailMsg = this.translateService.instant('send-email-to-admin.errors.email-is-not-valid');
        break;
      }
      data.push(email);
    }

    if (!this.isInValidEmail) {
      this.http.postData('/filters/manage/locker-admin', { adminEmails: data }).subscribe(_ => {
        this.popupService.openModal({
          type: 'notification',
          class: 'success',
          header: this.translateService.instant('send-email-to-admin.title'),
          content: this.translateService.instant('send-email-to-admin.modals.updated'),
        });
      })
    }

  }


}
