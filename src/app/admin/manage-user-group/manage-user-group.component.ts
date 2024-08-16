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
import { fadeAnimation } from '@shared/animations';
import { UserGroupService } from '@shared/service/user-group.service';
import { UtilService } from '@shared/service/util.service';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-manage-user-group',
  templateUrl: './manage-user-group.component.html',
  styleUrls: ['./manage-user-group.component.scss'],
  animations: [
    trigger('fade', [transition('* => *', [useAnimation(fadeAnimation)])]),
  ],
})
export class ManageUserGroupComponent implements OnInit {
  openFilter: boolean = this.utilService.isMobile() ? false : true;
  filterForm: FormGroup;

  userGroups: any = [];

  sort = { order: 'asc', property: 'name' };

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private popupService: PopupService,
    private userGroupService: UserGroupService,
    private translateService: TranslateService,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      searchText: [''],
    });

    this.getUserGroups();
    this.router.events
      .pipe(
        filter((event: RouterEvent) => event instanceof NavigationEnd),
        takeUntil(this.unsubscribe)
      )
      .subscribe(() => {
        this.getUserGroups();
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getUserGroups() {
    this.userGroupService.getUserGroups().subscribe(
      (response: any) => {
        this.userGroups = response.groups;
      },
      (error) => {}
    );
  }

  createUserGroup() {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  updateUserGroup(userGroupId) {
    this.router.navigate(['update/' + userGroupId], { relativeTo: this.route });
  }

  deleteUserGroup(userGroup) {
    this.popupService
      .openModal({
        type: 'confirm',
        class: 'danger',
        header: 'Delete User Group',
        content: 'You want to delete ' + userGroup.name + ' ?',
      })
      .subscribe((result) => {
        if (result) {
          this.userGroupService.deleteUserGroup(userGroup.id).subscribe(
            (response: any) => {
              this.popupService.openModal({
                type: 'notification',
                class: 'success',
                header: this.translateService.instant('modal.success'),
                content: userGroup.name + ' was deleted.',
              });
              this.getUserGroups();
            },
            (error) => {
              this.popupService.openModal({
                type: 'notification',
                class: 'danger',
                header: this.translateService.instant('modal.fail'),
                content: error.error.info,
              });
              this.getUserGroups();
            }
          );
        }
      });
  }

  addLockerGroupToUserGroup(userGroupId) {
    this.router.navigate(['/admin/manage-user-group/add/' + userGroupId]);
  }

  changeSort(property) {
    this.sort = {
      order:
        property === this.sort.property
          ? this.sort.order === 'asc'
            ? 'desc'
            : 'asc'
          : 'asc',
      property: property,
    };
  }

  get searchText() {
    return this.filterForm.get('searchText');
  }
}
