import {
  Component,
  Input,
  ElementRef,
  EventEmitter,
  Output,
  OnInit,
  HostListener,
  ViewEncapsulation
} from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { Calendar, MONTHS } from './calendar';
import { Day, DexCalOptions, DexCalRange, DexSelectedRange } from './models';

const dateValidator = (): ValidatorFn => {
  return (c: AbstractControl): { [key: string]: boolean } => {
    const value = c.value;
    if (value && typeof value === 'string') {
      // tslint:disable-next-line: max-line-length
      const match = value.match(/^02\/(?:[01]\d|2\d)\/(?:19|20)(?:0[048]|[13579][26]|[2468][048])|(?:0[13578]|10|12)\/(?:[0-2]\d|3[01])\/(?:19|20)\d{2}|(?:0[469]|11)\/(?:[0-2]\d|30)\/(?:19|20)\d{2}|02\/(?:[0-1]\d|2[0-8])\/(?:19|20)\d{2}$/);
      if (!match) {
        return { dateInvalid: true };
      } else if (match && match[0] !== value) {
        return { dateInvalid: true };
      }
    }
    return null;
  };
};

@Component({
  selector: 'lib-dex-cal',
  templateUrl: './dex-cal2.component.html',
  styleUrls: ['./dex-cal2.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class DexCal2Component implements OnInit {
  @Input() options: DexCalOptions;
  @Input() disabled: boolean;
  @Output() selected = new EventEmitter<DexSelectedRange>();
  @Input() startDate: Date;
  @Input() endDate: Date;

  dateForm: FormGroup;
  openCalendar = false;
  allOptions: DexCalOptions = {};
  defaultOptions: DexCalOptions = {
    label: 'Label',
    defaultRange: 1,
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
  years = [];
  selectedMonth: number;
  selectedYear: number;
  // selectedRangeText: string;
  showOptions = false;
  numberOfDaysInRange: number;
  today: Date;
  isCustomRange: boolean;
  highlightCustom: boolean;
  toggleYr = false;
  toggleMm = false;

  readonly dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  readonly datePattern = /([0-9]{2})\/([0-9]{2})\/([0-9]{4})/;
  private startCustomRangeSelection: boolean;
  private backupStartDate: Date;
  private backupEndDate: Date;
  private backupSelectedYear: number;
  private backupSelectedMonth: number;

  constructor(private elemRef: ElementRef, private fb: FormBuilder) {
    // set today to just the date - not the time
    this.today = new Date(new Date().toDateString());
    this.cal = new Calendar();
    this.selectedMonth = this.today.getMonth();
    this.selectedYear = this.today.getFullYear();
    this.getYears();
  }

  ngOnInit() {
    // merge the options
    if (this.options) {
      this.allOptions.label = this.options.label || this.defaultOptions.label;
      this.allOptions.ranges =
        this.options.ranges || this.defaultOptions.ranges;
      this.allOptions.defaultRange =
        this.options.defaultRange || this.defaultOptions.defaultRange;
    } else {
      this.allOptions = this.defaultOptions;
    }

    if (this.startDate || this.endDate) {
      if (!this.startDate || !this.endDate) {
        throw new Error('Please provide both Start and End date');
      }

      // if the end date is today, check if the date diff matches any ranges
      if (this.areTheSameDate(this.endDate, this.today)) {
        const range = Math.round(
          (this.endDate.getTime() - this.startDate.getTime()) / 86400000
        );
        if (this.allOptions.ranges.some(o => o.daysBackFromToday === range)) {
          this.setRange(range);
        }
      }
    } else {
      // initialize start and end date if not passed
      this.startDate = new Date();
      this.endDate = this.today;
      const defaultRange = this.allOptions.ranges.some(
        o => o.daysBackFromToday === this.allOptions.defaultRange
      )
        ? this.allOptions.defaultRange
        : this.allOptions.ranges[0].daysBackFromToday;
      this.setRange(defaultRange);
    }

    this.dateForm = this.fb.group({
      startDateRange: [this.formatFormDate(this.startDate), [
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(this.datePattern),
        dateValidator()]],
      endDateRange: [this.formatFormDate(this.endDate), [
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(this.datePattern),
        dateValidator()]],
    });


    if (this.dateForm.valid) {
      this.dateForm.get('startDateRange').valueChanges.subscribe((s) => {
        if (this.dateForm.get('startDateRange').valid && s !== '') {
          this.startDate = new Date(s);
          this.onInput();
        }
      });

      this.dateForm.get('endDateRange').valueChanges.subscribe((e) => {
        if (this.dateForm.get('endDateRange').valid && e !== '') {
          this.startCustomRangeSelection = false;
          this.endDate = new Date(e);
          this.onInput();
        }
      });
    }

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

  onMonthSelect(m: string) {
    this.selectedMonth = this.months.indexOf(m);
    this.toggleMm = false;
    this.getWeeks();
  }

  onYearSelect(y: number) {
    this.selectedYear = y;
    this.toggleYr = false;
    this.getWeeks();
  }

  setRange(days: number) {
    this.isCustomRange = false;
    this.numberOfDaysInRange = days;
    this.startDate = new Date(new Date().toDateString());
    this.startDate.setDate(this.today.getDate() - days);
    this.endDate = this.today;
    this.getWeeks();
    this.rangeSelected();
  }

  setCustomRange() {
    this.startDate = null;
    this.endDate = null;
    this.isCustomRange = true;
    this.getWeeks();
    this.highlightCustom = true;
  }

  toggleCalendar() {
    if (!this.disabled) {
      this.openCalendar = !this.openCalendar;
      if (this.openCalendar) {
        this.getWeeks();
      }
    }
  }

  onInput() {
    const st = this.dateForm.get('startDateRange');
    const ed = this.dateForm.get('endDateRange');
    if (this.startDate > this.endDate) {
      let temp = st.value;
      this.dateForm.get('startDateRange').setValue(this.formatFormDate(ed.value));
      this.dateForm.get('endDateRange').setValue(this.formatFormDate(temp));
    }
    this.getWeeks();
  }

  selectDate(day: Day) {
    this.isCustomRange = true;
    if (!this.startCustomRangeSelection) {
      this.startCustomRangeSelection = true;
      this.startDate = this.endDate = undefined;
    }
    if (!this.startDate) {
      this.startDate = new Date(
        `${this.selectedMonth + 1}/${day.date}/${this.selectedYear}`
      );
      day.isSelected = true;
      this.endDate = undefined;
    } else if (!this.endDate) {
      this.endDate = new Date(
        `${this.selectedMonth + 1}/${day.date}/${this.selectedYear}`
      );
      // the startDate should be before endDate
      if (this.startDate > this.endDate) {
        let temp = this.startDate;
        this.startDate = this.endDate;
        this.endDate = temp;
      }
      this.startCustomRangeSelection = false;
    } else {
      this.startDate = new Date(
        `${this.selectedMonth}/${day.date}/${this.selectedYear}`
      );
      day.isSelected = true;
    }

    this.getWeeks();
  }

  areTheSameDate(d1: Date, d2: Date) {
    if (d1 && d2) {
      return !!(
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear()
      );
    } else {
      return false;
    }
  }

  rangeSelected() {
    this.openCalendar = false;
    // this.setRangeText();
    this.setBackupDates();
    if (!this.disabled) {
      this.selected.emit({
        startDate: this.startDate,
        endDate: this.endDate
      });
    }
  }

  formatFormDate(date: Date) {
    let d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [month, day, year].join('/');
  }

  cancel() {
    this.openCalendar = false;
    this.isCustomRange = false;
    this.startCustomRangeSelection = false;
    this.startDate = this.backupStartDate;
    this.endDate = this.backupEndDate;
    if (this.backupSelectedMonth) {
      this.selectedMonth = this.backupSelectedMonth;
    }
    if (this.backupSelectedYear) {
      this.selectedYear = this.backupSelectedYear;
    }
  }

  // https://stackoverflow.com/questions/45994882/hostlistener-onclick-for-outside-click-does-not-working-in-firefox
  @HostListener('document:click', ['$event.target'])
  onClickOutside(targetElement: HTMLElement): void {
    if (!targetElement) {
      return;
    }
    // const clickedCtrl = this.elemRef.nativeElement.contains(targetElement);
    // if (!clickedCtrl) {
    //   this.toggleMm = false;
    //   this.toggleYr = false;
    // }
    const clickedInside = this.elemRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.cancel();
    }
  }

  get selectedRangeText(): string {
    return this.startDate && this.endDate
      ? `${this.formatDate(this.startDate)}  ⇢  ${this.formatDate(
        this.endDate
      )}`
      : 'Select date range';
  }

  private formatDate(date: Date) {
    return `${date.getMonth() + 1} / ${date.getDate()} / ${date.getFullYear()}`;
  }

  private getYears() {
    const maxYear = 2100;
    let minYear = 1970;
    while (minYear <= maxYear) {
      this.years.push(minYear++);
    }
  }


  private getWeeks() {
    this.weeks = [];
    if (this.selectedYear !== undefined && this.selectedMonth !== undefined) {
      let daysInMonth = this.cal.monthDays(
        this.selectedYear,
        this.selectedMonth
      );
      daysInMonth.forEach((week: number[]) => {
        let daysOfWeek: Day[] = [];
        week.forEach((day: number) => {
          daysOfWeek.push({
            date: day,
            isSelected:
              this.isSameDate(this.startDate, day) ||
              this.isSameDate(this.endDate, day),
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
    return !!(
      expected.getDate() === actual &&
      expected.getMonth() === this.selectedMonth &&
      expected.getFullYear() === this.selectedYear
    );
  }

  private isInRange(day: number): boolean {
    if (this.startDate && this.endDate && day > 0) {
      let dateBeingChecked = new Date(
        `${this.selectedMonth + 1}/${day}/${this.selectedYear}`
      );
      return (
        this.startDate <= dateBeingChecked && this.endDate >= dateBeingChecked
      );
    }
    return false;
  }

  private highlightRange() {
    if (
      this.allOptions &&
      this.allOptions.ranges &&
      this.startDate &&
      this.endDate
    ) {
      this.highlightCustom = false;
      this.numberOfDaysInRange = Math.round(
        Math.abs(
          (this.endDate.getTime() - this.startDate.getTime()) /
          (24 * 60 * 60 * 1000)
        )
      );

      // everything except Custom end at today
      if (this.areTheSameDate(this.endDate, this.today)) {
        if (
          !this.allOptions.ranges.some(
            r => r.daysBackFromToday === this.numberOfDaysInRange
          )
        ) {
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
    this.backupSelectedYear = this.selectedYear;
    this.backupSelectedMonth = this.selectedMonth;
  }
}
