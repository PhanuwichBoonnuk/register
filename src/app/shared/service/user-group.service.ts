import { Injectable } from '@angular/core';
import { HttpCustom } from '@core/http-custom';

@Injectable({
  providedIn: 'root',
})
export class UserGroupService {
  constructor(private http: HttpCustom) {}

  getUserGroups() {
    return this.http.get('/usergroups');
  }

  getUserGroupById(userGroupId: string) {
    return this.http.get('/usergroups/' + userGroupId);
  }

  createUserGroup(data: any) {
    return this.http.post('/usergroups', data);
  }

  updateUserGroup(userGroupId: string, data: any) {
    return this.http.put('/usergroups/' + userGroupId, data);
  }

  deleteUserGroup(userGroupId: string) {
    return this.http.delete('/usergroups/' + userGroupId);
  }
}
