import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormControl } from '@angular/forms';
import { DuplicateIdValidator } from './duplicate-id.validator';

describe('DuplicateIdValidator', () => {
  let validator: DuplicateIdValidator;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DuplicateIdValidator]
    });
    validator = TestBed.inject(DuplicateIdValidator);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return null if ID is empty', (done) => {
    const control = new FormControl('');
    validator.validate(control).subscribe(result => {
      expect(result).toBeNull();
      done();
    });
  });

  it('should check for duplicate ID', (done) => {
    const control = new FormControl('12345678');
    setTimeout(() => {
      const req = httpMock.expectOne('/api/v1/parties/check-id/12345678');
      req.flush({ exists: true });
    }, 350);

    validator.validate(control).subscribe(result => {
      expect(result?.['duplicateId']).toBe(true);
      done();
    });
  });
});
