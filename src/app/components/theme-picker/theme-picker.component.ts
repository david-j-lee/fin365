import { NgIf } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { MatIconButton } from '@angular/material/button'
import { MatIcon } from '@angular/material/icon'
import { ThemeService } from '@services/theme.service'

@Component({
  selector: 'app-theme-picker',
  templateUrl: './theme-picker.component.html',
  imports: [MatIcon, MatIconButton, NgIf],
  standalone: true,
})
export class ThemePickerComponent implements OnInit {
  constructor(public themeService: ThemeService) {
    // Inject
  }
  ngOnInit(): void {
    const html = document.getElementsByTagName('html')[0]
    // Remove the default
    html.classList.remove('light')
    // Set based on users preference
    html.classList.add(this.themeService.selectedTheme)
  }

  toggleTheme() {
    const html = document.getElementsByTagName('html')[0]
    html.classList.remove(this.themeService.selectedTheme)
    const newTheme =
      this.themeService.selectedTheme === 'dark' ? 'light' : 'dark'
    this.themeService.selectTheme(newTheme)
    html.classList.add(newTheme)
  }
}
