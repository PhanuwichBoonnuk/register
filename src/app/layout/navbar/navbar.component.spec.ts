import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponents } from './navbar.component';

describe('LoginComponent', () => {
  let component: NavbarComponents;
  let fixture: ComponentFixture<NavbarComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarComponents ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
