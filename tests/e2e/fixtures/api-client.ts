import {
  request as playwrightRequest,
  type APIRequestContext,
} from '@playwright/test';
import { readEnv } from '../utils/env';

export interface ApiClient {
  gql<T>(query: string, variables?: Record<string, unknown>): Promise<T>;
  dispose(): Promise<void>;
}

interface MakeApiClientOptions {
  hasuraUrl?: string;
  tenantId?: string;
  adminSecret?: string;
  storageStatePath?: string;
}

interface GraphQLError {
  message: string;
  extensions?: Record<string, unknown>;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

class GraphQLClient implements ApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly hasuraUrl: string,
    private readonly headers: Record<string, string>,
  ) {}

  async gql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const res = await this.request.post(this.hasuraUrl, {
      headers: this.headers,
      data: { query, variables: variables ?? {} },
    });

    if (!res.ok()) {
      throw new Error(
        `Hasura HTTP ${res.status()} for operation: ${extractOperationName(query) ?? '<anonymous>'}\n${await res.text()}`,
      );
    }

    const body = (await res.json()) as GraphQLResponse<T>;
    if (body.errors && body.errors.length > 0) {
      const messages = body.errors.map((e) => e.message).join('; ');
      throw new Error(
        `Hasura GraphQL errors for ${extractOperationName(query) ?? '<anonymous>'}: ${messages}`,
      );
    }
    if (body.data === undefined) {
      throw new Error(
        `Hasura returned empty data for ${extractOperationName(query) ?? '<anonymous>'}`,
      );
    }
    return body.data;
  }

  async dispose(): Promise<void> {
    await this.request.dispose();
  }
}

function extractOperationName(query: string): string | undefined {
  const match = /(?:query|mutation|subscription)\s+([A-Za-z0-9_]+)/.exec(query);
  return match?.[1];
}

export async function makeApiClient(
  options: MakeApiClientOptions = {},
): Promise<ApiClient> {
  const hasuraUrl = options.hasuraUrl ?? readEnv('HASURA_URL');
  const tenantId = options.tenantId ?? readEnv('E2E_TENANT_ID', '1');
  const adminSecret = options.adminSecret ?? readEnv('HASURA_ADMIN_SECRET');

  const headers: Record<string, string> = {
    'content-type': 'application/json',
    'x-hasura-role': 'admin',
    'x-hasura-tenant-id': tenantId,
  };
  if (adminSecret) headers['x-hasura-admin-secret'] = adminSecret;

  const request = await playwrightRequest.newContext({
    ...(options.storageStatePath
      ? { storageState: options.storageStatePath }
      : {}),
  });
  return new GraphQLClient(request, hasuraUrl, headers);
}
