import { TestBed } from '@angular/core/testing';

import { GeoipDataService } from './geoip-data.service';

describe('GeoipDataService', () => {
  let service: GeoipDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoipDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
