import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLockerComponent } from './manage-locker.component';

describe('ManageLockerComponent', () => {
  let component: ManageLockerComponent;
  let fixture: ComponentFixture<ManageLockerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageLockerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageLockerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
