import { Component } from '@angular/core';

import { DexCalOptions } from 'dex-cal';
@Component({
  selector: 'demo-app',
  template: `
    <dex-cal [options]="calendarOptions"></dex-cal>
  `,
})
export class AppComponent {
  meaning: number;
  calendarOptions: DexCalOptions = {
    label: 'Select'
  }
  constructor() {
  }
}
