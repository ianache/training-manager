import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RegisterCollaboratorCommand, RegisterCollaboratorPayload } from './register-collaborator.command';

describe('RegisterCollaboratorCommand', () => {
  let service: RegisterCollaboratorCommand;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RegisterCollaboratorCommand]
    });
    service = TestBed.inject(RegisterCollaboratorCommand);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should post to /api/v1/parties', (done) => {
    const payload: RegisterCollaboratorPayload = {
      tipo: 'empleado',
      nombres: 'Juan',
      apellidos: 'Pérez',
      tipoIdentificacion: 'DNI',
      numeroIdentificacion: '12345678',
      correoLaboral: 'juan@test.com',
      rolId: 'role-1',
      nivelId: 'level-1',
      fechaDesde: new Date()
    };

    service.payload = payload;
    service.execute().subscribe(result => {
      expect(result.codigo).toBe('COLLAB-001');
      done();
    });

    const req = httpMock.expectOne('/api/v1/parties');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.has('X-User-Name')).toBe(true);
    expect(req.request.headers.has('X-Request-ID')).toBe(true);
    req.flush({ codigo: 'COLLAB-001', mensaje: 'Success' });
  });

  it('should include X-User-Name header', (done) => {
    service.payload = {} as any;
    service.execute().subscribe(() => done());
    const req = httpMock.expectOne('/api/v1/parties');
    expect(req.request.headers.get('X-User-Name')).toBeDefined();
    req.flush({ codigo: 'OK' });
  });
});
