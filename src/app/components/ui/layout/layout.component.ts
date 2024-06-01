import { NgClass } from '@angular/common'
import { Component } from '@angular/core'
import { MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-layout',
  templateUrl: 'layout.component.html',
  styleUrls: ['layout.component.scss'],
  standalone: true,
  imports: [NgClass, MatDrawerContainer, MatDrawerContent, RouterOutlet],
})
export class LayoutComponent {
  constructor() {}
}
