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
    <div>
    Default Settings: 
      <dex-cal [options]="calendarOptions"></dex-cal>
      Template
      <code>&lt;dex-cal [options]="calendarOptions"&gt;&lt;/dex-cal&gt;</code>
      Code
      <pre>calendarOptions: DexCalOptions = {{calendarOptions | json}}</pre>
    </div>
    <div>
    Default Settings: 
      <dex-cal [options]="calendarOptionsWithDefaultRange"></dex-cal>
      Template
      <code>&lt;dex-cal [options]="calendarOptionsWithDefaultRange"&gt;&lt;/dex-cal&gt;</code>
      Code
      <pre>calendarOptionsWithDefaultRange: DexCalOptions = {{calendarOptionsWithDefaultRange | json}}</pre>
    </div>
    <div>
    Custom Start and End Date: 
      <dex-cal [options]="calendarOptions" [startDate]="startDate" [endDate]="endDate"></dex-cal>
      Template
      <code>&lt;dex-cal [options]="calendarOptions"&gt;&lt;/dex-cal&gt;</code>
      Code
      <pre>
  this.endDate = new Date();
  this.startDate = new Date();
  this.startDate.setDate(this.startDate.getDate() - 7);
      </pre>
    </div>
    </section>
  </div>
  `,
})
export class AppComponent {
  meaning: number;
  calendarOptions: DexCalOptions = {
    label: 'Select'
  };
  calendarOptionsWithDefaultRange: DexCalOptions = {
    label: 'Select',
    defaultRange: 7
  };
  startDate: Date;
  endDate: Date;

  constructor() {
    this.endDate = new Date();
    this.startDate = new Date();
    this.startDate.setDate(this.startDate.getDate() - 7);
  }
}
