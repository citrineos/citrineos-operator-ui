import type { ApiClient } from './api-client';
import { shortId } from '../utils/random';

function nowIso(): string {
  return new Date().toISOString();
}

export interface SeededLocation {
  readonly id: number;
  readonly name: string;
}

export interface SeededStation {
  readonly id: string;
  readonly pkId: number;
  readonly locationId: number;
}

export interface SeededTransaction {
  readonly transactionId: string;
  readonly stationId: string;
  readonly pkId: number;
}

// Minimal authorization for OCPP RemoteStart command flows.
export interface SeededAuthorization {
  readonly id: number;
  readonly idToken: string;
  readonly idTokenType: string;
  readonly status: string;
}

export async function seedLocation(
  api: ApiClient,
  overrides: Partial<{
    name: string;
    address: string;
    city: string;
    country: string;
  }> = {},
): Promise<SeededLocation> {
  const name = overrides.name ?? `${shortId()}-loc`;
  const now = nowIso();
  const data = await api.gql<{
    insert_Locations_one: { id: number; name: string };
  }>(
    `mutation SeedLocation($obj: Locations_insert_input!) {
       insert_Locations_one(object: $obj) { id name }
     }`,
    {
      obj: {
        name,
        address: overrides.address ?? '1 Test Street',
        city: overrides.city ?? 'Testville',
        country: overrides.country ?? 'US',
        createdAt: now,
        updatedAt: now,
      },
    },
  );
  return {
    id: data.insert_Locations_one.id,
    name: data.insert_Locations_one.name,
  };
}

export async function deleteLocation(
  api: ApiClient,
  id: number,
): Promise<void> {
  await api.gql(
    `mutation DeleteLocation($id: bigint!) {
       delete_Locations_by_pk(id: $id) { id }
     }`,
    { id },
  );
}

export async function seedStation(
  api: ApiClient,
  locationId: number,
  overrides: Partial<{ id: string; isOnline: boolean; protocol: string }> = {},
): Promise<SeededStation> {
  const id = overrides.id ?? `${shortId()}-cp`;
  const now = nowIso();
  const data = await api.gql<{
    insert_ChargingStations_one: { id: string; pkId: number };
  }>(
    `mutation SeedStation($obj: ChargingStations_insert_input!) {
       insert_ChargingStations_one(object: $obj) { id pkId }
     }`,
    {
      obj: {
        id,
        locationId,
        isOnline: overrides.isOnline ?? true,
        protocol: overrides.protocol ?? 'ocpp2.0.1',
        createdAt: now,
        updatedAt: now,
      },
    },
  );
  return { id, pkId: data.insert_ChargingStations_one.pkId, locationId };
}

export async function deleteStation(
  api: ApiClient,
  pkId: number,
): Promise<void> {
  await api.gql(
    `mutation DeleteStation($pkId: Int!) {
       delete_ChargingStations_by_pk(pkId: $pkId) { pkId }
     }`,
    { pkId },
  );
}

export async function seedTransaction(
  api: ApiClient,
  stationId: string,
  overrides: Partial<{
    transactionId: string;
    isActive: boolean;
    totalKwh: number;
  }> = {},
): Promise<SeededTransaction> {
  const transactionId = overrides.transactionId ?? `${shortId()}-tx`;
  const now = nowIso();
  const data = await api.gql<{
    insert_Transactions_one: { id: number; transactionId: string };
  }>(
    `mutation SeedTransaction($obj: Transactions_insert_input!) {
       insert_Transactions_one(object: $obj) { id transactionId }
     }`,
    {
      obj: {
        transactionId,
        stationId,
        isActive: overrides.isActive ?? true,
        totalKwh: overrides.totalKwh ?? 0,
        createdAt: now,
        updatedAt: now,
      },
    },
  );
  return {
    transactionId,
    stationId,
    pkId: data.insert_Transactions_one.id,
  };
}

// Seeds a sequence of MeterValues rows under an existing transaction so
// the transaction detail page's Recharts surfaces (Energy / Power /
// Current / State of Charge) have data points to render. Each row carries
// a `sampledValue` JSON array with one entry per measurand. The chart
// component requires a `context` of Transaction.Begin / Sample.Periodic /
// Transaction.End for a row to be plotted.
export async function seedMeterValues(
  api: ApiClient,
  transactionDatabaseId: number,
  count = 6,
): Promise<void> {
  const baseTime = Date.now();
  const rows = Array.from({ length: count }, (_, i) => {
    const ts = new Date(baseTime + i * 60_000).toISOString();
    const energyKwh = i * 0.5; // 0, 0.5, 1.0, 1.5, ...
    const powerKw = 7.2;
    const context =
      i === 0
        ? 'Transaction.Begin'
        : i === count - 1
          ? 'Transaction.End'
          : 'Sample.Periodic';
    return {
      transactionDatabaseId,
      timestamp: ts,
      sampledValue: [
        {
          value: energyKwh,
          context,
          measurand: 'Energy.Active.Import.Register',
          unitOfMeasure: { unit: 'kWh' },
        },
        {
          value: powerKw,
          context,
          measurand: 'Power.Active.Import',
          unitOfMeasure: { unit: 'kW' },
        },
      ],
      createdAt: ts,
      updatedAt: ts,
    };
  });
  await api.gql(
    `mutation SeedMeterValues($rows: [MeterValues_insert_input!]!) {
       insert_MeterValues(objects: $rows) { affected_rows }
     }`,
    { rows },
  );
}

