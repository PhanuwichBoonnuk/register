import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(items: any[], filter: any): any {
    if (!items || !filter) {
      return items;
    }

    // return items.filter(
    //   (item) =>
    //     Object.values(item)
    //       .join(',')
    //       .toLowerCase()
    //       .indexOf(filter.toLowerCase()) !== -1
    // );

    return items.filter(
      (item) =>
        JSON.stringify(item).toLowerCase().indexOf(filter.toLowerCase()) !== -1
    );
  }
}
