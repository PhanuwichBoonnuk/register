import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditPanelComponent } from './create-edit-panel.component';

describe('CreateEditPanelComponent', () => {
  let component: CreateEditPanelComponent;
  let fixture: ComponentFixture<CreateEditPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEditPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
