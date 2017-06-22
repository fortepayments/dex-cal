import { Component } from '@angular/core';

import { DexCalOptions } from 'dex-cal';
@Component({
  selector: 'demo-app',
  template: `
  <div class="container">
    <header>
      <div class="header-content">
        <h1>Dex-Cal</h1>
        <p style="color: white">An Angular Calendar component with predefined ranges</p>
      </div>
      <div>
        <span>Github: </span>
        <a class="github-button" href="https://github.com/fortepayments" data-style="mega">Follow @fortepayments</a>
        <a class="github-button" href="https://github.com/fortepayments/dex-cal">Star</a> 
        <a class="github-button" href="https://github.com/fortepayments/dex-cal/fork">Fork</a>
      </div>
      <svg id="bigHalfCircle" xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="100" viewBox="0 0 100 100" preserveAspectRatio="none">
				<path d="M0 100 C40 0 60 0 100 100 Z"></path>
			</svg>
    </header>
    
    <section>
    
     <div class="flex">
       <div>
        Default Settings:
        <dex-cal [disabled]="true" [options]="calendarOptions"></dex-cal>
      </div>
      <div class="code-exmp-cont">
        <div class="code-exmp">
          <h4>Template</h4>
          <code>&lt;dex-cal [options]="calendarOptions"&gt;&lt;/dex-cal&gt;</code>
        </div>
        
        <div class="code-exmp">
          <h4>Code</h4>
          <pre>calendarOptions: DexCalOptions = {{calendarOptions | json}}</pre>
        </div>
      </div>
    </div>

    <div class="flex">
      <div>
        Default Settings: 
        <dex-cal [options]="calendarOptionsWithDefaultRange"></dex-cal>
      </div>
      <div class="code-exmp-cont">
        <div class="code-exmp">
          <h4>Template</h4>
          <code>&lt;dex-cal [options]="calendarOptionsWithDefaultRange"&gt;&lt;/dex-cal&gt;</code>
          <h4>Code</h4>
          <pre>calendarOptionsWithDefaultRange: DexCalOptions = {{calendarOptionsWithDefaultRange | json}}</pre>
        </div>
      </div>
    </div>




      <div class="flex">
          <div>
            Custom Start and End Date: 
            <dex-cal [options]="calendarOptions" [startDate]="startDate" [endDate]="endDate"></dex-cal>
          </div>
          <div class="code-exmp-cont">
            <div class="code-exmp">
              <h4>Template</h4>
              <code>&lt;dex-cal [options]="calendarOptions"&gt;&lt;/dex-cal&gt;</code>
            </div>
            <div class="code-exmp">
              <h4>Code</h4>
              <pre>this.endDate = new Date();<br/>this.startDate = new Date();<br/>this.startDate.setDate(this.startDate.getDate() - 7);
              </pre>
            </div>
          </div>
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
