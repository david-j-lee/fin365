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
      const aValue = a[prop]
      const bValue = b[prop]

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue)
      }

      if (aValue < bValue) {
        return -1
      } else if (aValue > bValue) {
        return 1
      }
      return 0
    })
  }
}
