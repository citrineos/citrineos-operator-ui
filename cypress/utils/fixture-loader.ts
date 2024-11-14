// utils/fixture-loader.ts
export const preloadGraphQLFixtures = (
  fixtureNames: string[],
  testName: string,
): Cypress.Chainable => {
  const fixtures: Record<string, any> = {};

  return cy.then(() => {
    fixtureNames.forEach((name) => {
      cy.fixture(`graphql/${testName}/${name}.json`).then((fixture) => {
        fixtures[name] = fixture;
      });
    });

    // Store all fixtures in Cypress.env for global access
    cy.wrap(fixtures).then((loadedFixtures) => {
      Cypress.env('graphqlFixtures', loadedFixtures);
    });
  });
};

export const getFixtures = (): Record<string, any> => {
  return Cypress.env('graphqlFixtures') || {};
};
