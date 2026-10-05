import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppRole, SessionService } from '@gf/core';
import { ShellLayout } from './shell-layout';

@Component({ template: '' })
class Blank {}

describe('ShellLayout', () => {
  let fx: ComponentFixture<ShellLayout>;
  function render(roles: AppRole[]) {
    TestBed.configureTestingModule({
      imports: [ShellLayout],
      providers: [provideRouter([{ path: '**', component: Blank }]), provideHttpClient()],
    });
    const session = TestBed.inject(SessionService);
    vi.spyOn(session, 'roles').mockReturnValue(roles);
    const fixture = TestBed.createComponent(ShellLayout);
    fx = fixture;
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('ofrece "Saltar al contenido" hacia el main', () => {
    const el = render([]);
    expect(el.querySelector('a.skip-link')?.getAttribute('href')).toBe('#main-content');
    expect(el.querySelector('main#main-content')).toBeTruthy();
  });

  it('un colaborador no ve el catálogo', () => {
    const el = render([AppRole.Colaborador]);
    expect(el.textContent).toContain('Mi perfil de competencias');
    expect(el.textContent).not.toContain('Roles y competencias');
  });

  it('el Jefe de Ingeniería ve el catálogo y colaboradores', () => {
    const el = render([AppRole.JefeIngenieria]);
    expect(el.textContent).toContain('Roles y competencias');
    expect(el.textContent).toContain('Colaboradores');
  });

  describe('«Unidades organizacionales» en el menú lateral (GEN-028/029/030)', () => {
    const link = (el: HTMLElement) =>
      Array.from(el.querySelectorAll<HTMLAnchorElement>('nav.sidebar a')).find((a) => a.textContent?.includes('Unidades organizacionales'));

    it('el Jefe de Ingeniería lo ve, enlazado a /colaboradores/unidades', () => {
      const a = link(render([AppRole.JefeIngenieria]));
      expect(a).toBeTruthy();
      expect(a!.getAttribute('href')).toBe('/colaboradores/unidades');
    });

    it('ADMIN lo ve', () => {
      expect(link(render([AppRole.Admin]))).toBeTruthy();
    });

    it('un colaborador, otros roles y un usuario sin roles no lo ven', () => {
      for (const roles of [[AppRole.Colaborador], [AppRole.JefeProyecto, AppRole.Evaluador], [AppRole.ProductOwner, AppRole.Direccion, AppRole.Gerencia], []]) {
        TestBed.resetTestingModule();
        expect(link(render(roles))).toBeUndefined();
      }
    });

    it('va en la sección PERSONAS, justo después de «Colaboradores»', () => {
      const el = render([AppRole.JefeIngenieria]);
      const sections = Array.from(el.querySelectorAll('nav.sidebar h2'));
      const personas = sections.find((h) => h.textContent?.trim() === 'Personas')!;
      const items = Array.from(personas.nextElementSibling!.querySelectorAll('a')).map((a) => a.textContent!.trim());
      expect(items).toEqual(['Colaboradores', 'Unidades organizacionales']);
    });

    it('lleva un icono decorativo con aria-hidden', () => {
      const svg = link(render([AppRole.Admin]))!.querySelector('svg');
      expect(svg).toBeTruthy();
      expect(svg!.getAttribute('aria-hidden')).toBe('true');
    });

    it('en la ruta activa solo ese ítem lleva aria-current="page" (no «Colaboradores»)', async () => {
      const el = render([AppRole.JefeIngenieria]);
      await TestBed.inject(Router).navigateByUrl('/colaboradores/unidades/u-1/editar');
      await fx.whenStable();
      fx.detectChanges();
      const current = Array.from(el.querySelectorAll('nav.sidebar [aria-current="page"]')).map((a) => a.textContent!.trim());
      expect(current).toEqual(['Unidades organizacionales']);
    });

    it('en una ruta de colaboradores el ítem activo es «Colaboradores» y no el de unidades', async () => {
      const el = render([AppRole.JefeIngenieria]);
      await TestBed.inject(Router).navigateByUrl('/colaboradores/abc');
      await fx.whenStable();
      fx.detectChanges();
      const current = Array.from(el.querySelectorAll('nav.sidebar [aria-current="page"]')).map((a) => a.textContent!.trim());
      expect(current).toEqual(['Colaboradores']);
    });

    it('es alcanzable por teclado: enlace con href, sin tabindex negativo, después de «Colaboradores», y recibe foco', () => {
      const el = render([AppRole.JefeIngenieria]);
      document.body.appendChild(el);
      const anchors = Array.from(el.querySelectorAll<HTMLAnchorElement>('nav.sidebar a'));
      const a = link(el)!;
      expect(a.hasAttribute('href')).toBe(true);
      expect(a.getAttribute('tabindex')).not.toBe('-1');
      expect(anchors.indexOf(a)).toBe(anchors.findIndex((x) => x.textContent!.includes('Colaboradores')) + 1);
      a.focus();
      expect(document.activeElement).toBe(a);
      el.remove();
    });
  });
});
