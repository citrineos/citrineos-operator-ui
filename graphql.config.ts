import type { IGraphQLConfig } from 'graphql-config';

// See https://refine.dev/docs/data/packages/hasura/#developer-experience for usage

const config: IGraphQLConfig = {
  schema: 'http://localhost:8090/v1/graphql',
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
