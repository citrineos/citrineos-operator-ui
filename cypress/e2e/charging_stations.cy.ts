import { setupTestEnvironment } from '../utils/test-setup';
import { conditionalIntercept } from '../utils/conditional-interceptor';

describe('Charging station actions', () => {
  const fixtures = [
    'ChargingStationsList',
    'GetEvseListForStation',
    'GetLocationById',
    'IdTokensList',
    'ChargingStationSequencesGet',
  ];

  beforeEach(() => {
    setupTestEnvironment(fixtures, 'charging_stations');
    cy.visit('/charging-stations');
    cy.wait('@gqlChargingStationsList');
    cy.wait('@gqlGetLocationById');
  });
  it('Start remoteStart', () => {
    //Mock response to avoid having to connect real charger during test
    conditionalIntercept(
      'POST',
      /\/evdriver\/requestStartTransaction\?identifier=.*&tenantId=1$/,
      'requestStartTransaction',
      {
        statusCode: 200,
        body: {
          success: true,
        },
      },
    );

    cy.getByData('row-primarykey-cp001').within(() => {
      cy.getByData('custom-action-dropdown-button').click();
    });

    cy.get('.ant-dropdown') // Target the dropdown container
      .within(() => {
        cy.get('[role="menuitem"]').contains('Remote Start').click();
      });

    //TODO needs selection for idToken

    cy.getByData('field-remoteStartId-input').should('be.visible');

    cy.getByData('field-remoteStartId-input').clear();
    cy.getByData('field-remoteStartId-input').type('42');
    cy.getByData('idToken-editable-cell')
      .find('[data-testid="Select-tag"]')
      .click();
    cy.getByData('row-primarykey-1').find('input.ant-radio-input').click();
    cy.getByData('idToken-selected-associated-items-save').click();

    cy.getByData('RequestStartTransactionRequest2-generic-form-submit').click();
    cy.wait('@requestStartTransaction');
    cy.getByData('success-notification').should('be.visible');
  });

  it('Change Availability to inoperable', () => {
    //Mock response to avoid having to connect real charger during test
    conditionalIntercept(
      'POST',
      /\/configuration\/changeAvailability\?identifier=.*&tenantId=1$/,
      'changeAvailabilityRequest',
      {
        statusCode: 200,
        body: {
          success: true,
        },
      },
    );

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
    cy.getByData('field-operationalStatus-input-option-Inoperative').should(
      'be.visible',
    );
    cy.getByData('field-operationalStatus-input-option-Inoperative').click();

    cy.getByData('ChangeAvailabilityRequest2-generic-form-submit').click();

    // cy.wait('@changeAvailabilityRequest');
    cy.getByData('success-notification').should('be.visible');
  });

  it('Reset charging station immediately', () => {
    conditionalIntercept(
      'POST',
      /\/configuration\/reset\?identifier=.*&tenantId=1$/,
      'resetRequest',
      {
        statusCode: 200,
        body: {
          success: true,
        },
      },
    ).as('resetRequest');

    cy.getByData('citrine-os-icon').should(
      'have.attr',
      'src',
      '/Citrine_OS_Logo.png',
    );
    cy.wait('@gqlChargingStationsList');
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
    cy.getByData('field-type-input-option-Immediate').should('be.visible');
    cy.getByData('field-type-input-option-Immediate').click();
    // cy.getByData('evse-editable-cell')
    //   .should('be.visible')
    //   .within(() => {
    //     cy.getByData('expandable-column-clickable-span').click()
    //   });

    cy.getByData('ResetData2-generic-form-submit').click();

    cy.wait('@resetRequest');
    cy.getByData('success-notification').should('be.visible');
  });
});
