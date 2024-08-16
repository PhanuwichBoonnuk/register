import { Pipe, PipeTransform } from '@angular/core';
import { error } from 'protractor';

@Pipe({
  name: 'filterLocation',
})
export class FilterLocationPipe implements PipeTransform {
  transform(
    items: any[],
    filter: {
      buildingId?: string;
      floorId?: string;
      zoneId?: string;
      groupId?: string;
    }
  ): any {
    if (!items || !filter) {
      return items;
    }

    return items
      .filter(
        (item) =>
          (filter.buildingId && item.buildingId === filter.buildingId) ||
          !filter.buildingId
      )
      .filter(
        (item) =>
          (filter.floorId && item.floorId === filter.floorId) || !filter.floorId
      )
      .filter(
        (item) =>
          (filter.zoneId && item.zoneId === filter.zoneId) || !filter.zoneId
      )
      .filter(
        (item) =>
          (filter.groupId && item.groupId === filter.groupId) || !filter.groupId
      );
  }
}
