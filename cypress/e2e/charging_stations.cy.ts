import { setupTestEnvironment } from '../utils/test-setup';

describe('Charging station actions', () => {
  const graphqlUrl = 'http://localhost:8090/v1/graphql';
  const fixtures = [
    'ChargingStationsList',
    'GetEvseListForStation',
    'GetLocationById',
  ];

  beforeEach(() => {
    setupTestEnvironment(graphqlUrl, fixtures, 'charging_stations');
    cy.visit('http://localhost:5173/charging-stations');
    cy.wait('@gqlChargingStationsList');
    cy.wait('@gqlGetLocationById');
  });
  it('Reset charging station immediately', () => {
    //Mock response to avoid having to connect real charger during test
    cy.intercept('POST', /\/configuration\/reset\?identifier=.*&tenantId=1$/, {
      statusCode: 200,
      body: {
        success: true,
        payload: 'Reset operation successful',
      },
    }).as('resetRequest');

    cy.getByData('citrine-os-icon').should(
      'have.attr',
      'src',
      '/Citrine_OS_Logo.png',
    );

    cy.getByData('custom-action-dropdown-button').click();
    cy.get('.ant-dropdown') // Target the dropdown container
      .within(() => {
        cy.get('[role="menuitem"]').contains('Reset').click();
      });

    cy.getByData('field-type-input').click();
    cy.get('.ant-select-dropdown')
      .should('not.have.class', 'ant-select-dropdown-hidden')
      .and('be.visible');
    cy.wait('@gqlGetEvseListForStation');
    cy.getByData('field-type-input-option-Immediate')
      .should('be.visible')
      .click();
    // cy.getByData('evse-editable-cell')
    //   .should('be.visible')
    //   .within(() => {
    //     cy.getByData('expandable-column-clickable-span').click()
    //   });

    cy.getByData('ResetData2-generic-form-submit').click();

    cy.wait('@resetRequest');
    cy.getByData('success-notification').should('be.visible');
  });

  it('Start remoteStart', () => {
    //Mock response to avoid having to connect real charger during test
    cy.intercept(
      'POST',
      '/ocpp/evdriver/requestStartTransaction?identifier=cp001&tenantId=1',
      {
        statusCode: 200,
        body: {
          success: true,
          payload: 'Transaction started successfully',
        },
      },
    ).as('requestStartTransaction');

    cy.getByData('custom-action-dropdown-button').click();
    cy.get('.ant-dropdown') // Target the dropdown container
      .within(() => {
        cy.get('[role="menuitem"]').contains('Remote Start').click();
      });

    //TODO needs selection for idToken

    cy.getByData('field-remoteStartId-input').should('be.visible').clear();

    cy.getByData('field-remoteStartId-input').type('42');

    cy.getByData('RequestStartTransactionRequest2-generic-form-submit').click();
    cy.wait('@requestStartTransaction');
    cy.getByData('success-notification').should('be.visible');
  });

  it('Change Availability to inoperable', () => {
    //Mock response to avoid having to connect real charger during test
    cy.intercept(
      'POST',
      /\/configuration\/changeAvailability\?identifier=.*&tenantId=1$/,
      {
        statusCode: 200,
        body: {
          success: true,
          payload: 'Operation successful',
        },
      },
    ).as('changeAvailabilityRequest');

    cy.getByData('custom-action-dropdown-button').click();
    cy.get('.ant-dropdown') // Target the dropdown container
      .within(() => {
        cy.get('[role="menuitem"]').contains('Change Availability').click();
      });

    cy.getByData('field-operationalStatus-input').click();
    cy.get('.ant-select-dropdown')
      .should('not.have.class', 'ant-select-dropdown-hidden')
      .and('be.visible');
    cy.wait('@gqlGetEvseListForStation');
    cy.getByData('field-operationalStatus-input-option-Inoperative')
      .should('be.visible')
      .click();
    // cy.getByData('evse-editable-cell')
    //   .should('be.visible')
    //   .within(() => {
    //     cy.getByData('expandable-column-clickable-span').click()
    //   });

    cy.getByData('ChangeAvailabilityRequest2-generic-form-submit').click();

    cy.wait('@changeAvailabilityRequest');
    cy.getByData('success-notification').should('be.visible');
  });
});
