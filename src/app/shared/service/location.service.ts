import { Injectable } from '@angular/core';
import { HttpCustom } from '@core/http-custom';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpCustom) {}

  // getBuildings() {
  //   return this.http.get('/locations/building');
  // }

  // getBuildingById(buildingId: string) {
  //   return this.http.get('/locations/building/' + buildingId);
  // }

  // createBuilding(data: any) {
  //   return this.http.post('/locations/building', data);
  // }

  // updateBuilding(buildingId: string, data: any) {
  //   return this.http.put('/locations/building/' + buildingId, data);
  // }

  // deleteBuilding(buildingId: string) {
  //   return this.http.delete('/locations/building/' + buildingId);
  // }

  // getFloors() {
  //   return this.http.get('/locations/floor');
  // }

  // getFloorById(floorId: string) {
  //   return this.http.get('/locations/floor/' + floorId);
  // }

  // createFloor(data: any) {
  //   return this.http.post('/locations/floor', data);
  // }

  // updateFloor(floorId: string, data: any) {
  //   return this.http.put('/locations/floor/' + floorId, data);
  // }

  // deleteFloor(floorId: string) {
  //   return this.http.delete('/locations/floor/' + floorId);
  // }

  // getZones() {
  //   return this.http.get('/locations/zones');
  // }

  // getZoneById(zoneId: string) {
  //   return this.http.get('/locations/zones/' + zoneId);
  // }

  // createZone(data: any) {
  //   return this.http.post('/locations/zones', data);
  // }

  // updateZone(zoneId: string, data: any) {
  //   return this.http.put('/locations/zones/' + zoneId, data);
  // }

  // deleteZone(zoneId: string) {
  //   return this.http.delete('/locations/zones/' + zoneId);
  // }

  // getGroups() {
  //   return this.http.get('/locations/group');
  // }

  // createGroup(data: any) {
  //   return this.http.post('/locations/group', data);
  // }

  // updateGroup(groupId: string, data: any) {
  //   return this.http.put('/locations/group/' + groupId, data);
  // }

  // deleteGroup(groupId: string) {
  //   return this.http.delete('/locations/group/' + groupId);
  // }

  getLocations() {
    return this.http.get('/locations');
  }

  getBuildingById(buildingId: string) {
    return this.http.get('/locations/' + buildingId);
  }

  getFloorById(buildingId: string, floorId: string) {
    return this.http.get('/locations/' + buildingId + '/' + floorId);
  }

  getZoneById(buildingId: string, floorId: string, zoneId: string) {
    return this.http.get(
      '/locations/' + buildingId + '/' + floorId + '/' + zoneId
    );
  }

  createBuilding(data: any) {
    return this.http.post('/locations/building', data);
  }

  createFloor(data: any) {
    return this.http.post('/locations/floors', data);
  }

  createZone(data: any) {
    return this.http.post('/locations/zones', data);
  }

  updateBuilding(buildingId: string, data: any) {
    return this.http.put('/locations/building/' + buildingId, data);
  }

  updateFloor(floorId: string, data: any) {
    return this.http.put('/locations/floors/' + floorId, data);
  }

  updateZone(zoneId: string, data: any) {
    return this.http.put('/locations/zones/' + zoneId, data);
  }

  deleteBuilding(buildingId: string) {
    return this.http.delete('/locations/building/' + buildingId);
  }

  deleteFloor(floorId: string) {
    return this.http.delete('/locations/floors/' + floorId);
  }

  deleteZone(zoneId: string) {
    return this.http.delete('/locations/zones/' + zoneId);
  }
}
