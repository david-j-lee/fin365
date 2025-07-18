import { Injectable, Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'filter',
  pure: false,
  standalone: true,
})
@Injectable()
export class FilterPipe implements PipeTransform {
  transform<T extends object>(
    items: T[] | null | undefined,
    field: keyof T,
    value: T[keyof T],
  ): T[] {
    if (!items) {
      return []
    }
    return items.filter((it) => it[field] === value)
  }
}
