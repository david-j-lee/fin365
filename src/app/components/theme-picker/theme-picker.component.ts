import { Component, OnInit, inject } from '@angular/core'
import { MatIconButton } from '@angular/material/button'
import { MatIcon } from '@angular/material/icon'
import { ThemeService } from '@services/theme.service'

@Component({
  selector: 'app-theme-picker',
  templateUrl: './theme-picker.component.html',
  imports: [MatIcon, MatIconButton],
})
export class ThemePickerComponent implements OnInit {
  themeService = inject(ThemeService)

  ngOnInit(): void {
    const html = document.getElementsByTagName('html')[0]
    // Remove the default
    html.classList.remove('light')
    // Set based on users preference
    html.classList.add(this.themeService.selectedMode)
  }

  toggleTheme() {
    const html = document.getElementsByTagName('html')[0]
    html.classList.remove(this.themeService.selectedMode)
    const newTheme =
      this.themeService.selectedMode === 'dark' ? 'light' : 'dark'
    this.themeService.selectMode(newTheme)
    html.classList.add(newTheme)
  }
}
