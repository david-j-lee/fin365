import { Injectable } from '@angular/core'
import { localStorageService } from '@data/local-storage/local-storage-utilities'

@Injectable()
export class ThemeService {
  selectedMode: string =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches &&
    (localStorageService.getObject('theme')['mode'] ?? 'dark') === 'dark'
      ? 'dark'
      : 'light'

  selectMode(mode: string) {
    if (this.selectedMode !== mode) {
      // Update the theme on the dom
      const html = document.getElementsByTagName('html')[0]
      html.classList.remove(this.selectedMode)
      this.selectedMode = mode
      html.classList.add(this.selectedMode)

      // Save the theme
      const storedTheme = localStorageService.getObject('theme')
      localStorageService.setObject('theme', { ...storedTheme, mode })
    }
  }
}
