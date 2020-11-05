import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DexCal2Component } from './dex-cal2.component';

describe('DexCal2Component', () => {
  let component: DexCal2Component;
  let fixture: ComponentFixture<DexCal2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DexCal2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DexCal2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
