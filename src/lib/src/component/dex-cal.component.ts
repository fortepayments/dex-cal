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
  weeks: Date[];
  months = MONTHS;
  selectedMonth: number;
  selectedYear: number;
  selectedRange: string;
  startDate: Date = new Date();
  endDate: Date = new Date();
  showCalendar = false;

  private today = new Date();

  constructor() {
    // merge the options
    this.options = this.options ? Object.assign(this.options, this.defaultOptions) : this.defaultOptions;

    this.cal = new Calendar();
    this.selectedMonth = this.today.getMonth();
    this.selectedYear = this.today.getFullYear();
    const defaultRange = this.options.ranges && this.options.ranges.length > 0 ? this.options.ranges[0].daysBackFromToday : 1;
    this.setRange(defaultRange);
    this.selectedRange = 'Select date range';
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
    this.startDate.setDate(this.today.getDate() - days);
    this.selected.emit({
       startDate: this.startDate,
       endDate: this.endDate
    });
  }

  private getWeeks() {
    this.weeks = this.cal.monthDays(this.selectedYear, this.selectedMonth);
  }
}

export interface DexCalOptions {
  label?: string;
  ranges?: DexCalRange[];
  allowCustomDates?: boolean;
}

export interface DexCalRange {
  label: string;
  daysBackFromToday: number;
}

export interface DexSelectedRange {
  startDate: Date;
  endDate: Date;
}