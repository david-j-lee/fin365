// https://auralinna.blog/post/2018/scroll-to-top-on-angular-route-change
import { isPlatformBrowser } from '@angular/common'
import { Inject, Injectable, PLATFORM_ID } from '@angular/core'
import { Router } from '@angular/router'

@Injectable()
export class ScrollTopService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router,
  ) {}

  setScrollTop() {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.subscribe(() => {
        window.scroll(0, 0)
      })
    }
  }
}
