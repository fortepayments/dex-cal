import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DexCalModule } from 'dex-cal';

import { AppComponent }  from './app.component';

@NgModule({
  imports:      [ BrowserModule, DexCalModule],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
