import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupService } from '@core/popup/popup.service';
import { TranslateService } from '@ngx-translate/core';
import { PanelService } from '@shared/service/panel.service';

@Component({
  selector: 'app-panel-setting',
  templateUrl: './panel-setting.component.html',
  styleUrls: ['./panel-setting.component.scss'],
})
export class PanelSettingComponent implements OnInit {
  panelId;
  panelForm: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private popupService: PopupService,
    private panelService: PanelService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.panelForm = this.formBuilder.group({
      name: [''],
      logo: [''],
      background: [''],
      defaultLanguage: [''],
      welcome: [''],
      forgotPinText: [''],
      company: [''],
      qrCode: [false],
      rfIdCard: [false],
      faceScan: [false],
    });

    this.panelId = this.route.snapshot.paramMap.get('panelId');

    if (this.panelId) {
      this.panelService.getPanelById(this.panelId).subscribe(
        (response: any) => {
          this.panelForm.patchValue(response.panel);
        },
        (error) => {}
      );
    }
  }

  reset() {
    this.popupService
      .openModal({
        type: 'confirm',
        class: 'danger',
        header: 'Reset Panel Setting',
        content:
          'You want to reset ' + this.name.value + ' to default setting ?',
      })
      .subscribe((result) => {
        if (result) {
          this.panelService.getPanelById('default').subscribe(
            (response: any) => {
              this.panelForm.patchValue(response.panel);
            },
            (error) => {}
          );
        }
      });
  }

  update() {
    Object.keys(this.panelForm.controls).map((key) => {
      this.panelForm.get(key).markAsTouched();
    });
    if (this.panelForm.invalid) {
      return;
    }

    this.panelService.updatePanel(this.panelId, this.panelForm.value).subscribe(
      (response) => {
        this.popupService.openModal({
          type: 'notification',
          class: 'success',
          header: 'Setting Updated',
          content: this.name.value + 'setting was updated.',
        });
        this.cancel();
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

  cancel() {
    this.router.navigate(['.'], { relativeTo: this.route.parent });
  }

  setLogo(imageUrl) {
    this.logo.setValue(imageUrl);
  }

  setBackground(imageUrl) {
    this.background.setValue(imageUrl);
  }

  get name() {
    return this.panelForm.get('name');
  }

  get logo() {
    return this.panelForm.get('logo');
  }

  get background() {
    return this.panelForm.get('background');
  }

  get defaultLanguage() {
    return this.panelForm.get('defaultLanguage');
  }

  get welcome() {
    return this.panelForm.get('welcome');
  }

  get forgotPinText() {
    return this.panelForm.get('forgotPinText');
  }

  get company() {
    return this.panelForm.get('company');
  }

  get qrCode() {
    return this.panelForm.get('qrCode');
  }

  get rfIdCard() {
    return this.panelForm.get('rfIdCard');
  }

  get faceScan() {
    return this.panelForm.get('faceScan');
  }
}
