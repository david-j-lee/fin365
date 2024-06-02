/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'search',
  standalone: true,
})
export class SearchPipe implements PipeTransform {
  public transform(value: any, keys: string, term: any) {
    return (value || []).filter((item: any) =>
      keys
        .split(',')
        .some(
          (key: any) =>
            Object.hasOwn(item, key) && new RegExp(term, 'giu').test(item[key]),
        ),
    )
  }
}
