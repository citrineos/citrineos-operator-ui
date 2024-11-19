import { getFixtures } from './fixture-loader';

export const interceptGraphQL = (): void => {
  const url = Cypress.env('GRAPHQL_URL');
  const shouldMock = Cypress.env('MOCK_RESPONSES') !== false; // Default to true
  const fixtures = getFixtures();

  cy.intercept('POST', url, (req) => {
    const operationName = req.body.operationName;

    if (!operationName) {
      console.warn('No operationName found in the GraphQL request body.');
      return req.continue();
    }

    req.alias = `gql${operationName}`;
    if (shouldMock) {
      if (fixtures[operationName]) {
        console.log(`Mocking response for ${operationName}`);
        return req.reply({
          statusCode: 200,
          body: fixtures[operationName],
        });
      }
      console.warn(`No fixture found for ${operationName}. Passing through.`);
    } else {
      console.log(`Mocking disabled. Passing through ${operationName}.`);
    }

    req.continue();
  });
};
