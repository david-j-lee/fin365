import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { NgChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { MaterialModule } from './modules/material/material.module';
import { CoreModule } from './core/core.module';
import { UiModule } from './modules/ui/ui.module';
import { FinanceModule } from './modules/finance/finance.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    HttpClientModule,

    MaterialModule,
    CoreModule,
    NgChartsModule,
    UiModule,

    FinanceModule,

    RouterModule.forRoot([{ path: '**', redirectTo: '' }]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
