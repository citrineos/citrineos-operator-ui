const REQUIRED_KEYS = [
  'E2E_BASE_URL',
  'HASURA_URL',
  'CITRINE_CORE_URL',
  'E2E_ADMIN_EMAIL',
  'E2E_ADMIN_PASSWORD',
] as const;

const OPTIONAL_KEYS = [
  'E2E_TENANT_ID',
  'E2E_AUTH_PROVIDER',
  'HASURA_ADMIN_SECRET',
] as const;

export type RequiredEnvKey = (typeof REQUIRED_KEYS)[number];
export type OptionalEnvKey = (typeof OPTIONAL_KEYS)[number];
export type EnvKey = RequiredEnvKey | OptionalEnvKey;

export function readEnv(key: RequiredEnvKey): string;
export function readEnv(key: OptionalEnvKey, fallback: string): string;
export function readEnv(key: OptionalEnvKey): string | undefined;
export function readEnv(key: EnvKey, fallback?: string): string | undefined {
  const value = process.env[key];
  if (value !== undefined && value !== '') return value;
  if ((REQUIRED_KEYS as readonly string[]).includes(key)) {
    throw new Error(
      `Missing required environment variable "${key}". ` +
        `Expected values in .env.test (see .env.test.example).`,
    );
  }
  return fallback;
}

export function assertRequiredEnv(): void {
  const missing = REQUIRED_KEYS.filter((k) => !process.env[k]);
  if (missing.length === 0) return;
  throw new Error(
    `Missing required environment variables: ${missing.join(', ')}. ` +
      `Copy .env.test.example to .env.test and fill in values.`,
  );
}
