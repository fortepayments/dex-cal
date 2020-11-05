import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DexCal2Component } from './dex-cal2.component';
import { TextMaskModule } from 'angular2-text-mask';



@NgModule({
  declarations: [DexCal2Component],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TextMaskModule
  ],
  exports: [DexCal2Component]
})
export class DexCal2Module { }
