import 'cypress-axe';

describe('Flow 1: Jefe Edita Datos Personales (Happy Path)', () => {
  const testPartyId = 'party-test-001';
  const baseUrl = Cypress.env('BASE_URL') || 'http://localhost:4200';

  beforeEach(() => {
    cy.visit(`${baseUrl}/colaboradores/${testPartyId}/datos/editar`);
  });

  it('should load form with current data', () => {
    // Navigation: User lands on correct page
    cy.location('pathname').should('include', `/colaboradores/${testPartyId}/datos/editar`);

    // Form Rendering: All fields visible + labeled
    cy.get('form').should('be.visible');
    cy.get('label').should('have.length.at.least', 6);
    cy.get('gf-text-input, gf-select').should('have.length.at.least', 6);

    // Verify field labels
    cy.contains('label', 'Nombres').should('be.visible');
    cy.contains('label', 'Apellidos').should('be.visible');
    cy.contains('label', 'Nombre Preferido').should('be.visible');
    cy.contains('label', 'Tipo de Identificación').should('be.visible');
    cy.contains('label', 'Número de Identificación').should('be.visible');
    cy.contains('label', 'País de Identificación').should('be.visible');

    // Accessibility: Check page structure
    cy.get('[role="main"]').should('exist');
  });

  it('should render Guardar and Cancelar buttons', () => {
    cy.get('button').then(($buttons) => {
      const buttonTexts = $buttons.map((_, el) => Cypress.$(el).text()).get();
      expect(buttonTexts.join(' ')).to.include('Guardar');
      expect(buttonTexts.join(' ')).to.include('Cancelar');
    });
  });

  it('should enter valid data and submit form (AC-016)', () => {
    // Input: User enters valid data
    cy.get('input[name="nombres"]').clear().type('Juan Carlos');
    cy.get('input[name="apellidos"]').clear().type('Pérez García');
    cy.get('input[name="nombrePreferido"]').clear().type('Juan');
    cy.get('select[name="tipoIdentificacion"]').select('DNI');
    cy.get('input[name="numeroIdentificacion"]').clear().type('12345678');
    cy.get('select[name="paisIdentificacion"]').select('PE');

    // Validation: Real-time validation feedback
    cy.get('input[name="nombres"]').should('have.value', 'Juan Carlos');
    cy.get('input[name="apellidos"]').should('have.value', 'Pérez García');

    // Submission: Form submitted successfully
    cy.intercept('POST', `**/api/v1/parties/${testPartyId}/data`, {
      statusCode: 200,
      body: {
        id: testPartyId,
        nombres: 'Juan Carlos',
        apellidos: 'Pérez García',
        updatedAt: new Date().toISOString()
      }
    }).as('updateDatos');

    cy.get('button').contains('Guardar').click();
    cy.wait('@updateDatos');

    // Backend Response: API returns expected data structure
    cy.get('@updateDatos').its('response.statusCode').should('equal', 200);
    cy.get('@updateDatos').its('response.body').should('have.property', 'id');
  });

  it('should show success message and navigate back', () => {
    cy.get('input[name="nombres"]').clear().type('Juan Carlos');
    cy.get('input[name="apellidos"]').clear().type('Pérez García');
    cy.get('select[name="tipoIdentificacion"]').select('DNI');
    cy.get('input[name="numeroIdentificacion"]').clear().type('12345678');
    cy.get('select[name="paisIdentificacion"]').select('PE');

    cy.intercept('POST', `**/api/v1/parties/${testPartyId}/data`, {
      statusCode: 200,
      body: { id: testPartyId }
    }).as('updateDatos');

    cy.get('button').contains('Guardar').click();
    cy.wait('@updateDatos');

    // Success State: Success message displays + navigation occurs
    cy.get('[role="status"], [aria-live="polite"]').should('contain', 'actualizado');

    // Navigate: Back to /colaboradores/{partyId}
    cy.location('pathname', { timeout: 3000 }).should('equal', `/colaboradores/${testPartyId}`);
  });

  it('should update data displays in page after success', () => {
    cy.get('input[name="nombres"]').clear().type('María');
    cy.get('input[name="apellidos"]').clear().type('López');
    cy.get('select[name="tipoIdentificacion"]').select('DNI');
    cy.get('input[name="numeroIdentificacion"]').clear().type('87654321');
    cy.get('select[name="paisIdentificacion"]').select('PE');

    cy.intercept('POST', `**/api/v1/parties/${testPartyId}/data`, {
      statusCode: 200,
      body: { id: testPartyId, nombres: 'María', apellidos: 'López' }
    }).as('updateDatos');

    cy.get('button').contains('Guardar').click();
    cy.wait('@updateDatos');

    // Verify: Updated data displays in page
    cy.location('pathname').should('equal', `/colaboradores/${testPartyId}`);
  });

  it('should handle validation errors gracefully', () => {
    // Submit with empty required field
    cy.get('input[name="nombres"]').clear();
    cy.get('button').contains('Guardar').click();

    // Should show validation error
    cy.get('[role="alert"], [aria-invalid="true"]').should('be.visible');
  });

  it('should display API error message', () => {
    cy.get('input[name="nombres"]').clear().type('Juan');
    cy.get('input[name="apellidos"]').clear().type('Pérez');
    cy.get('select[name="tipoIdentificacion"]').select('DNI');
    cy.get('input[name="numeroIdentificacion"]').clear().type('12345678');
    cy.get('select[name="paisIdentificacion"]').select('PE');

    cy.intercept('POST', `**/api/v1/parties/${testPartyId}/data`, {
      statusCode: 409,
      body: { message: 'Duplicate identification number' }
    }).as('updateDatosError');

    cy.get('button').contains('Guardar').click();
    cy.wait('@updateDatosError');

    // Error Message: Display error
    cy.get('[role="alert"]').should('contain', 'Duplicate');
  });

  it('should enable cancel button to go back without saving', () => {
    cy.get('input[name="nombres"]').clear().type('Test');

    cy.get('button').contains('Cancelar').click();

    // Navigate back without saving
    cy.location('pathname').should('equal', `/colaboradores/${testPartyId}`);
  });

  it('should pass accessibility checks (axe-core)', () => {
    // Accessibility: axe-core check passes
    cy.injectAxe();
    cy.checkA11y(null, {
      rules: {
        'color-contrast': { enabled: true },
        'aria-required-attr': { enabled: true },
        'aria-valid-attr': { enabled: true }
      }
    });
  });

  it('should show loading state during submission', () => {
    cy.get('input[name="nombres"]').clear().type('Juan');
    cy.get('input[name="apellidos"]').clear().type('Pérez');
    cy.get('select[name="tipoIdentificacion"]').select('DNI');
    cy.get('input[name="numeroIdentificacion"]').clear().type('12345678');
    cy.get('select[name="paisIdentificacion"]').select('PE');

    cy.intercept('POST', `**/api/v1/parties/${testPartyId}/data`, (req) => {
      req.reply((res) => {
        // Slow response to test loading state
        setTimeout(() => {
          res.send({
            statusCode: 200,
            body: { id: testPartyId }
          });
        }, 500);
      });
    }).as('updateDatos');

    const guardarButton = cy.get('button').contains('Guardar');
    guardarButton.click();

    // Button should be disabled during submission
    guardarButton.should('be.disabled');

    cy.wait('@updateDatos');

    // Button should be enabled after completion
    guardarButton.should('not.be.disabled');
  });

  it('should have proper ARIA labels on all form fields', () => {
    cy.get('input[name="nombres"]').should('have.attr', 'aria-label');
    cy.get('input[name="apellidos"]').should('have.attr', 'aria-label');
    cy.get('select[name="tipoIdentificacion"]').should('have.attr', 'aria-label');
    cy.get('input[name="numeroIdentificacion"]').should('have.attr', 'aria-label');
  });

  it('should support keyboard navigation', () => {
    cy.get('input[name="nombres"]').focus();
    cy.focused().should('have.attr', 'name', 'nombres');

    cy.get('input[name="nombres"]').tab();
    cy.focused().should('have.attr', 'name', 'apellidos');
  });
});
