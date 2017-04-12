import { Component } from '@angular/core';

@Component({
  selector: 'demo-app',
  template: `
    <dex-cal label="Range"></dex-cal>
  `,
})
export class AppComponent {
  meaning: number;
  constructor() {
  }
}
