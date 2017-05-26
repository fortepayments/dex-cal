import { Component } from '@angular/core';

import { DexCalOptions } from 'dex-cal';
@Component({
  selector: 'demo-app',
  template: `
  <div class="container">
    <header>
      <div>
        <h1>Dex-Cal</h1>
        <p style="color: white">An Angular Calendar component with predefined ranges</p>
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
    <br/>
    Default Settings: 
      <dex-cal [options]="calendarOptions"></dex-cal>
      <code>&lt;dex-cal [options]="calendarOptions"&gt;&lt;/dex-cal&gt;</code>
    <div>
    Custom Start and End Date: 
      <dex-cal [options]="calendarOptions" [startDate]="startDate" [endDate]="endDate"></dex-cal>
      <code>&lt;dex-cal [options]="calendarOptions" [startDate]="startDate" [endDate]="endDate"&gt;&lt;/dex-cal&gt;</code>
    </div>
    </section>
  </div>
  `,
})
export class AppComponent {
  meaning: number;
  calendarOptions: DexCalOptions = {
    label: 'Select'
  }
  startDate: Date;
  endDate: Date;

  constructor() {
    this.endDate = new Date();
    this.startDate = new Date();
    this.startDate.setDate(this.startDate.getDate() - 7);
  }
}
