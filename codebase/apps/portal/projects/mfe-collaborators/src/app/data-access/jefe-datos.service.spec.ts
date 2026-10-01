import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { JefeDatosService, JefeDatosPayload } from './jefe-datos.service';
import { APP_CONFIG } from '@gf/core';

describe('JefeDatosService', () => {
  let service: JefeDatosService;
  let httpMock: HttpTestingController;
  const mockConfig = { apiBaseUrl: 'http://localhost:3000/api/v1' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        JefeDatosService,
        { provide: APP_CONFIG, useValue: mockConfig }
      ]
    });
    service = TestBed.inject(JefeDatosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('updateDatos', () => {
    it('should call POST endpoint with correct URL', () => {
      const partyId = 'test-party-123';
      const payload: JefeDatosPayload = {
        nombres: 'Juan Carlos',
        apellidos: 'Pérez García',
        tipoIdentificacion: 'DNI',
        numeroIdentificacion: '12345678',
        paisIdentificacion: 'PE'
      };

      service.updateDatos(partyId, payload).subscribe();

      const req = httpMock.expectOne(
        'http://localhost:3000/api/v1/parties/test-party-123/data'
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush({ success: true });
    });

    it('should send payload with all required fields', () => {
      const partyId = 'party-001';
      const payload: JefeDatosPayload = {
        nombres: 'María',
        apellidos: 'López',
        tipoIdentificacion: 'DNI',
        numeroIdentificacion: '87654321',
        paisIdentificacion: 'PE'
      };

      service.updateDatos(partyId, payload).subscribe();

      const req = httpMock.expectOne(
        'http://localhost:3000/api/v1/parties/party-001/data'
      );
      expect(req.request.body.nombres).toBe('María');
      expect(req.request.body.apellidos).toBe('López');
      expect(req.request.body.tipoIdentificacion).toBe('DNI');
      expect(req.request.body.numeroIdentificacion).toBe('87654321');
      expect(req.request.body.paisIdentificacion).toBe('PE');
      req.flush({});
    });

    it('should include optional nombrePreferido field', () => {
      const partyId = 'party-002';
      const payload: JefeDatosPayload = {
        nombres: 'Juan Carlos',
        apellidos: 'Pérez',
        nombrePreferido: 'Juan',
        tipoIdentificacion: 'DNI',
        numeroIdentificacion: '11111111',
        paisIdentificacion: 'PE'
      };

      service.updateDatos(partyId, payload).subscribe();

      const req = httpMock.expectOne(
        'http://localhost:3000/api/v1/parties/party-002/data'
      );
      expect(req.request.body.nombrePreferido).toBe('Juan');
      req.flush({});
    });

    it('should return success response', (done) => {
      const partyId = 'party-003';
      const payload: JefeDatosPayload = {
        nombres: 'Test',
        apellidos: 'User',
        tipoIdentificacion: 'DNI',
        numeroIdentificacion: '12345678',
        paisIdentificacion: 'PE'
      };
      const mockResponse = {
        id: 'party-003',
        nombres: 'Test',
        apellidos: 'User',
        updatedAt: '2026-10-01T12:00:00Z'
      };

      service.updateDatos(partyId, payload).subscribe(
        (response) => {
          expect(response.id).toBe('party-003');
          expect(response.nombres).toBe('Test');
          done();
        },
        (error) => {
          fail('should not have errored: ' + error);
        }
      );

      const req = httpMock.expectOne(
        'http://localhost:3000/api/v1/parties/party-003/data'
      );
      req.flush(mockResponse);
    });

    it('should encode partyId in URL', () => {
      const partyId = 'party-with-special/chars';
      const payload: JefeDatosPayload = {
        nombres: 'Test',
        apellidos: 'User',
        tipoIdentificacion: 'DNI',
        numeroIdentificacion: '12345678',
        paisIdentificacion: 'PE'
      };

      service.updateDatos(partyId, payload).subscribe();

      const req = httpMock.expectOne((req) =>
        req.url.includes('party-with-special%2Fchars')
      );
      expect(req.request.method).toBe('POST');
      req.flush({});
    });
  });

  describe('Error handling', () => {
    it('should handle API error response', (done) => {
      const partyId = 'party-004';
      const payload: JefeDatosPayload = {
        nombres: 'Test',
        apellidos: 'User',
        tipoIdentificacion: 'DNI',
        numeroIdentificacion: '12345678',
        paisIdentificacion: 'PE'
      };
      const errorResponse = {
        message: 'Validation failed'
      };

      service.updateDatos(partyId, payload).subscribe(
        () => {
          fail('should have errored');
        },
        (error) => {
          expect(error.message).toBe('Validation failed');
          done();
        }
      );

      const req = httpMock.expectOne(
        'http://localhost:3000/api/v1/parties/party-004/data'
      );
      req.flush(errorResponse, {
        status: 400,
        statusText: 'Bad Request'
      });
    });

    it('should handle network error', (done) => {
      const partyId = 'party-005';
      const payload: JefeDatosPayload = {
        nombres: 'Test',
        apellidos: 'User',
        tipoIdentificacion: 'DNI',
        numeroIdentificacion: '12345678',
        paisIdentificacion: 'PE'
      };

      service.updateDatos(partyId, payload).subscribe(
        () => {
          fail('should have errored');
        },
        (error) => {
          expect(error.message).toBe('Error al actualizar datos');
          done();
        }
      );

      const req = httpMock.expectOne(
        'http://localhost:3000/api/v1/parties/party-005/data'
      );
      req.error(new ErrorEvent('Network error'));
    });

    it('should handle 409 conflict error', (done) => {
      const partyId = 'party-006';
      const payload: JefeDatosPayload = {
        nombres: 'Test',
        apellidos: 'User',
        tipoIdentificacion: 'DNI',
        numeroIdentificacion: '12345678',
        paisIdentificacion: 'PE'
      };

      service.updateDatos(partyId, payload).subscribe(
        () => {
          fail('should have errored');
        },
        (error) => {
          expect(error).toBeTruthy();
          done();
        }
      );

      const req = httpMock.expectOne(
        'http://localhost:3000/api/v1/parties/party-006/data'
      );
      req.flush(
        { message: 'Duplicate identification number' },
        { status: 409, statusText: 'Conflict' }
      );
    });

    it('should handle 500 server error', (done) => {
      const partyId = 'party-007';
      const payload: JefeDatosPayload = {
        nombres: 'Test',
        apellidos: 'User',
        tipoIdentificacion: 'DNI',
        numeroIdentificacion: '12345678',
        paisIdentificacion: 'PE'
      };

      service.updateDatos(partyId, payload).subscribe(
        () => {
          fail('should have errored');
        },
        (error) => {
          expect(error).toBeTruthy();
          done();
        }
      );

      const req = httpMock.expectOne(
        'http://localhost:3000/api/v1/parties/party-007/data'
      );
      req.flush(
        { message: 'Internal Server Error' },
        { status: 500, statusText: 'Internal Server Error' }
      );
    });
  });

  describe('Data validation', () => {
    it('should accept valid payload', () => {
      const payload: JefeDatosPayload = {
        nombres: 'Juan Carlos',
        apellidos: 'Pérez García',
        nombrePreferido: 'Juan',
        tipoIdentificacion: 'DNI',
        numeroIdentificacion: '12345678',
        paisIdentificacion: 'PE'
      };

      expect(payload.nombres).toBeTruthy();
      expect(payload.apellidos).toBeTruthy();
      expect(payload.tipoIdentificacion).toBeTruthy();
      expect(payload.numeroIdentificacion).toBeTruthy();
      expect(payload.paisIdentificacion).toBeTruthy();
    });

    it('should allow empty nombrePreferido', () => {
      const payload: JefeDatosPayload = {
        nombres: 'Juan',
        apellidos: 'Pérez',
        tipoIdentificacion: 'DNI',
        numeroIdentificacion: '12345678',
        paisIdentificacion: 'PE'
      };

      expect(payload.nombrePreferido).toBeUndefined();
    });
  });

  describe('Observable behavior', () => {
    it('should return cold observable', () => {
      const partyId = 'party-008';
      const payload: JefeDatosPayload = {
        nombres: 'Test',
        apellidos: 'User',
        tipoIdentificacion: 'DNI',
        numeroIdentificacion: '12345678',
        paisIdentificacion: 'PE'
      };

      const observable = service.updateDatos(partyId, payload);

      // No request should be made until subscription
      expect(httpMock.match(() => false).length).toBe(0);

      observable.subscribe();

      const req = httpMock.expectOne(
        'http://localhost:3000/api/v1/parties/party-008/data'
      );
      req.flush({});
    });

    it('should support multiple subscriptions', () => {
      const partyId = 'party-009';
      const payload: JefeDatosPayload = {
        nombres: 'Test',
        apellidos: 'User',
        tipoIdentificacion: 'DNI',
        numeroIdentificacion: '12345678',
        paisIdentificacion: 'PE'
      };

      const observable = service.updateDatos(partyId, payload);

      observable.subscribe();
      observable.subscribe();

      const requests = httpMock.match(
        'http://localhost:3000/api/v1/parties/party-009/data'
      );
      expect(requests.length).toBe(2);
      requests.forEach((req) => req.flush({}));
    });
  });
});
