import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockerReportComponent } from './locker-report.component';

describe('LockerReportComponent', () => {
  let component: LockerReportComponent;
  let fixture: ComponentFixture<LockerReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LockerReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LockerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
