import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'search',
  standalone: true,
})
export class SearchPipe implements PipeTransform {
  public transform<T extends Record<string, unknown>>(
    value: T[],
    keys: string,
    term: string,
  ): T[] {
    if (!Array.isArray(value) || !term) {
      return value || []
    }
    return value.filter((item) =>
      keys
        .split(',')
        .some(
          (key) =>
            Object.hasOwn(item, key) &&
            typeof item[key] === 'string' &&
            new RegExp(term, 'giu').test(item[key] as string),
        ),
    )
  }
}
