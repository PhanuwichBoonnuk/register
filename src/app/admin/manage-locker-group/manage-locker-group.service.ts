import { Injectable } from '@angular/core';
import { HttpCustom } from '@core/http-custom';

@Injectable({
  providedIn: 'root',
})
export class ManageLockerGroupService {
  constructor(private http: HttpCustom) {}

  getLockerGroups() {
    return this.http.get('/lockergroup');
  }

  getLockerGroupById(lockerGroupId: string) {
    return this.http.get(
      '/lockergroup/' + lockerGroupId + '?require_lockers=true'
    );
  }

  createLockerGroup(data: any) {
    return this.http.post('/lockergroup', data);
  }

  updateLockerGroup(lockerGroupId: string, data: any) {
    return this.http.put('/lockergroup/' + lockerGroupId, data);
  }

  updateLockerToLockerGroup(lockerGroupId: string, data: any) {
    return this.http.put('/lockergroup/' + lockerGroupId + '/lockers', data);
  }

  deleteLockerGroup(lockerGroupId: string) {
    return this.http.delete('/lockergroup/' + lockerGroupId);
  }

  updateLockerGroupSchedule(lockerGroupId: string, data: any) {
    return this.http.put('/lockergroup/' + lockerGroupId + '/schedule', data);
  }
}
