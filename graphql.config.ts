import type { IGraphQLConfig } from 'graphql-config';

// See https://refine.dev/docs/data/packages/hasura/#developer-experience for usage
const HASURA_GRAPHQL_ENDPOINT =
  process.env.HASURA_GRAPHQL_ENDPOINT || 'http://localhost:8090/v1/graphql';
const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET || 'CitrineOS!';
const config: IGraphQLConfig = {
  schema: {
    [HASURA_GRAPHQL_ENDPOINT]: {
      headers: {
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
      },
    },
  },
  extensions: {
    codegen: {
      // Optional, you can use this to format your generated files.
      hooks: {
        afterOneFileWrite: ['eslint --fix', 'prettier --write'],
      },
      generates: {
        'src/graphql/schema.types.ts': {
          plugins: ['typescript'],
          config: {
            skipTypename: true,
            enumsAsTypes: true,
          },
        },
        'src/graphql/types.ts': {
          preset: 'import-types',
          documents: ['src/**/*.{ts,tsx}'],
          plugins: ['typescript-operations'],
          config: {
            skipTypename: true,
            enumsAsTypes: true,
            preResolveTypes: false,
            useTypeImports: true,
          },
          presetConfig: {
            typesPath: './schema.types',
          },
        },
      },
    },
  },
};

export default config;
