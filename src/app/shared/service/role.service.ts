import { Injectable } from '@angular/core';
import { HttpCustom } from '@core/http-custom';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private http: HttpCustom) {}

  getRoles() {
    return this.http.get('/roles');
  }
}
