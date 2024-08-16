import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditLockerGroupComponent } from './create-edit-locker-group.component';

describe('CreateEditLockerGroupComponent', () => {
  let component: CreateEditLockerGroupComponent;
  let fixture: ComponentFixture<CreateEditLockerGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEditLockerGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditLockerGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
