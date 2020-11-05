import { Component } from '@angular/core';
import { DexCalOptions } from '../../../dex-cal2/src/lib/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
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
