import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'search',
  standalone: true,
})
export class SearchPipe implements PipeTransform {
  public transform(value: any, keys: string, term: any) {
    // if (!term) { return value; }
    return (value || []).filter((item: any) =>
      keys
        .split(',')
        .some(
          (key: any) =>
            Object.prototype.hasOwnProperty.call(item, key) &&
            new RegExp(term, 'gi').test(item[key]),
        ),
    )
  }
}
