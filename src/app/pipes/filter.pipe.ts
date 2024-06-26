/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'filter',
  pure: false,
  standalone: true,
})
@Injectable()
export class FilterPipe implements PipeTransform {
  transform(items: any[], field: string, value: string | boolean): any[] {
    if (!items) {
      return []
    }
    return items.filter((it) => it[field] === value)
  }
}
