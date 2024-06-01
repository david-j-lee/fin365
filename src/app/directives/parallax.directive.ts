// Reduced from: https://github.com/MattJeanes/ngx-parallax/blob/master/lib/parallax.directive.ts
// ngx-parallax
import { Directive, ElementRef, Input, OnInit } from '@angular/core'

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[parallax]',
  standalone: true,
})
export class ParallaxDirective implements OnInit {
  @Input() imgAspectRatio: number = 0
  @Input() speed: number = 0
  @Input() top: number = 0
  @Input() left: number = 0

  private element: HTMLElement
  private window: Window = {} as Window
  private cssProperty: string = 'transform'

  constructor(element: ElementRef) {
    this.element = element.nativeElement
  }

  ngOnInit() {
    this.window = window
    this.addStyles()

    if (!this.imgAspectRatio) {
      this.imgAspectRatio = 1.5
    }

    if (!this.speed) {
      this.speed = 7
    }

    this.evaluateScroll()
    this.window.addEventListener('scroll', this.evaluateScroll.bind(this))

    this.setAspectRatio()
    this.window.addEventListener('resize', this.setAspectRatio.bind(this))
  }

  private addStyles() {
    // parent styles
    if (this.element.parentElement) {
      this.element.parentElement.style.position = 'relative'
      this.element.parentElement.style.overflow = 'hidden'
    }

    // element styles
    this.element.style.position = 'absolute'
    this.element.style.top = this.top + '%' || '50%'
    this.element.style.left = this.left + '%' || '50%'

    this.element.style[this.cssProperty as any] = 'translate' + '( -50%, 0px )'
  }

  private evaluateScroll() {
    if (
      this.window &&
      this.element.parentElement &&
      this.speed &&
      this.window.scrollY + this.window.outerHeight >
        this.element.parentElement.offsetTop
    ) {
      const calcVal =
        (this.window.scrollY - this.element.parentElement.offsetTop) *
        this.speed
      const resultVal = 'translate' + '( -50%, ' + calcVal + 'px )'
      this.element.style[this.cssProperty as any] = resultVal
    }
  }

  private setAspectRatio() {
    if (!this.element.parentElement || !this.imgAspectRatio || !this.top) {
      return
    }

    const parentAspectRatio =
      this.element.parentElement.offsetWidth /
      (this.element.parentElement.offsetHeight * (1 - this.top / 100))

    if (this.imgAspectRatio < parentAspectRatio) {
      this.element.style.width = '105%'
      this.element.style.height = 'auto'
    } else {
      this.element.style.width = 'auto'
      this.element.style.height = `${100 - this.top + 5}%`
    }
  }
}
