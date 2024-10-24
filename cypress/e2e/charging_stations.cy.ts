describe('Charging station actions', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage();

    //TODO figure out why this is thrown!
    const stub = cy.stub();
    Cypress.on('uncaught:exception', (err, runnable) => {
      if (err.message.includes('ResizeObserver')) {
        stub();
        return false;
      }
    });

    cy.visit('http://localhost:5173/charging-stations');
  });

  it('Get Charging station actions', () => {
    cy.getByData('citrine-os-icon').should(
      'have.attr',
      'src',
      '/Citrine_OS_Logo.png',
    );

    cy.getByData('custom-action-dropdown-button').click();
    cy.get('ul.ant-dropdown-menu[role="menu"] li[role="menuitem"]')
      .eq(11) // 0-based index, so 11 corresponds to the 12th item
      .click();
    cy.getByData('field-type-input').click();
    cy.get('.ant-select-dropdown')
      .should('not.have.class', 'ant-select-dropdown-hidden')
      .and('be.visible');
    cy.getByData('field-type-input-option-Immediate')
      .should('be.visible')
      .click();
    cy.getByData('ResetData2-generic-form-submit').click();
  });
});
