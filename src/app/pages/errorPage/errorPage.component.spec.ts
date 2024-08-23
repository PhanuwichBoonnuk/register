import { ComponentFixture, TestBed } from '@angular/core/testing';

import { errorPageComponents } from './errorPage.component';

describe('LoginComponent', () => {
  let component: errorPageComponents;
  let fixture: ComponentFixture<errorPageComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ errorPageComponents ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(errorPageComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
