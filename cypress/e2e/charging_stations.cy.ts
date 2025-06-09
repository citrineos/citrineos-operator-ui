// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

describe('Charging station actions', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage();

    //TODO figure out why this is thrown!
    const stub = cy.stub();
    Cypress.on('uncaught:exception', (err, _runnable) => {
      if (err.message.includes('ResizeObserver')) {
        stub();
        return false;
      }
    });

    cy.visit('http://localhost:5173/charging-stations');
  });

  it('Reset charging station immediately', () => {
    //Mock response to avoid having to connect real charger during test
    cy.intercept('POST', /\/configuration\/reset\?identifier=.*&tenantId=1$/, {
      statusCode: 200,
      body: {
        success: true,
        payload: { message: 'Reset operation successful' },
      },
    }).as('resetRequest');

    cy.getByData('custom-action-dropdown-button').click();
    cy.get('.ant-dropdown') // Target the dropdown container
      .within(() => {
        cy.get('[role="menuitem"]').contains('Reset').click();
      });

    cy.getByData('field-type-input').click();
    cy.get('.ant-select-dropdown')
      .should('not.have.class', 'ant-select-dropdown-hidden')
      .and('be.visible');
    cy.getByData('field-type-input-option-Immediate')
      .should('be.visible')
      .click();
    cy.getByData('ResetData2-generic-form-submit').click();

    cy.wait('@resetRequest');
    cy.getByData('success-notification').should('be.visible');
  });
});
