import { Component } from '@angular/core';

import { Calendar, MONTHS } from './calendar';


@Component({
  moduleId: module.id,
  selector: 'dex-cal',
  templateUrl: './dex-cal.component.html',
  styleUrls: ['./dex-cal.component.css']
})
export class DexCalComponent {
  cal: Calendar;
  weeks: Date[];
  months = MONTHS;
  selectedMonth: number;
  selectedYear: number;
  private today = new Date();

  constructor() {
    this.cal = new Calendar();
    this.selectedMonth = this.today.getMonth();
    this.selectedYear = this.today.getFullYear();
    this.getWeeks();
  }

  previousMonth() {
    this.selectedMonth -= 1;
    if (this.selectedMonth < 0) {
      this.selectedMonth = 11;
      this.selectedYear -= 1;
    }
    this.getWeeks();
  }

  nextMonth() {
    this.selectedMonth += 1;
    if (this.selectedMonth > 11) {
      this.selectedMonth = 0;
      this.selectedYear += 1;
    }

    this.getWeeks();
  }

  private getWeeks() {
    console.log(this.selectedMonth, this.selectedYear)
    this.weeks = this.cal.monthDays(this.selectedYear, this.selectedMonth);
  }
}
