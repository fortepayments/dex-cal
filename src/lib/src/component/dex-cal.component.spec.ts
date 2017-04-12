import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DexCalComponent } from './dex-cal.component';

describe('Component', function () {
  let de: DebugElement;
  let comp: DexCalComponent;
  let fixture: ComponentFixture<DexCalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DexCalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DexCalComponent);
    comp = fixture.componentInstance;
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
      console.log(comp.selectedYear);
      expect(comp.selectedYear).toEqual(expected);
    });

  });

});
