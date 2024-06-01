import { Injectable } from '@angular/core'
import { Theme } from '@interfaces/theme.interface'

@Injectable()
export class ThemeService {
  themes: Theme[] = [
    { name: 'None', class: '' },
    { name: 'Hello Kitty', class: 'hello-kitty' },
    { name: 'Batman', class: 'batman' },
  ]
  selectedTheme: Theme = new Theme()

  constructor() {}

  set(name: string) {
    const theme = this.themes.find((x) => x.name === name)
    if (theme === undefined) {
      this.selectedTheme = this.themes[0]
    } else {
      this.selectedTheme = theme as Theme
    }
  }
}
