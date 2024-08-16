import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePanelComponent } from './manage-panel.component';

describe('ManagePanelComponent', () => {
  let component: ManagePanelComponent;
  let fixture: ComponentFixture<ManagePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagePanelComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
