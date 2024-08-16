import { TestBed } from '@angular/core/testing';

import { ManageLockerGroupService } from './manage-locker-group.service';

describe('ManageLockerGroupService', () => {
  let service: ManageLockerGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageLockerGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
