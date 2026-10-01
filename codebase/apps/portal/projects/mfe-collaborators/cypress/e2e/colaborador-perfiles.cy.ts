import 'cypress-axe';

describe('Flow 3: Colaborador Edita Perfiles Profesionales (Happy Path)', () => {
  const selfPartyId = 'party-self-001';
  const baseUrl = Cypress.env('BASE_URL') || 'http://localhost:4200';

  beforeEach(() => {
    cy.visit(`${baseUrl}/colaboradores/${selfPartyId}/perfiles/editar`);
  });

  it('should load profile list (empty or with existing)', () => {
    // Navigation: User lands on correct page
    cy.location('pathname').should('include', `/colaboradores/${selfPartyId}/perfiles/editar`);

    // Form Rendering: Profile list loads
    cy.get('[data-testid="profile-list"]').should('be.visible');

    // Show either empty state or list of existing profiles
    cy.get('[data-testid="profile-item"], [data-testid="empty-state"]').should('exist');
  });

  it('should show button to add new profile', () => {
    cy.get('button').contains(/Agregar|Añadir/).should('be.visible');
  });

  it('should show form when Add Profile is clicked', () => {
    // Action: Click "+ Agregar perfil"
    cy.get('button').contains(/Agregar|Añadir/).click();

    // Verify: Form appears (platform select + URL input)
    cy.get('[data-testid="profile-form"]').should('be.visible');
    cy.get('select[name="platform"]').should('be.visible');
    cy.get('input[name="url"]').should('be.visible');
  });

  it('should select platform and enter URL', () => {
    cy.get('button').contains(/Agregar|Añadir/).click();

    // Action: Select "GitHub" from dropdown
    cy.get('select[name="platform"]').select('GitHub');
    cy.get('select[name="platform"]').should('have.value', 'GitHub');

    // Action: Enter GitHub URL
    const githubUrl = 'https://github.com/username';
    cy.get('input[name="url"]').clear().type(githubUrl);
    cy.get('input[name="url"]').should('have.value', githubUrl);

    // Verify: URL validation passes
    cy.get('input[name="url"]').should('have.attr', 'aria-invalid', 'false');
  });

  it('should add profile to list', () => {
    cy.get('button').contains(/Agregar|Añadir/).click();

    cy.get('select[name="platform"]').select('GitHub');
    cy.get('input[name="url"]').clear().type('https://github.com/testuser');

    cy.intercept('POST', `**/api/v1/perfilesProf`, {
      statusCode: 201,
      body: {
        id: 'prof-001',
        platform: 'GitHub',
        url: 'https://github.com/testuser',
        createdAt: new Date().toISOString()
      }
    }).as('createProfile');

    // Action: Click "Agregar"
    cy.get('button').contains('Agregar').click();
    cy.wait('@createProfile');

    // Verify: New profile appears in list
    cy.get('[data-testid="profile-item"]').should('have.length.at.least', 1);
    cy.contains('https://github.com/testuser').should('be.visible');
  });

  it('should add multiple profiles', () => {
    // Add GitHub
    cy.get('button').contains(/Agregar|Añadir/).click();
    cy.get('select[name="platform"]').select('GitHub');
    cy.get('input[name="url"]').clear().type('https://github.com/testuser');

    cy.intercept('POST', `**/api/v1/perfilesProf`, {
      statusCode: 201,
      body: { id: 'prof-001', platform: 'GitHub', url: 'https://github.com/testuser' }
    }).as('createGitHub');

    cy.get('button').contains('Agregar').click();
    cy.wait('@createGitHub');

    // Add LinkedIn
    cy.get('button').contains(/Agregar|Añadir/).click();
    cy.get('select[name="platform"]').select('LinkedIn');
    cy.get('input[name="url"]').clear().type('https://linkedin.com/in/testuser');

    cy.intercept('POST', `**/api/v1/perfilesProf`, {
      statusCode: 201,
      body: { id: 'prof-002', platform: 'LinkedIn', url: 'https://linkedin.com/in/testuser' }
    }).as('createLinkedIn');

    cy.get('button').contains('Agregar').click();
    cy.wait('@createLinkedIn');

    // Verify: Both profiles displayed
    cy.get('[data-testid="profile-item"]').should('have.length.at.least', 2);
    cy.contains('GitHub').should('be.visible');
    cy.contains('LinkedIn').should('be.visible');
  });

  it('should delete profile with confirmation', () => {
    // Add a profile first
    cy.get('button').contains(/Agregar|Añadir/).click();
    cy.get('select[name="platform"]').select('GitHub');
    cy.get('input[name="url"]').clear().type('https://github.com/testuser');

    cy.intercept('POST', `**/api/v1/perfilesProf`, {
      statusCode: 201,
      body: { id: 'prof-001', platform: 'GitHub', url: 'https://github.com/testuser' }
    }).as('createProfile');

    cy.get('button').contains('Agregar').click();
    cy.wait('@createProfile');

    // Action: Click "Eliminar" on profile
    cy.get('[data-testid="delete-btn"]').first().click();

    // Verify: Confirmation modal
    cy.get('[role="dialog"]').should('be.visible');
    cy.get('[role="dialog"]').should('contain', 'Eliminar');

    // Intercept delete API
    cy.intercept('DELETE', `**/api/v1/perfilesProf/prof-001`, {
      statusCode: 204
    }).as('deleteProfile');

    // Action: Click "Eliminar" in modal
    cy.get('[role="dialog"]').contains('Eliminar').click();
    cy.wait('@deleteProfile');

    // Verify: Profile removed from list
    cy.get('[data-testid="profile-item"]').should('have.length', 0);
  });

  it('should validate URL format', () => {
    cy.get('button').contains(/Agregar|Añadir/).click();

    // Invalid URL
    cy.get('input[name="url"]').clear().type('not-a-valid-url');

    cy.get('input[name="url"]').should('have.attr', 'aria-invalid', 'true');
    cy.get('[role="alert"]').should('contain', 'formato');
  });

  it('should navigate back to party detail', () => {
    cy.get('button').contains('Guardar').click();

    // Verify navigation after save (if applicable)
    cy.location('pathname', { timeout: 3000 }).should('include', `/colaboradores/${selfPartyId}`);
  });

  it('should pass accessibility checks (axe-core)', () => {
    cy.injectAxe();
    cy.checkA11y(null, {
      rules: {
        'color-contrast': { enabled: true },
        'aria-required-attr': { enabled: true },
        'aria-valid-attr': { enabled: true }
      }
    });
  });

  it('should have proper ARIA labels on form fields', () => {
    cy.get('button').contains(/Agregar|Añadir/).click();

    cy.get('select[name="platform"]').should('have.attr', 'aria-label');
    cy.get('input[name="url"]').should('have.attr', 'aria-label');
  });

  it('should support keyboard navigation', () => {
    cy.get('button').contains(/Agregar|Añadir/).focus();
    cy.focused().should('contain', /Agregar|Añadir/);

    cy.get('button').contains(/Agregar|Añadir/).tab();
  });

  it('should show profile list operations (edit/delete)', () => {
    // Add a profile first
    cy.get('button').contains(/Agregar|Añadir/).click();
    cy.get('select[name="platform"]').select('GitHub');
    cy.get('input[name="url"]').clear().type('https://github.com/testuser');

    cy.intercept('POST', `**/api/v1/perfilesProf`, {
      statusCode: 201,
      body: { id: 'prof-001', platform: 'GitHub', url: 'https://github.com/testuser' }
    }).as('createProfile');

    cy.get('button').contains('Agregar').click();
    cy.wait('@createProfile');

    // Verify: List item has action buttons
    cy.get('[data-testid="profile-item"]').first().within(() => {
      cy.get('[data-testid="delete-btn"]').should('be.visible');
    });
  });

  it('should display success message after profile operations', () => {
    cy.get('button').contains(/Agregar|Añadir/).click();
    cy.get('select[name="platform"]').select('GitHub');
    cy.get('input[name="url"]').clear().type('https://github.com/testuser');

    cy.intercept('POST', `**/api/v1/perfilesProf`, {
      statusCode: 201,
      body: { id: 'prof-001', platform: 'GitHub', url: 'https://github.com/testuser' }
    }).as('createProfile');

    cy.get('button').contains('Agregar').click();
    cy.wait('@createProfile');

    // Success message
    cy.get('[role="status"], [aria-live="polite"]').should('be.visible');
  });
});
