/// <reference path="./jasmine-custom-matchers.d.ts"/>

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DexCalComponent} from './dex-cal.component';
import { customDateMatchers } from './jasmine-custom-matchers';
import { DexSelectedRange } from './models';

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
    expect(comp.startDate).toBeTheSameDate(yesterday);
  });

  it('should let one change the range using setRange', () => {
    let aWeekAgo = new Date();
    aWeekAgo.setDate(today.getDate() - 7);
    comp.setRange(7);
    expect(comp.startDate).toBeTheSameDate(aWeekAgo);
    //sdf
  });

  it('should set the enddate today if a predefined range is chosen', () => {
    expect(comp.endDate).toBeTheSameDate(today);
  });


  it('should fire a selected event when a range is selected', () => {
    comp.selected.subscribe((eventData: DexSelectedRange) => {
      expect(eventData.startDate).toBeTheSameDate(yesterday);
      expect(eventData.endDate).toBeTheSameDate(today);
    });
    comp.setRange(1);
  });
  

});

