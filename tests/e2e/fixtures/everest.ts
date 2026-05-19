import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { makeApiClient, type ApiClient } from './api-client';

// EVerest fixture using the citrineos-core docker-compose prototype
// (`npm run start-everest` from citrineos-core/Server). The fixture brings
// the simulator up, waits for the simulator's OCPP BootNotification to
// register the well-known station id `cp001` in citrineos-core's DB
// (visible via Hasura), and tears the stack down on dispose.

const EVEREST_STATION_ID = 'cp001';
const DEFAULT_BOOT_TIMEOUT_MS = 90_000;
const POLL_INTERVAL_MS = 2_000;

export interface EverestHandle {
  readonly stationId: string;
  readonly pkId: number;
  stop(): Promise<void>;
}

interface EverestStartOptions {
  readonly bootTimeoutMs?: number;
  readonly citrineCoreServerPath?: string;
}

function defaultCorePath(): string {
  // The operator-ui repo is a sibling of citrineos-core. Override via env
  // CITRINE_CORE_PATH if your layout differs.
  return (
    process.env.CITRINE_CORE_PATH ??
    resolve(__dirname, '..', '..', '..', '..', 'citrineos-core', 'Server')
  );
}

async function awaitStationOnline(
  api: ApiClient,
  stationId: string,
  timeoutMs: number,
): Promise<number> {
  // citrineos-core does NOT set ChargingStations.isOnline on BootNotification
  // — that flag tracks a different administrative lifecycle. The canonical
  // signal that the OCPP layer is live is a fresh StatusNotification row.
  // We accept "station registered AND has a StatusNotification newer than
  // fixture start" as proof of liveness.
  const deadline = Date.now() + timeoutMs;
  const fixtureStart = new Date(Date.now() - 5_000).toISOString();
  let lastErr: unknown;
  while (Date.now() < deadline) {
    try {
      const data = await api.gql<{
        ChargingStations: { id: string; pkId: number }[];
        StatusNotifications: { stationId: string; timestamp: string }[];
      }>(
        `query EverestProbe($id: String!, $since: timestamptz!) {
           ChargingStations(where: { id: { _eq: $id } }) { id pkId }
           StatusNotifications(
             where: { stationId: { _eq: $id }, timestamp: { _gte: $since } }
             limit: 1
           ) { stationId timestamp }
         }`,
        { id: stationId, since: fixtureStart },
      );
      const station = data.ChargingStations[0];
      const hasFreshStatus = data.StatusNotifications.length > 0;
      if (station && hasFreshStatus) return station.pkId;
    } catch (e) {
      lastErr = e;
    }
    await delay(POLL_INTERVAL_MS);
  }
  throw new Error(
    `EVerest station ${stationId} did not come online within ${timeoutMs}ms` +
      (lastErr ? `; last error: ${String(lastErr)}` : ''),
  );
}

function runComposeCommand(
  cwd: string,
  args: ReadonlyArray<string>,
  envOverrides: Record<string, string>,
): Promise<void> {
  return new Promise((resolvePromise, rejectPromise) => {
    const proc = spawn('npm', args.slice(), {
      cwd,
      env: { ...process.env, ...envOverrides },
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: process.platform === 'win32',
    });
    let stderr = '';
    proc.stderr?.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    proc.on('error', rejectPromise);
    proc.on('exit', (code) => {
      if (code === 0) resolvePromise();
      else
        rejectPromise(
          new Error(
            `npm ${args.join(' ')} (cwd=${cwd}) exited with code ${code}\n${stderr}`,
          ),
        );
    });
  });
}

// citrineos-core's OCPP listener is on host port 8081, path `/cp001`. The
// EVerest manager image ships a baked-in default of `ws://host.docker.internal/ws/cp001`
// (port 80, wrong path) which is persisted into the manager's SQLite
// device-model storage on first boot. start.sh patches the JSON template,
// but the SQLite DB is the runtime source of truth and is not regenerated
// from JSON on subsequent boots. We therefore correct it directly via
// docker exec after compose up; the patch survives container restarts but
// is re-applied on every fixture invocation in case the container was
// recreated by `docker compose up --force-recreate`.
const CORRECT_NETWORK_PROFILE_JSON = JSON.stringify([
  {
    configurationSlot: 1,
    connectionData: {
      messageTimeout: 30,
      ocppCsmsUrl: 'ws://host.docker.internal:8081/cp001',
      ocppInterface: 'Wired0',
      ocppTransport: 'JSON',
      ocppVersion: 'OCPP20',
      securityProfile: 1,
    },
  },
]);

