import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreRegisterComponents } from './pre-register.component';

describe('LoginComponent', () => {
  let component: PreRegisterComponents;
  let fixture: ComponentFixture<PreRegisterComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreRegisterComponents ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreRegisterComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
