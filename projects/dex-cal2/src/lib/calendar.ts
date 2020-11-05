export class Calendar {
    firstWeekDay: number;

    constructor(firstWeekDay = 0) {
        this.firstWeekDay = firstWeekDay;
        for (let i = 0; i < MONTHS.length; i++) {
            Calendar[MONTHS[i]] = i;
        }
    }

    weekStartDate(date: Date) {
        let startDate = new Date(date.getTime());
        while (startDate.getDay() !== this.firstWeekDay) {
            startDate.setDate(startDate.getDate() - 1);
        }
        return startDate;
    }

    monthDates(year: number, month: number, dayFormatter?: any, weekFormatter?: any) {
        if ((typeof year !== 'number') || (year < 1970)) {
            throw new CalendarException('year must be a number >= 1970');
        };
        if ((typeof month !== 'number') || (month < 0) || (month > 11)) {
            throw new CalendarException('month must be a number (Jan is 0)');
        };
        let weeks: any = [],
            week: Date[] = [],
            i = 0,
            date = this.weekStartDate(new Date(year, month, 1));
        do {
            for (i = 0; i < 7; i++) {
                week.push(dayFormatter ? dayFormatter(date) : date);
                date = new Date(date.getTime());
                date.setDate(date.getDate() + 1);
            }
            weeks.push(weekFormatter ? weekFormatter(week) : week);
            week = [];
        } while ((date.getMonth() <= month) && (date.getFullYear() === year));
        return weeks;
    }

    monthDays(year: number, month: number) {
        return this.monthDates(year, month, (date: Date) => date.getMonth() === month ? date.getDate() : 0);
    }

    monthText(year: number, month: number) {
        if (typeof year === 'undefined') {
            let now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
        };
        let getDayOrBlank = function getDayOrBlank(date: Date) {
            let s = date.getMonth() === month ? date.getDate().toString() : '  ';
            while (s.length < 2) { s = ' ' + s; };
            return s;
        };
        let weeks = this.monthDates(year, month, getDayOrBlank,
            function (week: any) { return week.join(' '); });
        return weeks.join('\n');
    }
}

export class CalendarException {
    constructor(private message: string) { }

    toString() {
        return `${this.constructor.name} : ${this.message}`;
    }
}

export const MONTHS = 'JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC'.split(' ');