import { TestBed } from '@angular/core/testing';

import { MetaService } from './meta.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MetaService', () => {
  let service: MetaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(MetaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
