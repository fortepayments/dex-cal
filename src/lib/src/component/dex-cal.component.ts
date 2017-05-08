import { Component, Input, ElementRef, EventEmitter, Output, OnInit, HostListener } from '@angular/core';

import { Calendar, MONTHS } from './calendar';
import { Day, DexCalOptions, DexCalRange, DexSelectedRange } from './models';

@Component({
  moduleId: module.id,
  selector: 'dex-cal',
  templateUrl: './dex-cal.component.html',
  styleUrls: ['./dex-cal.component.css']
})
export class DexCalComponent implements OnInit {
  @Input() options: DexCalOptions;
  @Input() disabled: boolean;
  @Output() selected = new EventEmitter<DexSelectedRange>();
  @Input() startDate: Date;
  @Input() endDate: Date;

  openCalendar = false;
  allOptions: DexCalOptions = {};
  defaultOptions: DexCalOptions = {
    label: 'Label',
    ranges: [
      { label: 'Yesterday', daysBackFromToday: 1 },
      { label: 'Last 7 days', daysBackFromToday: 7 },
      { label: 'Last 30 days', daysBackFromToday: 30 },
      { label: 'Last 60 days', daysBackFromToday: 60 },
      { label: 'Last 90 days', daysBackFromToday: 90 }
    ]
  };

  cal: Calendar;
  weeks: Array<any>;
  months = MONTHS;
  selectedMonth: number;
  selectedYear: number;
  selectedRangeText: string;
  showOptions = false;
  numberOfDaysInRange: number;
  today: Date;
  isCustomRange: boolean;
  highlightCustom: boolean;
  private startCustomRangeSelection: boolean;
  private backupStartDate: Date;
  private backupEndDate: Date;

  constructor(private elemRef: ElementRef) {
    // set today to just the date - not the time
    this.today = new Date((new Date()).toDateString());

    // initialize start and end date if not passed
    this.startDate = this.startDate || new Date();
    this.endDate = this.endDate || this.today;
    this.cal = new Calendar();
    this.selectedMonth = this.today.getMonth();
    this.selectedYear = this.today.getFullYear();
  }

  ngOnInit() {

    // merge the options
    if (this.options) {
      this.allOptions.label = this.options.label || this.defaultOptions.label;
      this.allOptions.ranges = this.options.ranges || this.defaultOptions.ranges;
    } else {
      this.allOptions = this.defaultOptions;
    }

    const defaultRange = this.allOptions.ranges && this.allOptions.ranges.length > 0 ? this.allOptions.ranges[0].daysBackFromToday : 1;
    this.setRange(defaultRange);
    this.setBackupDates();
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
    this.isCustomRange = false;
    this.numberOfDaysInRange = days;
    this.startDate = new Date((new Date()).toDateString());
    this.startDate.setDate(this.today.getDate() - days);
    this.endDate = this.today;
    this.getWeeks();
    this.rangeSelected();
  }

  setCustomRange() {
    this.isCustomRange = true;
  }

  toggleCalendar() {
    if (!this.disabled) {
      this.openCalendar = !this.openCalendar;
      if (this.openCalendar) {
        this.getWeeks();
      }
    }
  }

  selectDate(day: Day) {
    this.isCustomRange = true;
    if (!this.startCustomRangeSelection) {
      this.startCustomRangeSelection = true;
      this.startDate = this.endDate = undefined;
    }
    if (!this.startDate) {
      this.startDate = new Date(`${this.selectedMonth + 1}/${day.date}/${this.selectedYear}`);
      this.endDate = undefined;
    } else if (!this.endDate) {
      this.endDate = new Date(`${this.selectedMonth + 1}/${day.date}/${this.selectedYear}`);
      // the startDate should be before endDate
      if (this.startDate > this.endDate) {
        let temp = this.startDate;
        this.startDate = this.endDate;
        this.endDate = temp;
      }
      this.startCustomRangeSelection = false;
    } else {
      this.startDate = new Date(`${this.selectedMonth}/${day.date}/${this.selectedYear}`);
      day.isSelected = true;
    }
    this.getWeeks();
  }

  areTheSameDate(d1: Date, d2: Date) {
    if (d1 && d2) {
      return !!(d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth()
        && d1.getFullYear() === d2.getFullYear());
    } else {
      return false;
    }
  }

  rangeSelected() {
    this.openCalendar = false;
    this.setRangeText();
    this.setBackupDates();
    this.selected.emit({
      startDate: this.startDate,
      endDate: this.endDate
    });
  }

  cancel() {
    this.openCalendar = false;
    this.startDate = this.backupStartDate;
    this.endDate = this.backupEndDate;
    this.setRangeText();
  }

  @HostListener('document:click', ['$event.path'])
  onClickOutside(targetElementPath: Array<any>) {
    let elementRefInPath = targetElementPath.find(e => e === this.elemRef.nativeElement);
    if (!elementRefInPath) {
      this.cancel();
    }
  }

  private setRangeText() {
    this.selectedRangeText = this.startDate && this.endDate ?
      this.selectedRangeText = `${this.formatDate(this.startDate)}  ⇢  ${this.formatDate(this.endDate)}`
      : 'Select date range';
  }

  private formatDate(date: Date) {
    return `${date.getMonth() + 1} / ${date.getDate()} / ${date.getFullYear()}`;
  }

  private getWeeks() {
    this.weeks = [];
    if (this.selectedYear !== undefined && this.selectedMonth !== undefined) {
      let daysInMonth = this.cal.monthDays(this.selectedYear, this.selectedMonth);
      daysInMonth.forEach((week: number[]) => {
        let daysOfWeek: Day[] = [];
        week.forEach((day: number) => {
          daysOfWeek.push({
            date: day,
            isSelected: this.isSameDate(this.startDate, day) || this.isSameDate(this.endDate, day),
            isInRange: this.isInRange(day)
          });
        });
        this.weeks.push(daysOfWeek);
      });

      this.highlightRange();
    }
  }

  private isSameDate(expected: Date, actual: number): boolean {
    if (!expected) {
      return false;
    }

    return !!(expected.getDate() === actual && expected.getMonth() === this.selectedMonth
      && expected.getFullYear() === this.selectedYear);
  }

  private isInRange(day: number): boolean {
    if (this.startDate && this.endDate && day > 0) {
      let dateBeingChecked = new Date(`${this.selectedMonth + 1}/${day}/${this.selectedYear}`);
      return this.startDate <= dateBeingChecked && this.endDate >= dateBeingChecked;
    }

    return false;
  }

  private highlightRange() {
    if (this.allOptions && this.allOptions.ranges && this.startDate && this.endDate) {
      this.highlightCustom = false;
      this.numberOfDaysInRange = Math.round(Math.abs((this.endDate.getTime() - this.startDate.getTime()) / (24 * 60 * 60 * 1000)));

      // everything except Custom end at today
      if (this.areTheSameDate(this.endDate, this.today)) {
        if (!this.allOptions.ranges.some(r => r.daysBackFromToday === this.numberOfDaysInRange)) {
          this.highlightCustom = true;
        }
      } else {
        this.highlightCustom = true;
      }
    }
  }

  private setBackupDates() {
    this.backupStartDate = new Date(this.startDate);
    this.backupEndDate = new Date(this.endDate);
  }
}
