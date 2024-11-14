// utils/graphql-interceptor.ts
import { getFixtures } from './fixture-loader';

// utils/graphql-interceptor.ts
export const interceptGraphQL = (url: string): void => {
  cy.intercept('POST', url, (req) => {
    const operationName = req.body.operationName;
    const fixtures = getFixtures();

    if (operationName) {
      // Dynamically alias the request based on operationName
      const alias = `gql${operationName}`;
      req.alias = alias;
      console.log(`Intercepted and aliased: ${alias}`);

      // Mock the response if a fixture is available
      if (fixtures[operationName]) {
        req.reply({
          statusCode: 200,
          body: fixtures[operationName],
        });
      } else {
        console.warn(`No fixture found for ${operationName}. Passing through.`);
        req.continue();
      }
    } else {
      console.warn('No operationName found in the GraphQL request body.');
      req.continue();
    }
  });
};
