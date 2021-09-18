import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SearchPipe } from './pipes/search.pipe';
import { SortByPipe } from './pipes/sort.pipe';
import { FilterPipe } from './pipes/filter.pipe';

import { EqualValidator } from './directives/equal-validator.directive';

import { ConfigService } from './services/config.service';
import { ScrollTopService } from './services/scroll-top.service';
import { ParallaxDirective } from './directives/parallax.directive';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [EqualValidator, ParallaxDirective, SearchPipe, SortByPipe, FilterPipe],
  exports: [EqualValidator, ParallaxDirective, SearchPipe, SortByPipe, FilterPipe],
  providers: [ConfigService, ScrollTopService]
})
export class CoreModule {}
