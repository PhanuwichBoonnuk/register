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
import { TranslateService } from '@ngx-translate/core';
import { fadeAnimation, fadeInAnimation } from '@shared/animations';
import { UserService } from '@shared/service/user.service';
import { UtilService } from '@shared/service/util.service';
import { Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-manage-ban',
  templateUrl: './manage-ban.component.html',
  styleUrls: ['./manage-ban.component.scss'],
  animations: [
    trigger('fadeIn', [transition('void => *', useAnimation(fadeInAnimation))]),
  ],
})
export class ManageBanComponent implements OnInit {
  openFilter: boolean = this.utilService.isMobile() ? false : true;
  filterForm: FormGroup;
  userForm: FormGroup;
  showLoading: boolean = true;

  users: any = [{ id: '001', name: 'pawaty', email: 'pawat@exzyteam.com' }];

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userService: UserService,
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

    this.getBannedUsers();
    this.router.events
      .pipe(
        filter((event: RouterEvent) => event instanceof NavigationEnd),
        takeUntil(this.unsubscribe)
      )
      .subscribe(() => {
        this.page.setValue(1);
        this.getBannedUsers();
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

  getBannedUsers() {
    this.showLoading = true;
    const params = {
      keyword: this.searchText.value,
      page: this.page.value,
    };

    if (params.page === 1) {
      this.users = [];
    }

    this.userService.getBanUsers(params).subscribe(
      (response: any) => {
        this.users = response.users;
        this.page.setValue(response.page);
        this.totalPage.setValue(response.totalPage);
        this.showLoading = false;
      },
      (error) => {
        this.showLoading = false;
      }
    );
  }

  banUser() {
    this.router.navigate(['ban'], { relativeTo: this.route });
  }

  unbanUser(user: any) {
    this.popupService
      .openModal({
        type: 'confirm',
        class: 'warning',
        header: 'Lift Ban',
        content: 'You want to lift ban from ' + user.name + ' ?',
      })
      .subscribe((result) => {
        if (result) {
          this.userService.unbanUser(user.id, {}).subscribe(
            (reponse) => {
              this.popupService.openModal({
                type: 'notification',
                class: 'success',
                header: this.translateService.instant('modal.success'),
                content: user.name + ' ban was lifted',
              });
              this.getBannedUsers();
            },
            (error) => {
              this.popupService.openModal({
                type: 'notification',
                class: 'danger',
                header: this.translateService.instant('modal.fail'),
                content: error.error.info,
              });
              this.getBannedUsers();
            }
          );
        }
      });
  }

  search() {
    this.page.setValue(1);
    this.users = [];
    this.getBannedUsers();
  }

  onScroll() {
    if (this.page.value < this.totalPage.value) {
      /* not last page -> fetch next page */
      this.page.setValue(this.page.value + 1);
      this.getBannedUsers();
    }
  }

  get searchText() {
    return this.filterForm.get('searchText');
  }

  get page() {
    return this.filterForm.get('page');
  }

  get totalPage() {
    return this.filterForm.get('totalPage');
  }
}
