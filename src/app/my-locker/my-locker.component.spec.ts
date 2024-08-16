import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyLockerComponent } from './my-locker.component';

describe('MyLockerComponent', () => {
  let component: MyLockerComponent;
  let fixture: ComponentFixture<MyLockerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyLockerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyLockerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
