import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditLockerComponent } from './create-edit-locker.component';

describe('CreateEditLockerComponent', () => {
  let component: CreateEditLockerComponent;
  let fixture: ComponentFixture<CreateEditLockerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEditLockerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditLockerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
