import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloclUIComponents } from './block-ui.component';

describe('LoginComponent', () => {
  let component: BloclUIComponents;
  let fixture: ComponentFixture<BloclUIComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BloclUIComponents ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BloclUIComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