async function patchEverestNetworkProfile(): Promise<void> {
  const escaped = CORRECT_NETWORK_PROFILE_JSON.replace(/'/g, "''");
  const sql = `UPDATE VARIABLE_ATTRIBUTE SET VALUE='${escaped}' WHERE VARIABLE_ID = (SELECT ID FROM VARIABLE WHERE NAME='NetworkConnectionProfiles');\n`;
  // Pipe SQL via stdin to avoid shell quoting hell with the embedded JSON.
  await new Promise<void>((res, rej) => {
    const proc = spawn(
      process.platform === 'win32' ? 'docker.exe' : 'docker',
      [
        'exec',
        '-i',
        'everest-manager-1',
        'sqlite3',
        '/ext/dist/share/everest/modules/OCPP201/device_model_storage.db',
      ],
      { stdio: ['pipe', 'pipe', 'pipe'], shell: false },
    );
    let stderr = '';
    proc.stderr?.on('data', (c: Buffer) => (stderr += c.toString()));
    proc.on('exit', (code) => {
      if (code === 0) res();
      else rej(new Error(`SQLite patch failed (code ${code}): ${stderr}`));
    });
    proc.on('error', rej);
    proc.stdin?.write(sql);
    proc.stdin?.end();
  });
  // Restart the manager so libocpp re-reads the device-model DB on boot.
  await new Promise<void>((res) => {
    const proc = spawn(
      process.platform === 'win32' ? 'docker.exe' : 'docker',
      ['restart', 'everest-manager-1'],
      { stdio: 'ignore', shell: process.platform === 'win32' },
    );
    proc.on('exit', () => res());
    proc.on('error', () => res());
  });
}

// citrineos-core only creates Evse / Connector rows from explicit OCPP
// configuration messages (GetBaseReport / NotifyReport flows), not from
// BootNotification or StatusNotification. The EVerest manager image does
// not initiate that handshake out of the box, so the Hasura tables stay
// empty and any modal that drives an EvseSelector / ConnectorSelector
// (UnlockConnector, RemoteStart, RemoteStop) cannot find selectable
// options. We therefore seed a minimal EVSE+Connector pair under the
// EVerest station so happy-path scenarios can render and submit. The
// rows are idempotent (id+stationPkId composite) and removed by the
// global purge along with the EVerest station itself.
// Seeds an Authorization row that the EVerest happy-path RemoteStart can
// reference. Idempotent — uses _ilike check.
async function ensureEverestAuthorization(api: ApiClient): Promise<string> {
  const idToken = 'EVEREST-CP001-AUTH';
  const now = new Date().toISOString();
  await api
    .gql(
      `mutation EnsureAuth($obj: Authorizations_insert_input!) {
         insert_Authorizations_one(
           object: $obj,
           on_conflict: { constraint: Authorizations_idToken_idTokenType_tenantId_key, update_columns: [updatedAt] }
         ) { id }
       }`,
      {
        obj: {
          idToken,
          idTokenType: 'ISO14443',
          status: 'Accepted',
          createdAt: now,
          updatedAt: now,
        },
      },
    )
    .catch(() => undefined);
  return idToken;
}

async function ensureEverestEvseAndConnector(
  api: ApiClient,
  stationPkId: number,
): Promise<void> {
  const now = new Date().toISOString();
  // Insert an EVSE if missing.
  await api
    .gql<{ insert_Evses_one: { id: number } | null }>(
      `mutation EnsureEvse($obj: Evses_insert_input!) {
         insert_Evses_one(
           object: $obj,
           on_conflict: { constraint: Evses_pkey, update_columns: [updatedAt] }
         ) { id }
       }`,
      {
        obj: {
          stationPkId,
          stationId: EVEREST_STATION_ID,
          evseTypeId: 1,
          removed: false,
          createdAt: now,
          updatedAt: now,
        },
      },
    )
    .catch(() => undefined);
  // Insert a Connector if missing. evseId is the Evse row's PK; the
  // EvseSelector uses both id and evseTypeId, so we read the EVSE back to
  // get its real id.
  const { Evses } = await api.gql<{
    Evses: { id: number; evseTypeId: number }[];
  }>(
    `query LookupEvse($pkId: Int!) {
       Evses(where: { stationPkId: { _eq: $pkId } }) { id evseTypeId }
     }`,
    { pkId: stationPkId },
  );
  const evse = Evses[0];
  if (!evse) return;
  await api
    .gql(
      `mutation EnsureConnector($obj: Connectors_insert_input!) {
         insert_Connectors_one(
           object: $obj,
           on_conflict: { constraint: Connectors_pkey, update_columns: [updatedAt] }
         ) { id }
       }`,
      {
        obj: {
          evseId: evse.id,
          connectorId: 1,
          evseTypeConnectorId: 1,
          stationId: EVEREST_STATION_ID,
          stationPkId,
          createdAt: now,
          updatedAt: now,
        },
      },
    )
    .catch(() => undefined);
}

export async function startEverest(
  options: EverestStartOptions = {},
): Promise<EverestHandle> {
  const cwd = options.citrineCoreServerPath ?? defaultCorePath();
  const bootTimeoutMs = options.bootTimeoutMs ?? DEFAULT_BOOT_TIMEOUT_MS;

  await runComposeCommand(cwd, ['run', 'start-everest'], {});
  await patchEverestNetworkProfile();

  const api = await makeApiClient();
  let pkId: number;
  try {
    pkId = await awaitStationOnline(api, EVEREST_STATION_ID, bootTimeoutMs);
    await ensureEverestEvseAndConnector(api, pkId);
    await ensureEverestAuthorization(api);
  } finally {
    await api.dispose();
  }

  return {
    stationId: EVEREST_STATION_ID,
    pkId,
    async stop() {
      const everestDir = resolve(cwd, 'everest');
      // `docker compose down` from the everest directory tears the
      // stack down. Wrapped in npm so we use the same toolchain shell as
      // start-everest. Errors are non-fatal so a failed teardown doesn't
      // mask test results.
      await new Promise<void>((res) => {
        const proc = spawn(
          process.platform === 'win32' ? 'docker.exe' : 'docker',
          ['compose', 'down'],
          {
            cwd: everestDir,
            stdio: 'ignore',
            shell: process.platform === 'win32',
          },
        );
        proc.on('exit', () => res());
        proc.on('error', () => res());
      });
    },
  };
}
