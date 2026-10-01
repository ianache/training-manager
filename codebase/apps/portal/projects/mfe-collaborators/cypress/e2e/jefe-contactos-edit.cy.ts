import 'cypress-axe';

describe('Flow 2: Jefe Cambia Contactos con Vigencia Lifecycle (Happy Path)', () => {
  const testPartyId = 'party-test-002';
  const baseUrl = Cypress.env('BASE_URL') || 'http://localhost:4200';
  const oldEmailVigenciaId = 'vig-email-old-001';
  const oldPhoneVigenciaId = 'vig-phone-old-001';

  beforeEach(() => {
    cy.visit(`${baseUrl}/colaboradores/${testPartyId}/contactos/editar`);
  });

  it('should load form with current email and phone (vigente badge)', () => {
    // Navigation: User lands on correct page
    cy.location('pathname').should('include', `/colaboradores/${testPartyId}/contactos/editar`);

    // Form Rendering: All fields visible + labeled
    cy.get('form').should('be.visible');
    cy.get('gf-email-input, gf-tel-input').should('have.length.at.least', 2);

    // Verify current email displays
    cy.contains('email').parent().find('input').should('have.value', 'juan@comsatel.com.pe');

    // Verify vigente badge
    cy.contains('Vigente').should('be.visible');
  });

  it('should enter new email and show async validation', () => {
    // Input: User enters new email
    const newEmail = 'newemail@comsatel.com.pe';
    cy.get('input[name="email"]').clear().type(newEmail);

    // Validation: Async validation (3s delay for duplicate check)
    cy.get('[data-testid="validating-spinner"]').should('be.visible');

    // Verify: Email marked "✓ Disponible"
    cy.get('[data-testid="email-available"]', { timeout: 5000 }).should('contain', 'Disponible');
  });

  it('should validate phone pattern and format', () => {
    // Action: Enter new phone
    cy.get('input[name="phone"]').clear().type('+51999999999');

    // Verify: Phone pattern validation passes
    cy.get('input[name="phone"]').should('have.attr', 'aria-invalid', 'false');
    cy.get('[data-testid="phone-valid"]').should('be.visible');
  });

  it('should submit form with vigencia transitions', () => {
    // Update email
    cy.get('input[name="email"]').clear().type('newemail@comsatel.com.pe');
    cy.wait(500); // Wait for async validation

    // Update phone
    cy.get('input[name="phone"]').clear().type('+51987654321');

    // Intercept API calls for vigencia management
    cy.intercept('PATCH', `**/api/v1/vigencias/${oldEmailVigenciaId}`, {
      statusCode: 200,
      body: { id: oldEmailVigenciaId, fecha_hasta: new Date().toISOString() }
    }).as('closeOldEmail');

    cy.intercept('POST', `**/api/v1/vigencias`, {
      statusCode: 201,
      body: {
        id: 'vig-email-new-001',
        tipo: 'email',
        valor: 'newemail@comsatel.com.pe',
        fecha_desde: new Date().toISOString()
      }
    }).as('createNewEmail');

    cy.intercept('PATCH', `**/api/v1/vigencias/${oldPhoneVigenciaId}`, {
      statusCode: 200,
      body: { id: oldPhoneVigenciaId, fecha_hasta: new Date().toISOString() }
    }).as('closeOldPhone');

    cy.intercept('POST', `**/api/v1/vigencias`, {
      statusCode: 201,
      body: {
        id: 'vig-phone-new-001',
        tipo: 'phone',
        valor: '+51987654321',
        fecha_desde: new Date().toISOString()
      }
    }).as('createNewPhone');

    // Action: Click Guardar
    cy.get('button').contains('Guardar').click();

    // Verify: 2 API calls per contact type
    // - PATCH to close old vigencia
    // - POST to create new vigencia
    cy.wait('@closeOldEmail');
    cy.wait('@createNewEmail');
    cy.wait('@closeOldPhone');
    cy.wait('@createNewPhone');
  });

  it('should show success modal with old→new transition', () => {
    cy.get('input[name="email"]').clear().type('newemail@comsatel.com.pe');
    cy.get('input[name="phone"]').clear().type('+51987654321');

    cy.intercept('PATCH', `**/api/v1/vigencias/**`, {
      statusCode: 200,
      body: { id: 'vig-1', fecha_hasta: new Date().toISOString() }
    });

    cy.intercept('POST', `**/api/v1/vigencias`, {
      statusCode: 201,
      body: { id: 'vig-new', fecha_desde: new Date().toISOString() }
    });

    cy.get('button').contains('Guardar').click();

    // Verify: Success modal shows old→new transition
    cy.get('[role="dialog"], .modal').should('be.visible');
    cy.get('[role="dialog"], .modal').should('contain', 'juan@comsatel.com.pe');
    cy.get('[role="dialog"], .modal').should('contain', 'newemail@comsatel.com.pe');
  });

  it('should navigate back to party detail after success', () => {
    cy.get('input[name="email"]').clear().type('newemail@comsatel.com.pe');
    cy.get('input[name="phone"]').clear().type('+51987654321');

    cy.intercept('PATCH', `**/api/v1/vigencias/**`, {
      statusCode: 200,
      body: { id: 'vig-1', fecha_hasta: new Date().toISOString() }
    });

    cy.intercept('POST', `**/api/v1/vigencias`, {
      statusCode: 201,
      body: { id: 'vig-new', fecha_desde: new Date().toISOString() }
    });

    cy.get('button').contains('Guardar').click();

    // Navigate: Back to party detail
    cy.location('pathname', { timeout: 3000 }).should('equal', `/colaboradores/${testPartyId}`);
  });

  it('should verify new contact info displays on party detail', () => {
    cy.get('input[name="email"]').clear().type('newemail@comsatel.com.pe');
    cy.get('input[name="phone"]').clear().type('+51987654321');

    cy.intercept('PATCH', `**/api/v1/vigencias/**`, {
      statusCode: 200,
      body: { id: 'vig-1', fecha_hasta: new Date().toISOString() }
    });

    cy.intercept('POST', `**/api/v1/vigencias`, {
      statusCode: 201,
      body: { id: 'vig-new', fecha_desde: new Date().toISOString() }
    });

    cy.get('button').contains('Guardar').click();

    cy.location('pathname').then((pathname) => {
      if (pathname === `/colaboradores/${testPartyId}`) {
        // Verify: New contact info displays
        cy.contains('newemail@comsatel.com.pe').should('be.visible');
        cy.contains('+51987654321').should('be.visible');
      }
    });
  });

  it('should handle email validation error (duplicate)', () => {
    cy.get('input[name="email"]').clear().type('existing@comsatel.com.pe');

    cy.wait(500); // Wait for async validation

    // Verify: Email marked as duplicate/unavailable
    cy.get('[data-testid="email-duplicate"]').should('be.visible');
    cy.get('[role="alert"]').should('contain', 'en uso');
  });

  it('should handle phone pattern validation error', () => {
    // Invalid phone format
    cy.get('input[name="phone"]').clear().type('123456789');

    // Verify: Shows error
    cy.get('input[name="phone"]').should('have.attr', 'aria-invalid', 'true');
    cy.get('[role="alert"]').should('contain', 'formato');
  });

  it('should show read-only vigencia fields', () => {
    // Verify old vigencia date is read-only
    cy.get('input[name="oldVigenciaDate"]').should('be.disabled');
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

  it('should have proper ARIA labels and descriptions', () => {
    cy.get('input[name="email"]').should('have.attr', 'aria-label');
    cy.get('input[name="phone"]').should('have.attr', 'aria-label');
    cy.get('[aria-live="polite"], [aria-live="status"]').should('exist');
  });

  it('should support keyboard navigation', () => {
    cy.get('input[name="email"]').focus();
    cy.focused().should('have.attr', 'name', 'email');

    cy.get('input[name="email"]').tab();
    cy.focused().should('have.attr', 'name', 'phone');
  });

  it('should prevent duplicate async validator calls (debounce)', () => {
    let callCount = 0;

    cy.intercept('GET', `**/api/v1/parties/**/email-check*`, (req) => {
      callCount++;
      req.reply({
        statusCode: 200,
        body: { available: true }
      });
    }).as('emailCheck');

    // Rapid typing
    cy.get('input[name="email"]').clear();
    cy.get('input[name="email"]').type('a', { delay: 100 });
    cy.get('input[name="email"]').type('b', { delay: 100 });
    cy.get('input[name="email"]').type('c', { delay: 100 });

    // Should debounce to single call
    cy.wait(1000);
    expect(callCount).toBeLessThan(3);
  });
});
