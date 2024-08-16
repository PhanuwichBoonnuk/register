import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendEmailToAdminComponent } from './send-email-to-admin.component';

describe('SendEmailToAdminComponent', () => {
  let component: SendEmailToAdminComponent;
  let fixture: ComponentFixture<SendEmailToAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendEmailToAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendEmailToAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
