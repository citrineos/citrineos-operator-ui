import type { ApiClient } from '../fixtures/api-client';

// The Hasura introspection slice we track. We deliberately do NOT snapshot
// full GraphQL types — only the operations the UI depends on plus the
// selection-set columns of the tables it reads. This keeps the snapshot
// stable under benign schema growth (adding a new column / operation is
// silent), and surfaces the regressions we actually care about (a tracked
// operation disappears, or a column the UI selects is renamed).

export interface SchemaSnapshot {
  readonly operations: ReadonlyArray<string>;
  readonly columnsByType: Readonly<Record<string, ReadonlyArray<string>>>;
}

export interface SchemaDriftReport {
  readonly valid: boolean;
  readonly missingOperations: ReadonlyArray<string>;
  readonly missingColumns: ReadonlyArray<{ type: string; column: string }>;
}

interface IntrospectionField {
  readonly name: string;
  readonly type?: {
    readonly name: string | null;
    readonly ofType?: { readonly name: string | null } | null;
  } | null;
}

interface IntrospectionType {
  readonly name: string;
  readonly kind: string;
  readonly fields?: ReadonlyArray<IntrospectionField> | null;
}

interface IntrospectionSchema {
  readonly queryType: { readonly name: string } | null;
  readonly mutationType: { readonly name: string } | null;
  readonly types: ReadonlyArray<IntrospectionType>;
}

const INTROSPECTION_QUERY = `
  query SchemaSnapshotIntrospection {
    __schema {
      queryType { name }
      mutationType { name }
      types {
        name
        kind
        fields {
          name
        }
      }
    }
  }
`;

// The Hasura tables whose select-column shape we track. Add a row here
// whenever a new query starts selecting a previously-untracked table.
const TRACKED_TABLES: ReadonlyArray<string> = [
  'ChargingStations',
  'Locations',
  'Transactions',
  'Authorizations',
  'Connectors',
  'Evses',
  'StatusNotifications',
  'LatestStatusNotifications',
  'OCPPMessages',
  'Tariffs',
  'TenantPartners',
];

export async function captureHasuraIntrospection(
  api: ApiClient,
): Promise<SchemaSnapshot> {
  const data = await api.gql<{ __schema: IntrospectionSchema }>(
    INTROSPECTION_QUERY,
  );
  const schema = data.__schema;

  const queryType = schema.types.find(
    (t) => t.name === (schema.queryType?.name ?? ''),
  );
  const mutationType = schema.types.find(
    (t) => t.name === (schema.mutationType?.name ?? ''),
  );
  const operationNames = new Set<string>();
  for (const f of queryType?.fields ?? []) operationNames.add(f.name);
  for (const f of mutationType?.fields ?? []) operationNames.add(f.name);

  const columnsByType: Record<string, string[]> = {};
  for (const tableName of TRACKED_TABLES) {
    const t = schema.types.find((x) => x.name === tableName);
    if (!t || !t.fields) continue;
    columnsByType[tableName] = t.fields.map((f) => f.name).sort();
  }

  return {
    operations: Array.from(operationNames).sort(),
    columnsByType,
  };
}

export function validateSchemaDrift(
  current: SchemaSnapshot,
  baseline: SchemaSnapshot,
): SchemaDriftReport {
  const currentOps = new Set(current.operations);
  const missingOperations = baseline.operations.filter(
    (op) => !currentOps.has(op),
  );

  const missingColumns: { type: string; column: string }[] = [];
  for (const [type, baselineCols] of Object.entries(baseline.columnsByType)) {
    const currentCols = new Set(current.columnsByType[type] ?? []);
    for (const col of baselineCols) {
      if (!currentCols.has(col)) missingColumns.push({ type, column: col });
    }
  }

  return {
    valid: missingOperations.length === 0 && missingColumns.length === 0,
    missingOperations,
    missingColumns,
  };
}

export function formatDriftMessage(report: SchemaDriftReport): string {
  const lines: string[] = [];
  if (report.missingOperations.length > 0) {
    lines.push(`Missing operations: ${report.missingOperations.join(', ')}`);
  }
  if (report.missingColumns.length > 0) {
    lines.push(
      `Missing columns: ${report.missingColumns
        .map((m) => `${m.type}.${m.column}`)
        .join(', ')}`,
    );
  }
  return lines.join('\n');
}
