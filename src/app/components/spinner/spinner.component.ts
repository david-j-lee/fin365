import { Component, Input, OnDestroy } from '@angular/core'

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  standalone: true,
})
export class SpinnerComponent implements OnDestroy {
  @Input() public delay = 150

  // eslint-disable-next-line accessor-pairs
  @Input()
  public set isRunning(value: boolean) {
    if (!value) {
      this.cancelTimeout()
      this.isDelayedRunning = false
      return
    }

    if (this.currentTimeout) {
      return
    }

    // Specify window to side-step conflict with node types: https://github.com/mgechev/angular2-seed/issues/901
    this.currentTimeout = window.setTimeout(() => {
      this.isDelayedRunning = value
      this.cancelTimeout()
    }, this.delay)
  }

  public isDelayedRunning = false
  private currentTimeout: number = 0

  ngOnDestroy() {
    this.cancelTimeout()
  }

  private cancelTimeout(): void {
    clearTimeout(this.currentTimeout)
    this.currentTimeout = 0
  }
}
