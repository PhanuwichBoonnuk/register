import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetOpenTimeComponent } from './set-open-time.component';

describe('SetOpenTimeComponent', () => {
  let component: SetOpenTimeComponent;
  let fixture: ComponentFixture<SetOpenTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetOpenTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetOpenTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
