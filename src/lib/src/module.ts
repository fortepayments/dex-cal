import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DexCalComponent } from './component/dex-cal.component';

@NgModule({
  imports: [CommonModule],
  declarations: [DexCalComponent],
  exports: [DexCalComponent]
})
export class DexCalModule { }
