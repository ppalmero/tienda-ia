import { TestBed } from '@angular/core/testing';

import { CargaJsonFirebaseService } from './carga-json-firebase.service';

describe('CargaJsonFirebaseService', () => {
  let service: CargaJsonFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CargaJsonFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
