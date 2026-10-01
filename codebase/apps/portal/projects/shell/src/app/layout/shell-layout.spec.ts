import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppRole, SessionService } from '@gf/core';
import { ShellLayout } from './shell-layout';

describe('ShellLayout', () => {
  function render(roles: AppRole[]) {
    TestBed.configureTestingModule({
      imports: [ShellLayout],
      providers: [provideRouter([]), provideHttpClient()],
    });
    const session = TestBed.inject(SessionService);
    vi.spyOn(session, 'roles').mockReturnValue(roles);
    const fixture = TestBed.createComponent(ShellLayout);
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
});
