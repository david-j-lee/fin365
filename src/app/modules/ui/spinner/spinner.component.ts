import { Component, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnDestroy {
  @Input() public delay = 150;

  @Input()
  public set isRunning(value: boolean) {
    if (!value) {
      this.cancelTimeout();
      this.isDelayedRunning = false;
      return;
    }

    if (this.currentTimeout) {
      return;
    }

    // specify window to side-step conflict with node types: https://github.com/mgechev/angular2-seed/issues/901
    this.currentTimeout = window.setTimeout(() => {
      this.isDelayedRunning = value;
      this.cancelTimeout();
    }, this.delay);
  }

  public isDelayedRunning = false;
  private currentTimeout: number = 0;

  ngOnDestroy(): any {
    this.cancelTimeout();
  }

  private cancelTimeout(): void {
    clearTimeout(this.currentTimeout);
    this.currentTimeout = 0;
  }
}
