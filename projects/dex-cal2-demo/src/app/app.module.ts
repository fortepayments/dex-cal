import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DexCal2Module } from '../../../dex-cal2/src/lib/dex-cal2.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, DexCal2Module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
