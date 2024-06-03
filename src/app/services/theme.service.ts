import { Injectable } from '@angular/core'

@Injectable()
export class ThemeService {
  selectedTheme: string =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'

  selectTheme(theme: string) {
    if (this.selectedTheme !== theme) {
      const html = document.getElementsByTagName('html')[0]
      html.classList.remove(this.selectedTheme)
      this.selectedTheme = theme
      html.classList.add(this.selectedTheme)
    }
  }
}
