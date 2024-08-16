import { TestBed } from '@angular/core/testing';

import { MyLockerService } from './my-locker.service';

describe('MyLockerService', () => {
  let service: MyLockerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyLockerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
