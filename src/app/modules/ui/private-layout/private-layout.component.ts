import { ChangeDetectorRef, Component } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { OverlayContainer } from '@angular/cdk/overlay';

import { ThemeService } from '../../material/services/theme.service';

@Component({
  selector: 'app-private-layout',
  templateUrl: 'private-layout.component.html',
  styleUrls: ['private-layout.component.scss'],
})
export class PrivateLayoutComponent {
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef,
    overlayContainer: OverlayContainer,
    public themeService: ThemeService
  ) {
    if (
      this.themeService.selectedTheme !== undefined &&
      this.themeService.selectedTheme.class !== ''
    ) {
      overlayContainer
        .getContainerElement()
        .classList.add(this.themeService.selectedTheme.class as string);
    }
    this.mobileQuery = media.matchMedia('(max-width: 900px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
}
