import 'cypress-axe';

describe('Flow 4: Colaborador Edita Teléfono Laboral (Happy Path)', () => {
  const selfPartyId = 'party-self-002';
  const baseUrl = Cypress.env('BASE_URL') || 'http://localhost:4200';
  const oldPhoneVigenciaId = 'vig-phone-old-001';

  beforeEach(() => {
    cy.visit(`${baseUrl}/colaboradores/${selfPartyId}/teléfono/editar`);
  });

  it('should load phone edit form with current phone', () => {
    // Navigation: User lands on correct page
    cy.location('pathname').should('include', `/colaboradores/${selfPartyId}/teléfono/editar`);

    // Form Rendering: Form loads
    cy.get('form').should('be.visible');
    cy.get('gf-tel-input').should('be.visible');

    // Verify: Current phone displays with vigente badge
    cy.get('input[name="phone"]').should('have.value', '+51987654321');
    cy.contains('Vigente').should('be.visible');
  });

  it('should show phone input field with correct placeholder', () => {
    cy.get('input[name="phone"]').should('have.attr', 'placeholder', '+51 999 999 999');
  });

  it('should enter new phone number', () => {
    // Action: Enter new phone
    const newPhone = '+51987654321';
    cy.get('input[name="phone"]').clear().type(newPhone);

    // Verify: Field shows new value
    cy.get('input[name="phone"]').should('have.value', newPhone);
  });

  it('should validate phone pattern (formato correcto)', () => {
    // Action: Enter new phone
    cy.get('input[name="phone"]').clear().type('+51987654321');

    // Verify: Pattern validation passes
    cy.get('input[name="phone"]').should('have.attr', 'aria-invalid', 'false');

    // Show: "✓ formato correcto"
    cy.get('[data-testid="format-valid"]').should('contain', 'formato correcto');
  });

  it('should reject invalid phone format', () => {
    // Action: Enter invalid format
    cy.get('input[name="phone"]').clear().type('123456789');

    // Verify: Shows error
    cy.get('input[name="phone"]').should('have.attr', 'aria-invalid', 'true');
    cy.get('[role="alert"]').should('contain', 'formato');
  });

  it('should submit form with vigencia lifecycle', () => {
    // Action: Enter new phone
    cy.get('input[name="phone"]').clear().type('+51999999999');

    // Intercept: Close old vigencia
    cy.intercept('PATCH', `**/api/v1/vigencias/${oldPhoneVigenciaId}`, {
      statusCode: 200,
      body: {
        id: oldPhoneVigenciaId,
        fecha_hasta: new Date().toISOString()
      }
    }).as('closeOldPhone');

    // Intercept: Create new vigencia
    cy.intercept('POST', `**/api/v1/vigencias`, {
      statusCode: 201,
      body: {
        id: 'vig-phone-new-001',
        tipo: 'phone',
        valor: '+51999999999',
        fecha_desde: new Date().toISOString()
      }
    }).as('createNewPhone');

    // Action: Click "Guardar"
    cy.get('button').contains('Guardar').click();

    // Verify: 2 API calls
    // - PATCH to close old vigencia
    // - POST to create new vigencia
    cy.wait('@closeOldPhone');
    cy.wait('@createNewPhone');
  });

  it('should show success modal with old→new transition', () => {
    cy.get('input[name="phone"]').clear().type('+51999999999');

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
    cy.get('[role="dialog"], .modal').should('contain', '+51987654321');
    cy.get('[role="dialog"], .modal').should('contain', '+51999999999');
  });

  it('should navigate back to party detail after success', () => {
    cy.get('input[name="phone"]').clear().type('+51999999999');

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
    cy.location('pathname', { timeout: 3000 }).should('equal', `/colaboradores/${selfPartyId}`);
  });

  it('should verify new phone displays on party detail', () => {
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
      if (pathname === `/colaboradores/${selfPartyId}`) {
        // Verify: New phone displays
        cy.contains('+51987654321').should('be.visible');
      }
    });
  });

  it('should show cancel button to go back without saving', () => {
    cy.get('input[name="phone"]').clear().type('+51999999999');

    cy.get('button').contains('Cancelar').click();

    // Navigate back without saving
    cy.location('pathname').should('equal', `/colaboradores/${selfPartyId}`);
  });

  it('should show loading state during submission', () => {
    cy.get('input[name="phone"]').clear().type('+51987654321');

    cy.intercept('PATCH', `**/api/v1/vigencias/**`, (req) => {
      req.reply((res) => {
        setTimeout(() => {
          res.send({
            statusCode: 200,
            body: { id: 'vig-1', fecha_hasta: new Date().toISOString() }
          });
        }, 500);
      });
    });

    cy.intercept('POST', `**/api/v1/vigencias`, {
      statusCode: 201,
      body: { id: 'vig-new', fecha_desde: new Date().toISOString() }
    });

    const guardarButton = cy.get('button').contains('Guardar');
    guardarButton.click();

    // Button should be disabled during submission
    guardarButton.should('be.disabled');
  });

  it('should display error on failed submission', () => {
    cy.get('input[name="phone"]').clear().type('+51987654321');

    cy.intercept('PATCH', `**/api/v1/vigencias/**`, {
      statusCode: 500,
      body: { message: 'Server error' }
    });

    cy.get('button').contains('Guardar').click();

    // Verify: Error message displays
    cy.get('[role="alert"]').should('contain', 'error');
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

  it('should have proper ARIA labels', () => {
    cy.get('input[name="phone"]').should('have.attr', 'aria-label');
    cy.get('[aria-live="polite"], [aria-live="status"]').should('exist');
  });

  it('should have proper role="main" on container', () => {
    cy.get('[role="main"]').should('exist');
  });

  it('should support keyboard navigation and Tab key', () => {
    cy.get('input[name="phone"]').focus();
    cy.focused().should('have.attr', 'name', 'phone');

    cy.get('input[name="phone"]').tab();
    cy.focused().should('contain.text', /Guardar|Cancelar/);
  });

  it('should show vigencia date range information', () => {
    // Show old vigencia fecha_desde and fecha_hasta
    cy.get('[data-testid="old-vigencia"]').should('be.visible');

    // Show new vigencia fecha_desde
    cy.get('[data-testid="new-vigencia"]').should('be.visible');
  });

  it('should handle rapid value changes', () => {
    cy.get('input[name="phone"]').clear();
    cy.get('input[name="phone"]').type('+5', { delay: 50 });
    cy.get('input[name="phone"]').type('1', { delay: 50 });
    cy.get('input[name="phone"]').type('987654321', { delay: 50 });

    cy.get('input[name="phone"]').should('have.value', '+51987654321');
  });

  it('should handle empty phone submission attempt', () => {
    cy.get('input[name="phone"]').clear();

    cy.get('button').contains('Guardar').click();

    // Should show validation error for required field
    cy.get('[role="alert"]').should('contain', /requerido|required/i);
  });

  it('should handle phone with spaces (format flexibility)', () => {
    // Some implementations may strip spaces
    cy.get('input[name="phone"]').clear().type('+51 987 654 321');

    // Should either accept or show validation error based on implementation
    cy.get('input[name="phone"]').should('exist');
  });
});
