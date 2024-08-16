import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
} from '@angular/router';
import { PopupService } from '@core/popup/popup.service';
import { TranslateService } from '@ngx-translate/core';
import { fadeAnimation, fadeInAnimation } from '@shared/animations';
import { CardService } from '@shared/service/card.service';
import { UtilService } from '@shared/service/util.service';
import { Subject } from 'rxjs';
import { debounceTime, filter, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-manage-card',
  templateUrl: './manage-card.component.html',
  styleUrls: ['./manage-card.component.scss'],
  animations: [
    trigger('fade', [transition('* => *', [useAnimation(fadeAnimation)])]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeInAnimation))]),
  ],
})
export class ManageCardComponent implements OnInit {
  openFilter: boolean = this.utilService.isMobile() ? false : true;
  filterForm: FormGroup;
  userForm: FormGroup;
  showLoading: boolean = true;

  cards: any = [];
  @ViewChild('cardFile', { static: true })
  cardFileElem: ElementRef;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cardService: CardService,
    private popupService: PopupService,
    private translateService: TranslateService,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      searchText: [''],
      page: 1,
      totalPage: 1,
    });

    this.getCards();
    this.router.events
      .pipe(
        filter((event: RouterEvent) => event instanceof NavigationEnd),
        takeUntil(this.unsubscribe)
      )
      .subscribe(() => {
        this.page.setValue(1);
        this.getCards();
      });

    this.searchText.valueChanges
      .pipe(debounceTime(300))
      .subscribe((searchText) => {
        this.search();
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getCards() {
    this.showLoading = true;
    const params = {
      keyword: this.searchText.value,
      page: this.page.value,
    };

    if (params.page === 1) {
      this.cards = [];
    }

    this.cardService.getCards(params).subscribe(
      (response: any) => {
        this.cards = [...this.cards, ...response.cards];
        this.page.setValue(response.page);
        this.totalPage.setValue(response.totalPage);
        this.showLoading = false;
      },
      (error) => {
        this.showLoading = false;
      }
    );
  }

  createCard() {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  updateCard(cardId: string) {
    this.router.navigate(['update/' + cardId], { relativeTo: this.route });
  }

  deleteCard(card: any) {
    this.popupService
      .openModal({
        type: 'confirm',
        class: 'danger',
        header: 'Delete Card',
        content: 'You want to card ' + card.name + ' ?',
      })
      .subscribe((result) => {
        if (result) {
          this.cardService.deleteCard(card.cardId).subscribe(
            (reponse) => {
              this.popupService.openModal({
                type: 'notification',
                class: 'success',
                header: this.translateService.instant('modal.success'),
                content: card.name + ' was deleted',
              });
              /* Remove card with out getCards */
              this.cards = this.cards.filter(
                (allCard) => allCard.cardId !== card.cardId
              );
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

  search() {
    this.page.setValue(1);
    this.cards = [];
    this.getCards();
  }

  onScroll() {
    if (this.page.value < this.totalPage.value) {
      /* not last page -> fetch next page */
      this.page.setValue(this.page.value + 1);
      this.getCards();
    }
  }


  downloadTemplate(): void {
    this.cardService
      .downloadTemplateCard()
      .pipe(take(1))
      .subscribe(
        (response: any) => {
          const fileName = `import_card_template.csv`;
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(response, fileName);
          } else {
            const url = window.URL.createObjectURL(response);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display: none');
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
          }
        },
        (error: any) => {}
      );
  }
  

  uploadCardFile(event: any) {
    this.cardService
      .importCards(event.target.files[0])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((response: any) => {
        if (response.ok) {
          this.popupService.openModal({
            type: 'notification',
            btnClass: 'btn-primary',
            header: this.translateService.instant('modal.success'),
            content: this.translateService.instant('card.updated'),
          });
          this.search();
        }
      }, (error: any) => {
        this.popupService.openModal({
          type: 'notification',
          class: 'danger',
          header: this.translateService.instant('modal.fail'),
          content: error.error.info,
        });
      })
      .add((data: any) => {
        this.cardFileElem.nativeElement.value = '';
      })
  }

  get page() {
    return this.filterForm.get('page');
  }

  get totalPage() {
    return this.filterForm.get('totalPage');
  }

  get searchText() {
    return this.filterForm.get('searchText');
  }
}
