import { TestBed } from '@angular/core/testing';

import { Patrol } from './patrol';

describe('Patrol', () => {
  let service: Patrol;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Patrol);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
