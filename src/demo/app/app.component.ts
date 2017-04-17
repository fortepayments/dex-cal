import { Component } from '@angular/core';

import { DexCalOptions } from 'dex-cal';
@Component({
  selector: 'demo-app',
  template: `
  <div class="container">
    <header>
      <div>
        <h1>Dex-Cal</h1>
        <p>An Angular Calendar component with predefined ranges</p>
      </div>
      <div>
        <span>Github: </span>
        <a class="github-button" href="https://github.com/fortepayments" data-style="mega">Follow @fortepayments</a>
        <a class="github-button" href="https://github.com/fortepayments/dex-cal">Star</a> 
        <a class="github-button" href="https://github.com/fortepayments/dex-cal/fork">Fork</a>
      </div>
    </header>
    <section>
    <h2>Basic Control</h2>
      <p>Click anywhere on the placeholder below to show the calendar.</p>
      <dex-cal [options]="calendarOptions"></dex-cal>
    </section>
  </div>
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
