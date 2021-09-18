import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortBy',
  pure: false,
})
export class SortByPipe implements PipeTransform {
  transform(items: any[] | null | undefined, prop: string): any {
    if (!items) {
      return [];
    }
    return items.sort((a, b) => {
      if (a[prop] < b[prop]) {
        return -1;
      } else if (a[prop] > b[prop]) {
        return 1;
      } else {
        return 0;
      }
    });
  }
}
