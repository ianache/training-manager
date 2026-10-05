import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SessionService } from '@gf/core';
import { NEVER, Observable, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { InternalOrganization } from '../../data-access/organizations.models';
import { OrganizationsService } from '../../data-access/organizations.service';
import { UNITS_URL } from '../../shared/unit-nav';
import { InternalOrganizationPage } from './internal-organization.page';

const ORG: InternalOrganization = { id: 'o-1', name: 'COMSATEL S.A.', ruc: '20123456789', ruc_country: 'PE', from_date: '2020-03-05', thru_date: null };
const notFound = () => new HttpErrorResponse({ status: 404, error: { error: { code: 'INTERNAL_ORGANIZATION_NOT_FOUND', message: 'm', status: 404, timestamp: 't' } } });

describe('InternalOrganizationPage (SCR-017-01 organización interna, SCR-017-03 acceso no autorizado)', () => {
  let fixture: ComponentFixture<InternalOrganizationPage>;
  let api: { internalOrganization: ReturnType<typeof vi.fn> };
  const el = () => fixture.nativeElement as HTMLElement;
  const text = () => el().textContent ?? '';

  async function open(result: () => Observable<InternalOrganization>, allowed = true) {
    api = { internalOrganization: vi.fn(result) };
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: OrganizationsService, useValue: api }, { provide: SessionService, useValue: { hasAnyRole: () => allowed } }],
    });
    fixture = TestBed.createComponent(InternalOrganizationPage);
    document.body.appendChild(el());
    await settle();
  }
  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }
  beforeEach(() => {
    TestBed.resetTestingModule();
    document.body.innerHTML = '';
  });

  it('registrada: muestra razón social, RUC, país emisor y «Vigente desde» en una lista de descripción de solo lectura', async () => {
    await open(() => of(ORG));
    expect(el().querySelector('h1')!.textContent).toContain('Organización interna');
    const dl = el().querySelector('dl')!;
    const pairs = Array.from(dl.querySelectorAll('.gf-dl__group')).map((g) => [g.querySelector('dt')!.textContent!.trim(), g.querySelector('dd')!.textContent!.replace(/\s+/g, ' ').trim()]);
    expect(pairs).toEqual(expect.arrayContaining([['Razón social', 'COMSATEL S.A.'], ['RUC', '20123456789'], ['País emisor', 'Perú']]));
    expect(text()).toContain('Vigente desde 05/03/2020');
    expect(el().querySelector('input, select, form')).toBeNull();
  });

  it('no ofrece «Registrar organización interna»: la carga es inicial y fuera de la API (BR-PTY-28)', async () => {
    await open(() => of(ORG));
    expect(text()).not.toContain('Registrar organización');
    TestBed.resetTestingModule();
    await open(() => throwError(() => notFound()), true);
    expect(text()).not.toContain('Registrar organización');
  });

  it('ofrece continuar a la gestión de unidades', async () => {
    await open(() => of(ORG));
    const link = Array.from(el().querySelectorAll('a')).find((a) => a.textContent!.includes('Continuar a unidades'))!;
    expect(link.getAttribute('href')).toBe(UNITS_URL);
  });

  it('un país distinto de Perú se muestra con su código y un valor ausente con «—»', async () => {
    await open(() => of({ ...ORG, ruc: null, ruc_country: 'CL' }));
    expect(text()).toContain('CL');
    expect(text()).toContain('—');
  });

  it('404 INTERNAL_ORGANIZATION_NOT_FOUND: estado vacío «Aún no has registrado la organización interna.», distinto de un error', async () => {
    await open(() => throwError(() => notFound()));
    expect(text()).toContain('Aún no has registrado la organización interna.');
    expect(el().querySelector('[role="alert"]')).toBeNull();
  });

  it('un error de carga muestra el aviso con «Reintentar», distinto del vacío, y reintenta', async () => {
    await open(() => throwError(() => new HttpErrorResponse({ status: 500 })));
    expect(el().querySelector('[role="alert"]')).toBeTruthy();
    expect(text()).not.toContain('Aún no has registrado');
    api.internalOrganization.mockReturnValue(of(ORG));
    Array.from(el().querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent!.trim() === 'Reintentar')!.click();
    await settle();
    expect(text()).toContain('COMSATEL S.A.');
  });

  it('muestra «Cargando» mientras consulta', async () => {
    await open(() => NEVER);
    expect(text()).toContain('Cargando');
  });

  it('403 del servicio: SCR-017-03 «No tienes permiso para gestionar la organización interna.» con el foco movido al mensaje', async () => {
    await open(() => throwError(() => new HttpErrorResponse({ status: 403 })));
    expect(text()).toContain('No tienes permiso para gestionar la organización interna.');
    expect(el().querySelector('dl')).toBeNull();
    expect(document.activeElement?.textContent).toContain('No tienes permiso');
  });

  it('sin rol de gestión: SCR-017-03 sin consultar a la API', async () => {
    await open(() => of(ORG), false);
    expect(text()).toContain('No tienes permiso para gestionar la organización interna.');
    expect(api.internalOrganization).not.toHaveBeenCalled();
    expect(text()).not.toContain('COMSATEL');
  });
});