export async function deleteMeterValuesForTransaction(
  api: ApiClient,
  transactionDatabaseId: number,
): Promise<void> {
  await api.gql(
    `mutation DeleteMeterValues($id: Int!) {
       delete_MeterValues(where: { transactionDatabaseId: { _eq: $id } }) { affected_rows }
     }`,
    { id: transactionDatabaseId },
  );
}

export async function deleteTransaction(
  api: ApiClient,
  transactionId: string,
): Promise<void> {
  await api.gql(
    `mutation DeleteTransaction($transactionId: String!) {
       delete_Transactions(where: { transactionId: { _eq: $transactionId } }) { affected_rows }
     }`,
    { transactionId },
  );
}

// Authorization seed helpers. The default token shape mimics an ISO14443
// RFID card and is marked Accepted so RemoteStart / RemoteStop can
// reference it. Tests that need a Blocked or expired authorization pass
// overrides explicitly.
export async function seedAuthorization(
  api: ApiClient,
  overrides: Partial<{
    idToken: string;
    idTokenType: string;
    status: string;
  }> = {},
): Promise<SeededAuthorization> {
  const idToken = overrides.idToken ?? `${shortId().toUpperCase()}-RFID`;
  const idTokenType = overrides.idTokenType ?? 'ISO14443';
  const status = overrides.status ?? 'Accepted';
  const now = nowIso();
  const data = await api.gql<{
    insert_Authorizations_one: {
      id: number;
      idToken: string;
      idTokenType: string;
      status: string;
    };
  }>(
    `mutation SeedAuthorization($obj: Authorizations_insert_input!) {
       insert_Authorizations_one(object: $obj) { id idToken idTokenType status }
     }`,
    {
      obj: {
        idToken,
        idTokenType,
        status,
        createdAt: now,
        updatedAt: now,
      },
    },
  );
  return {
    id: data.insert_Authorizations_one.id,
    idToken: data.insert_Authorizations_one.idToken,
    idTokenType: data.insert_Authorizations_one.idTokenType,
    status: data.insert_Authorizations_one.status,
  };
}

export async function deleteAuthorization(
  api: ApiClient,
  id: number,
): Promise<void> {
  await api.gql(
    `mutation DeleteAuthorization($id: Int!) {
       delete_Authorizations_by_pk(id: $id) { id }
     }`,
    { id },
  );
}

export async function purgeAllE2eRows(api: ApiClient): Promise<void> {
  // Stale-row purge for accumulated test data. Used by globalSetup and
  // globalTeardown. Order respects FK constraints AND a CitrineOS Core
  // Postgres trigger on ChargingStations that fails the delete unless
  // StatusNotifications referencing the station are cleared first.
  await api
    .gql(
      `mutation PurgeStatusNotifications {
         delete_StatusNotifications(where: { stationId: { _like: "e2e-%" } }) { affected_rows }
       }`,
    )
    .catch(() => undefined);

  await api
    .gql(
      `mutation PurgeLatestStatusNotifications {
         delete_LatestStatusNotifications(where: { stationId: { _like: "e2e-%" } }) { affected_rows }
       }`,
    )
    .catch(() => undefined);

  await api
    .gql<{ Transactions: { transactionId: string }[] }>(
      `query StaleTransactions {
         Transactions(where: { transactionId: { _like: "e2e-%" } }) { transactionId }
       }`,
    )
    .then(async ({ Transactions }) => {
      for (const t of Transactions) {
        await deleteTransaction(api, t.transactionId).catch(() => undefined);
      }
    })
    .catch(() => undefined);

  await api
    .gql<{ ChargingStations: { pkId: number }[] }>(
      `query StaleStations {
         ChargingStations(where: { id: { _like: "e2e-%" } }) { pkId }
       }`,
    )
    .then(async ({ ChargingStations }) => {
      for (const s of ChargingStations) {
        await deleteStation(api, s.pkId).catch(() => undefined);
      }
    })
    .catch(() => undefined);

  // Authorizations: e2e seeds use uppercase suffix, so match by idToken prefix
  // OR by the full e2e- token format. Both shapes are produced by
  // seedAuthorization(); the regex covers either.
  await api
    .gql(
      `mutation PurgeAuthorizations {
         delete_Authorizations(
           where: { _or: [
             { idToken: { _ilike: "E2E-%" } },
             { idToken: { _ilike: "%-RFID" } },
             { idToken: { _eq: "_PROBE_E2E_AUTH" } }
           ] }
         ) { affected_rows }
       }`,
    )
    .catch(() => undefined);

  await api
    .gql(
      `mutation PurgeLocations {
         delete_Locations(where: { name: { _like: "e2e-%" } }) { affected_rows }
       }`,
    )
    .catch(() => undefined);
}
