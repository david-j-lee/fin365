import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'sortBy',
  pure: false,
  standalone: true,
})
export class SortByPipe implements PipeTransform {
  transform<T extends object>(
    items: T[] | null | undefined,
    prop: keyof T,
  ): T[] {
    if (!items) {
      return []
    }
    return [...items].sort((a, b) => {
      if (a[prop] < b[prop]) {
        return -1
      } else if (a[prop] > b[prop]) {
        return 1
      }
      return 0
    })
  }
}
