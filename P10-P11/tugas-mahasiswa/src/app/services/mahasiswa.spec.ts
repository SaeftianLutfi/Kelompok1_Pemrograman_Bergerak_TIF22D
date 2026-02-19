import { TestBed } from '@angular/core/testing';

import { Mahasiswa } from './mahasiswa';

describe('Mahasiswa', () => {
  let service: Mahasiswa;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Mahasiswa);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
