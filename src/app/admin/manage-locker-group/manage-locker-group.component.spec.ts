import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLockerGroupComponent } from './manage-locker-group.component';

describe('ManageLockerGroupComponent', () => {
  let component: ManageLockerGroupComponent;
  let fixture: ComponentFixture<ManageLockerGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageLockerGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageLockerGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
