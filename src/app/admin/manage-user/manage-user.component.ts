import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
  useAnimation,
} from '@angular/animations';
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
import { CustomValidators } from '@shared/custom.validators';
import { LocationService } from '@shared/service/location.service';
import { UserService } from '@shared/service/user.service';
import { UtilService } from '@shared/service/util.service';
import { Subject } from 'rxjs';
import { debounceTime, filter, takeUntil,take } from 'rxjs/operators';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss'],
  animations: [
    trigger('fade', [transition('* => *', [useAnimation(fadeAnimation)])]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeInAnimation))]),
  ],
})
export class ManageUserComponent implements OnInit {
  openFilter: boolean = this.utilService.isMobile() ? false : true;
  showLoading: boolean = true;

  filterForm: FormGroup;
  userForm: FormGroup;

  users: any = [];

  @ViewChild('userFile', { static: true })
  userFileElem: ElementRef;
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private locationService: LocationService,
    private popupService: PopupService,
    private userService: UserService,
    private translateService: TranslateService,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      searchText: [''],
      page: 1,
      totalPage: 1,
    });

    this.getUsers();
    this.router.events
      .pipe(
        filter((event: RouterEvent) => event instanceof NavigationEnd),
        takeUntil(this.unsubscribe)
      )
      .subscribe(() => {
        this.page.setValue(1);
        this.getUsers();
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

  getUsers() {
    this.showLoading = true;
    const params = {
      keyword: this.searchText.value,
      page: this.page.value,
    };

    if (params.page === 1) {
      this.users = [];
    }

    this.userService.getUsers(params).subscribe(
      (response: any) => {
        this.users = [...this.users, ...response.users];
        this.page.setValue(response.page);
        this.totalPage.setValue(response.totalPage);
        this.showLoading = false;
      },
      (error) => {
        this.showLoading = false;
      }
    );
  }

  createUser() {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  updateUser(userId: string) {
    this.router.navigate(['update/' + userId], { relativeTo: this.route });
  }

  detailUser(userId: string) {
    this.router.navigate(['detail/' + userId], { relativeTo: this.route });
  }

  deleteUser(user: any) {
    this.popupService
      .openModal({
        type: 'confirm',
        class: 'danger',
        header: 'Delete Locker',
        content: 'You want to delete ' + user.name + ' ?',
      })
      .subscribe((result) => {
        if (result) {
          this.userService.deleteUser(user.id).subscribe(
            (reponse) => {
              this.popupService.openModal({
                type: 'notification',
                class: 'success',
                header: this.translateService.instant('modal.success'),
                content: user.name + ' was deleted',
              });
              /* Remove user with out getUsers */
              this.users = this.users.filter(
                (allUser) => allUser.id !== user.id
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

  changePassword(userId: string) {
    this.router.navigate(['change-password/' + userId], {
      relativeTo: this.route,
    });
  }

  search() {
    this.page.setValue(1);
    this.users = [];
    this.getUsers();
  }

  onScroll() {
    if (this.page.value < this.totalPage.value) {
      /* not last page -> fetch next page */
      this.page.setValue(this.page.value + 1);
      this.getUsers();
    }
  }

  downloadTemplate(): void {
    this.userService
      .downloadTemplateUser()
      .pipe(take(1))
      .subscribe(
        (response: any) => {
          const fileName = `import_user_template.csv`;
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

  uploadUserFile(event: any) {
    this.userService
      .importUsers(event.target.files[0])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response: any) => {
          if (response.ok) {
            this.popupService.openModal({
              type: 'notification',
              btnClass: 'btn-primary',
              header: this.translateService.instant('modal.success'),
              content: this.translateService.instant('user.updated'),
            })
            this.getUsers();
          }
        },
        (error: any) => {
        this.popupService.openModal({
          type: 'notification',
          class: 'danger',
          header: this.translateService.instant('modal.fail'),
          content: error.error.info,
        });
        
      })
      .add((data: any) => {
        this.userFileElem.nativeElement.value = '';
      });
      
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
