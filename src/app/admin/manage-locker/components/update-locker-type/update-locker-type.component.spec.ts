import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLockerTypeComponent } from './update-locker-type.component';

describe('UpdateLockerTypeComponent', () => {
  let component: UpdateLockerTypeComponent;
  let fixture: ComponentFixture<UpdateLockerTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateLockerTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateLockerTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
