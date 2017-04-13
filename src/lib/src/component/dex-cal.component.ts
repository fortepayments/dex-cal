import { DexCalOptions, DexCalRange, DexSelectedRange } from './models';
import { Component, Input, EventEmitter, Output } from '@angular/core';

import { Calendar, MONTHS } from './calendar';

@Component({
  moduleId: module.id,
  selector: 'dex-cal',
  templateUrl: './dex-cal.component.html',
  styleUrls: ['./dex-cal.component.css']
})
export class DexCalComponent {
  @Input() options: DexCalOptions;
  @Output() selected = new EventEmitter<DexSelectedRange>();
  @Input() startDate: Date;
  @Input() endDate: Date;
  allOptions: DexCalOptions = {};
  defaultOptions: DexCalOptions = {
    label: 'Label',
    ranges: [
      { label: 'Yesterday', daysBackFromToday: 1 },
      { label: 'Last 7 days', daysBackFromToday: 7 },
      { label: 'Last 30 days', daysBackFromToday: 30 },
      { label: 'Last 60 days', daysBackFromToday: 60 },
      { label: 'Last 90 days', daysBackFromToday: 90 }
    ],
    allowCustomDates: true
  };

  cal: Calendar;
  weeks: Array<any>;
  months = MONTHS;
  selectedMonth: number;
  selectedYear: number;
  selectedRangeText: string;
  showCalendar = false;
  numberOfDaysInRange: number;
  today = new Date();

  constructor() {
    // initialize start and end date if not passed
    this.startDate = this.startDate || new Date();
    this.endDate = this.endDate || this.today;

    // merge the options
    this.allOptions = this.options ? Object.assign(this.allOptions, this.options, this.defaultOptions) : this.defaultOptions;

    this.cal = new Calendar();
    this.selectedMonth = this.today.getMonth();
    this.selectedYear = this.today.getFullYear();
    const defaultRange = this.allOptions.ranges && this.allOptions.ranges.length > 0 ? this.allOptions.ranges[0].daysBackFromToday : 1;
    this.setRange(defaultRange);
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

  previousYear() {
    this.selectedYear -= 1;
    this.getWeeks();
  }

  nextYear() {
    this.selectedYear += 1;
    this.getWeeks();
  }

  setRange(days: number) {
    this.numberOfDaysInRange = days;
    this.startDate.setDate(this.today.getDate() - days);
    this.endDate = this.today;
    this.selected.emit({
      startDate: this.startDate,
      endDate: this.endDate
    });
    this.showCalendar = false;
    this.setRangeText();
    this.getWeeks();
  }

  setCustomRange() {

  }

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
    if (this.showCalendar) {
      this.getWeeks();
    }
  }
  private setRangeText() {
    this.selectedRangeText = this.startDate && this.endDate ?
      this.selectedRangeText = `${this.formatDate(this.startDate)} - ${this.formatDate(this.endDate)}`
      : 'Select date range';
  }

  private formatDate(date: Date) {
    return `${date.getMonth() + 1} / ${date.getDate()} / ${date.getFullYear()}`;
  }

  private getWeeks() {
    this.weeks = [];
    let daysInMonth = this.cal.monthDays(this.selectedYear, this.selectedMonth);
    daysInMonth.forEach((week: number[]) => {
      let daysOfWeek: Day[] = [];
      week.forEach((day: number) => {
        daysOfWeek.push({
          date: day.toString(),
          isSelected: this.isSameDate(this.startDate, day) || this.isSameDate(this.endDate, day),
          isInRange: this.isInRange(day)
        });
      })
      this.weeks.push(daysOfWeek);
    });
  }

  private isSameDate(expected: Date, actual: number): boolean {
    return !!(expected.getDate() === actual && expected.getMonth() === this.selectedMonth
      && expected.getFullYear() === this.selectedYear);
  }

  private isInRange(day: number): boolean {
    return (this.startDate.getDate() < day && this.startDate.getMonth() <= this.selectedMonth
      && this.startDate.getFullYear() <= this.selectedYear) && (this.endDate.getDate() > day &&
        this.endDate.getMonth() >= this.selectedMonth && this.endDate.getFullYear() >= this.selectedYear);
  }
}

export interface Day {
  date: string;
  isSelected: boolean;
  isInRange: boolean;
}