import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLockerGroupComponent } from './add-locker-group.component';

describe('AddLockerGroupComponent', () => {
  let component: AddLockerGroupComponent;
  let fixture: ComponentFixture<AddLockerGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLockerGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLockerGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
