import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupService } from '@core/popup/popup.service';
import { TranslateService } from '@ngx-translate/core';
import { CustomValidators } from '@shared/custom.validators';
import { CardService } from '@shared/service/card.service';

@Component({
  selector: 'app-create-edit-card',
  templateUrl: './create-edit-card.component.html',
  styleUrls: ['./create-edit-card.component.scss'],
})
export class CreateEditCardComponent implements OnInit {
  cardForm: FormGroup;
  cardId;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private popupService: PopupService,
    private translateService: TranslateService,
    private cardService: CardService
  ) {}

  ngOnInit(): void {
    this.cardForm = this.formBuilder.group({
      cardId: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, CustomValidators.emailPattern]],
    });

    /*
      NOTE: Only SuperAdmin can update building, floor, zone, group, cu, relay
    */
    // this.profile$ = this.authStore.select(userSelector);

    this.cardId = this.route.snapshot.paramMap.get('cardId');

    if (this.cardId) {
      this.cardService.getCardById(this.cardId).subscribe(
        (response: any) => {
          this.cardForm.patchValue(response.card);
        },
        (error) => {}
      );
    }
  }

  create() {
    Object.keys(this.cardForm.controls).map((key) => {
      this.cardForm.get(key).markAsTouched();
    });
    if (this.cardForm.invalid) {
      return;
    }

    this.cardService.createCard(this.cardForm.value).subscribe(
      (response) => {
        this.popupService.openModal({
          type: 'notification',
          class: 'success',
          header: 'Card Created',
          content: this.name.value + ' was created.',
        });
        this.cancel();
      }
    );
  }

  update() {
    Object.keys(this.cardForm.controls).map((key) => {
      this.cardForm.get(key).markAsTouched();
    });
    if (this.cardForm.invalid) {
      return;
    }

    this.cardService.updateCard(this.cardId, this.cardForm.value).subscribe(
      (response) => {
        this.popupService.openModal({
          type: 'notification',
          class: 'success',
          header: 'Card Updated',
          content: this.id.value + ' was updated.',
        });
        this.cancel();
      }
    );
  }

  cancel() {
    this.router.navigate(['.'], { relativeTo: this.route.parent });
  }

  get id() {
    return this.cardForm.get('cardId');
  }

  get name() {
    return this.cardForm.get('name');
  }

  get email() {
    return this.cardForm.get('email');
  }
}
