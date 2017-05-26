/// <reference path="./jasmine-custom-matchers.d.ts"/>

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Component } from '@angular/core';

import { DexCalComponent } from './dex-cal.component';
import { customDateMatchers } from './jasmine-custom-matchers';
import { DexSelectedRange, DexCalOptions } from './models';

describe('dex-cal component', function () {
  let de: DebugElement;
  let comp: DexCalComponent;
  let fixture: ComponentFixture<DexCalComponent>;
  let today: Date;
  let yesterday: Date;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DexCalComponent]
    })
      .compileComponents();

    jasmine.addMatchers(customDateMatchers);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DexCalComponent);
    comp = fixture.componentInstance;
    today = new Date();
    yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
  });

  it('should create component', () => expect(comp).toBeDefined());

  it('should have current month weeks', () => {
    fixture.detectChanges();
    expect(comp.weeks.length).toBeGreaterThan(0);
  });

  describe('Next month button', () => {
    it('should change month to next month', () => {
      const expected = 1;
      comp.selectedMonth = 0;
      comp.nextMonth();
      expect(comp.selectedMonth).toEqual(expected);
    });

    it('should change the year when current month is Dec', () => {
      const expected = 2018;
      comp.selectedYear = 2017;
      comp.selectedMonth = 12;
      comp.nextMonth();
      expect(comp.selectedYear).toEqual(expected);
    });
  });

  describe('Prev month button', () => {
    it('should change month to previous month', () => {
      const expected = 5;
      comp.selectedMonth = 6;
      comp.previousMonth();
      expect(comp.selectedMonth).toEqual(expected);
    });

    it('should change the year when current month is Jan', () => {
      const expected = 2016;
      comp.selectedYear = 2017;
      comp.selectedMonth = 0;
      comp.previousMonth();
      expect(comp.selectedYear).toEqual(expected);
    });
  });

  describe('Year', () => {
    it('should go back a year upon clicking previous year', () => {
      const expected = 2016;
      comp.selectedYear = 2017;
      comp.previousYear();
      expect(comp.selectedYear).toEqual(expected);
    });

    it('should go forward a year upon clicking next year', () => {
      const expected = 2018;
      comp.selectedYear = 2017;
      comp.nextYear();
      expect(comp.selectedYear).toEqual(expected);
    });
  });

  it('should have a default range of yesterday set', () => {
    fixture.detectChanges();
    expect(comp.startDate).toBeTheSameDate(yesterday);
  });

  it('should let one change the range using setRange', () => {
    let aWeekAgo = new Date();
    aWeekAgo.setDate(today.getDate() - 7);
    comp.setRange(7);
    expect(comp.startDate).toBeTheSameDate(aWeekAgo);
  });

  it('should set the enddate to today if a predefined range is chosen', () => {
    fixture.detectChanges();
    expect(comp.endDate).toBeTheSameDate(today);
  });

  it('should fire a selected event when a range is selected', () => {
    comp.selected.subscribe((eventData: DexSelectedRange) => {
      expect(eventData.startDate).toBeTheSameDate(yesterday);
      expect(eventData.endDate).toBeTheSameDate(today);
    });
    comp.setRange(1);
  });

  // it('should throw an error if only one of the start or end date Inputs are provided', () => {
  //   expect(function() {
  //     let fx = TestBed.createComponent(DexCalComponent);
  //     let cmp = fx.componentInstance;
  //     cmp.startDate = new Date();
  //     fixture.detectChanges();
  //   }).toThrow();
  // });

  it('should use the start & end dates if provided ', () => {
    let d = new Date();
    let sDate = new Date();
    let eDate = new Date();
    sDate.setDate(d.getDate() - 5);
    eDate.setDate(d.getDate() - 2);
    comp.startDate = sDate;
    comp.endDate = eDate;
    fixture.detectChanges();
    expect(comp.startDate).toBeTheSameDate(sDate);
    expect(comp.endDate).toBeTheSameDate(eDate);
  });

  it('should set the range if possible when start & end dates are provided ', () => {
    spyOn(comp, 'setRange');
    let d = new Date();
    let sDate = new Date();
    let eDate = new Date();
    sDate.setDate(d.getDate() - 7);
    comp.startDate = sDate;
    comp.endDate = eDate;
    fixture.detectChanges();
    expect(comp.setRange).toHaveBeenCalled();
  });

  it('should be able to set a different default range', () => {
    let options: DexCalOptions = {
      defaultRange: 7
    };
    let oneWeek = new Date();
    oneWeek.setDate(oneWeek.getDate() - 7);
    comp.options = options;
    fixture.detectChanges();
    expect(comp.startDate).toBeTheSameDate(oneWeek);
  });

  it('should pick the first date it the ranges if a non existent default range is provided', () => {
    let options: DexCalOptions = {
      defaultRange: 2
    };
    comp.options = options;
    fixture.detectChanges();
    expect(comp.startDate).toBeTheSameDate(yesterday);
  });

});

describe('test inside a test component', () => {
  let testFixture: ComponentFixture<TestHostComponent>;
  let testHost: TestHostComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DexCalComponent, TestHostComponent], // declare both
    }).compileComponents();
  }));

  beforeEach(() => {
    // create TestHostComponent instead of DashboardHeroComponent
    testFixture = TestBed.createComponent(TestHostComponent);
    testHost = testFixture.componentInstance;
    testFixture.detectChanges(); // trigger initial data binding
  });

  // it('should use start and end date if provided and ignore default range', () => {
  //   console.log(testHost);
  // });
});

@Component({
  template: `<dex-cal [options]="calendarOptions"></dex-cal>`
})
class TestHostComponent {
  calendarOptions: DexCalOptions = {
    label: 'Select'
  }
}
