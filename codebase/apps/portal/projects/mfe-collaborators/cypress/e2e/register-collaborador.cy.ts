describe('Register Collaborator - E2E Smoke Tests', () => {
  beforeEach(() => {
    // cy.login('jefe-ingenieria@comsatel.com.pe', 'password123');
    cy.visit('/colaboradores/nuevo');
  });

  describe('Happy Path: Empleado', () => {
    it('should complete registration flow for empleado', () => {
      // Step 1: Seleccionar tipo
      cy.get('[name="tipo"]').select('empleado');
      cy.get('[data-testid="next-btn"]').click();

      // Step 2: Datos persona
      cy.get('[name="nombres"]').type('Juan Carlos');
      cy.get('[name="apellidos"]').type('Pérez García');
      cy.get('[data-testid="next-btn"]').click();

      // Step 3: Identificación
      cy.get('[name="numeroIdentificacion"]').type('12345678');
      cy.get('[data-testid="next-btn"]').click();

      // Step 4: Correo
      cy.get('[name="correoLaboral"]').type('juan@comsatel.com.pe');
      cy.get('[data-testid="next-btn"]').click();

      // Step 5: Unidad
      cy.get('[name="unidadId"]').select('unit-1');
      cy.get('[data-testid="next-btn"]').click();

      // Step 6: Jefe
      cy.get('[name="jefeDirectoId"]').select('mgr-1');
      cy.get('[data-testid="next-btn"]').click();

      // Step 7: Rol-Nivel
      cy.get('[name="rolId"]').select('Developer');
      cy.get('[data-testid="next-btn"]').click();

      // Step 8: Review
      cy.contains('Juan Carlos Pérez García').should('be.visible');
      cy.get('[data-testid="submit-btn"]').click();

      // Step 9: Éxito
      cy.get('[data-testid="success-code"]').should('be.visible');
    });
  });

  describe('Happy Path: Contratista', () => {
    it('should complete registration flow for contratista', () => {
      cy.get('[name="tipo"]').select('contratista');
      cy.get('[data-testid="next-btn"]').click();

      cy.get('[name="nombres"]').type('María López');
      cy.get('[name="apellidos"]').type('García');
      cy.get('[data-testid="next-btn"]').click();

      cy.get('[name="numeroIdentificacion"]').type('87654321');
      cy.get('[data-testid="next-btn"]').click();

      cy.get('[name="correoLaboral"]').type('maria@provider.com');
      cy.get('[data-testid="next-btn"]').click();

      cy.get('[name="proveedorId"]').select('provider-1');
      cy.get('[data-testid="next-btn"]').click();

      cy.get('[name="rolId"]').select('Consultant');
      cy.get('[data-testid="next-btn"]').click();

      cy.get('[data-testid="submit-btn"]').click();
      cy.get('[data-testid="success-code"]').should('be.visible');
    });
  });

  describe('Error Cases', () => {
    it('E5: should show error for duplicate ID', () => {
      cy.get('[name="numeroIdentificacion"]').type('11111111');
      cy.get('[data-testid="submit-btn"]').click();
      cy.get('[role="alert"]').should('contain', 'ya existe');
    });

    it('E6: should show error for duplicate email', () => {
      cy.get('[name="correoLaboral"]').type('existing@comsatel.com.pe');
      cy.get('[data-testid="submit-btn"]').click();
      cy.get('[role="alert"]').should('contain', 'ya en uso');
    });
  });
});
