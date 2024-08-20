import { ComponentFixture, TestBed } from '@angular/core/testing';

import { footerComponents } from './footer.component';

describe('LoginComponent', () => {
  let component: footerComponents;
  let fixture: ComponentFixture<footerComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ footerComponents ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(footerComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
