import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBanComponent } from './manage-ban.component';

describe('ManageBanComponent', () => {
  let component: ManageBanComponent;
  let fixture: ComponentFixture<ManageBanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageBanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageBanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
