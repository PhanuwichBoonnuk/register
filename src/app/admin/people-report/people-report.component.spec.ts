import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleReportComponent } from './people-report.component';

describe('PeopleReportComponent', () => {
  let component: PeopleReportComponent;
  let fixture: ComponentFixture<PeopleReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeopleReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
