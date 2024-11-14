// utils/test-setup.ts
import { preloadGraphQLFixtures } from './fixture-loader';
import { interceptGraphQL } from './graphql-interceptor';

export const setupTestEnvironment = (
  graphqlUrl: string,
  fixtureNames: string[],
  testClass: string,
): Cypress.Chainable => {
  return cy.then(() => {
    // Preload fixtures
    preloadGraphQLFixtures(fixtureNames, testClass);

    // Set up GraphQL interceptor
    interceptGraphQL(graphqlUrl);

    // Clear cookies, local storage, and session storage
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
    cy.clearAllSessionStorage();

    // Handle common exceptions
    Cypress.on('uncaught:exception', (err) => {
      if (err.message.includes('ResizeObserver')) {
        return false; // Prevent failure for ResizeObserver errors
      }
    });
  });
};
