/// <reference path="./jasmine-custom-matchers.d.ts"/>

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DexCalComponent } from './dex-cal.component';
import { customDateMatchers } from './jasmine-custom-matchers';
import { DexSelectedRange } from './models';

describe('dex-cal component - custom dates ', function () {
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


    it('should set the isCustomRange flag to true when the custom option is selected', () => {
        expect(comp.isCustomRange).toBeFalsy();
        comp.setCustomRange();
        expect(comp.isCustomRange).toBeTruthy();
    });

    describe('Clicking the first date', () => {
        it('should set startDate', () => {
            comp.selectDate({ date: 1 });
            expect(comp.startDate.getDate()).toEqual(1);
        });


        it('should set the isCustomRange flag to true', () => {
            expect(comp.isCustomRange).toBeFalsy();
            comp.selectDate({ date: 1 });
            expect(comp.isCustomRange).toBeTruthy();
        });
    });

    describe('Clicking the second date', () => {
        it('should set the endDate', () => {
            comp.selectDate({ date: 1 });
            comp.selectDate({ date: 2 });
            expect(comp.endDate.getDate()).toEqual(2);
        });

        it('should maintain the start date and the end date', () => {
            comp.selectDate({ date: 1 });
            comp.selectDate({ date: 2 });
            expect(comp.startDate.getDate()).toEqual(1);
            expect(comp.endDate.getDate()).toEqual(2);
        });
    });

    describe('Clicking a date third time', () => {
        it('should set the startDate', () => {
            comp.selectDate({ date: 1 });
            comp.selectDate({ date: 2 });
            comp.selectDate({ date: 3 });
            expect(comp.startDate.getDate()).toEqual(3);
        });

        it('should reset the endDate', () => {
            comp.selectDate({ date: 1 });
            comp.selectDate({ date: 2 });
            comp.selectDate({ date: 3 });
            expect(comp.startDate.getDate()).toEqual(3);
            expect(comp.endDate).toBeUndefined();
        });
    });

    describe('Clicking a date fourth time', () => {
        it('should set both the start and endDate', () => {
            comp.selectDate({ date: 1 });
            comp.selectDate({ date: 2 });
            comp.selectDate({ date: 3 });
            comp.selectDate({ date: 4 });
            expect(comp.startDate.getDate()).toEqual(3);
            expect(comp.endDate.getDate()).toEqual(4);
        });
    });

    it('should set the start and end dates correctly when picked in any order', () => {
        comp.selectDate({ date: 2 });
        comp.selectDate({ date: 1 });
        expect(comp.startDate.getDate()).toEqual(1);
        expect(comp.endDate.getDate()).toEqual(2);
    });
});
