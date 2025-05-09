import { Method, StaticResponse } from 'cypress/types/net-stubbing';

export const conditionalIntercept = (
  method: Method,
  url: string | RegExp,
  alias: string,
  reply: StaticResponse,
): Cypress.Chainable => {
  const shouldMock = Cypress.env('MOCK_RESPONSES') !== false; // Default to true

  return cy.intercept(method, url, (req) => {
    req.alias = alias;
    if (shouldMock) {
      console.log(`Mocking ${alias}`);
      req.reply(reply);
    } else {
      console.log(`Passing through ${alias}`);
      req.continue();
    }
  });
};
