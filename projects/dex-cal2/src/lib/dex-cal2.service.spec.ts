import { TestBed } from '@angular/core/testing';

import { DexCal2Service } from './dex-cal2.service';

describe('DexCal2Service', () => {
  let service: DexCal2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DexCal2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
