// Single source of truth for all 44 OCPP modal entries. Consumed by the
// parametric harness in tests/e2e/specs/charging-stations/commands.parametric.spec.ts;
// a count of 44 is asserted at beforeAll.
//
// Each entry maps a modal to:
//   - the OCPP version(s) it serves
//   - its category (shared / 1.6 / 2.0.1 / admin / status)
//   - its priority (P0/P1/P2)
//   - the bespoke E2E-XXX scenarios (if any) that cover it at depth
//   - parametricOnly (true when no bespoke scenarios exist; the parametric
//     harness then provides the only coverage at smoke depth)
//   - openButtonNamePattern: the regex matched by getByRole('button', { name }).
//     For modals reachable only via the OtherCommandsModal dispatcher, this is
//     the menu-item accessible name inside that dispatcher.

export interface ModalSpec {
  readonly name: string;
  readonly versions: ReadonlyArray<'1.6' | '2.0.1' | 'shared' | 'admin'>;
  readonly category:
    | 'shared'
    | 'ocpp1.6'
    | 'ocpp2.0.1'
    | 'admin'
    | 'toggle-status';
  readonly priority: 'P0' | 'P1' | 'P2';
  readonly bespokeScenarios: ReadonlyArray<string>;
  readonly parametricOnly: boolean;
  readonly openButtonNamePattern: RegExp;
}

export const OCPP_MODAL_SPECS: ReadonlyArray<ModalSpec> = [
  // Shared (5)
  {
    name: 'RemoteStartTransactionModal',
    versions: ['shared'],
    category: 'shared',
    priority: 'P0',
    bespokeScenarios: ['E2E-074', 'E2E-075', 'E2E-076'],
    parametricOnly: false,
    openButtonNamePattern: /remote start|start transaction/i,
  },
  {
    name: 'RemoteStopTransactionModal',
    versions: ['shared'],
    category: 'shared',
    priority: 'P0',
    bespokeScenarios: ['E2E-077', 'E2E-077b', 'E2E-078'],
    parametricOnly: false,
    openButtonNamePattern: /remote stop|stop transaction/i,
  },
  {
    name: 'ResetModal',
    versions: ['shared'],
    category: 'shared',
    priority: 'P0',
    bespokeScenarios: ['E2E-070', 'E2E-071', 'E2E-072', 'E2E-073'],
    parametricOnly: false,
    openButtonNamePattern: /^reset$/i,
  },
  {
    name: 'OtherCommandsModal',
    versions: ['shared'],
    category: 'shared',
    priority: 'P2',
    bespokeScenarios: ['E2E-088'],
    parametricOnly: false,
    openButtonNamePattern: /other commands/i,
  },
  {
    name: 'DataTransferModal',
    versions: ['shared'],
    category: 'shared',
    priority: 'P0',
    bespokeScenarios: ['E2E-087', 'E2E-087b'],
    parametricOnly: false,
    openButtonNamePattern: /data transfer/i,
  },

  // OCPP 1.6 (6)
  {
    name: 'ChangeAvailabilityModal16',
    versions: ['1.6'],
    category: 'ocpp1.6',
    priority: 'P0',
    bespokeScenarios: ['E2E-083'],
    parametricOnly: false,
    openButtonNamePattern: /change availability/i,
  },
  {
    name: 'ChangeConfigurationModal',
    versions: ['1.6'],
    category: 'ocpp1.6',
    priority: 'P0',
    bespokeScenarios: ['E2E-082b'],
    parametricOnly: false,
    openButtonNamePattern: /change configuration/i,
  },
  {
    name: 'GetConfigurationModal',
    versions: ['1.6'],
    category: 'ocpp1.6',
    priority: 'P1',
    bespokeScenarios: [],
    parametricOnly: true,
    openButtonNamePattern: /get configuration/i,
  },
  {
    name: 'GetDiagnosticsModal',
    versions: ['1.6'],
    category: 'ocpp1.6',
    priority: 'P1',
    bespokeScenarios: [],
    parametricOnly: true,
    openButtonNamePattern: /get diagnostics/i,
  },
  {
    name: 'TriggerMessageModal16',
    versions: ['1.6'],
    category: 'ocpp1.6',
    priority: 'P0',
    bespokeScenarios: ['E2E-084', 'E2E-084b'],
    parametricOnly: false,
    openButtonNamePattern: /trigger message/i,
  },
  {
    name: 'UpdateFirmwareModal16',
    versions: ['1.6'],
    category: 'ocpp1.6',
    priority: 'P0',
    bespokeScenarios: ['E2E-085'],
    parametricOnly: false,
    openButtonNamePattern: /update firmware/i,
  },

  // OCPP 2.0.1 (18)
  {
    name: 'ChangeAvailabilityModal201',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P0',
    bespokeScenarios: ['E2E-082'],
    parametricOnly: false,
    openButtonNamePattern: /change availability/i,
  },
  {
    name: 'CertificateSignedModal',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P1',
    bespokeScenarios: [],
    parametricOnly: true,
    openButtonNamePattern: /certificate signed/i,
  },
  {
    name: 'ClearCacheModal',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P1',
    bespokeScenarios: [],
    parametricOnly: true,
    openButtonNamePattern: /clear cache/i,
  },
  {
    name: 'CustomerInformationModal',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P1',
    bespokeScenarios: [],
    parametricOnly: true,
    openButtonNamePattern: /customer information/i,
  },
  {
    name: 'DeleteCertificateModal',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P0',
    bespokeScenarios: [],
    parametricOnly: true,
    openButtonNamePattern: /delete certificate/i,
  },
  {
    name: 'DeleteStationNetworkProfilesModal',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P1',
    bespokeScenarios: [],
    parametricOnly: true,
    openButtonNamePattern: /delete (station )?network profiles?/i,
  },
  {
    name: 'GetBaseReportModal',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P1',
    bespokeScenarios: [],
    parametricOnly: true,
    openButtonNamePattern: /get base report/i,
  },
  {
    name: 'GetInstalledCertificateIdsModal',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P1',
    bespokeScenarios: [],
    parametricOnly: true,
    openButtonNamePattern: /get installed certificate/i,
  },
  {
    name: 'GetLogsModal',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P1',
    bespokeScenarios: [],
    parametricOnly: true,
    openButtonNamePattern: /get logs/i,
  },
  {
    name: 'GetTransactionStatusModal',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P0',
    bespokeScenarios: [],
    parametricOnly: true,
    openButtonNamePattern: /get transaction status/i,
  },
  {
    name: 'GetVariablesModal',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P0',
    bespokeScenarios: ['E2E-079', 'E2E-080'],
    parametricOnly: false,
    openButtonNamePattern: /get variables/i,
  },
  {
    name: 'InstallCertificateModal',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P0',
    bespokeScenarios: [],
    parametricOnly: true,
    openButtonNamePattern: /install certificate/i,
  },
  {
    name: 'SetNetworkProfileModal',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P0',
    bespokeScenarios: [],
    parametricOnly: true,
    openButtonNamePattern: /set network profile/i,
  },
  {
    name: 'SetVariablesModal',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P0',
    bespokeScenarios: ['E2E-089', 'E2E-089b'],
    parametricOnly: false,
    openButtonNamePattern: /set variables/i,
  },
  {
    name: 'TriggerMessageModal201',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P0',
    bespokeScenarios: ['E2E-084', 'E2E-084b'],
    parametricOnly: false,
    openButtonNamePattern: /trigger message/i,
  },
  {
    name: 'UnlockConnectorModal',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P0',
    bespokeScenarios: ['E2E-086', 'E2E-086b'],
    parametricOnly: false,
    openButtonNamePattern: /unlock connector/i,
  },
  {
    name: 'UpdateAuthPasswordModal',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P0',
    bespokeScenarios: [],
    parametricOnly: true,
    openButtonNamePattern: /update auth password/i,
  },
  {
    name: 'UpdateFirmwareModal201',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P0',
    bespokeScenarios: ['E2E-085'],
    parametricOnly: false,
    openButtonNamePattern: /update firmware/i,
  },

  // Admin (12 — admin modals + status toggles)
  {
    name: 'ForceDisconnectModal',
    versions: ['admin'],
    category: 'admin',
    priority: 'P0',
    bespokeScenarios: [],
    parametricOnly: true,
    openButtonNamePattern: /force disconnect/i,
  },
  {
    name: 'ToggleStationOnlineModal',
    versions: ['admin'],
    category: 'toggle-status',
    priority: 'P1',
    bespokeScenarios: [],
    parametricOnly: true,
    openButtonNamePattern: /toggle (station )?online/i,
  },
  {
    name: 'ToggleTransactionActiveModal',
    versions: ['admin'],
    category: 'toggle-status',
    priority: 'P2',
    bespokeScenarios: [],
    parametricOnly: true,
    openButtonNamePattern: /toggle transaction/i,
  },
  // OCPP 2.0.1 dispatcher commands that the OtherCommandsModal exposes but
  // are not surfaced as standalone UI buttons. Parametric coverage is via the
  // dispatcher path. The parametric harness skips them with a documented
  // reason if the OtherCommandsModal cannot present them in the running UI.
  {
    name: 'CancelReservationModal',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P2',
    bespokeScenarios: [],
    parametricOnly: true,
    openButtonNamePattern: /cancel reservation/i,
  },
  {
    name: 'ClearChargingProfileModal',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P2',
    bespokeScenarios: [],
    parametricOnly: true,
    openButtonNamePattern: /clear charging profile/i,
  },
  {
    name: 'GetChargingProfilesModal',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P2',
    bespokeScenarios: [],
    parametricOnly: true,
    openButtonNamePattern: /get charging profiles?/i,
  },
  {
    name: 'GetCompositeScheduleModal',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P2',
    bespokeScenarios: [],
    parametricOnly: true,
    openButtonNamePattern: /get composite schedule/i,
  },
  {
    name: 'GetLocalListVersionModal',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P2',
    bespokeScenarios: [],
    parametricOnly: true,
    openButtonNamePattern: /get local list version/i,
  },
  {
    name: 'ReserveNowModal',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P2',
    bespokeScenarios: [],
    parametricOnly: true,
    openButtonNamePattern: /reserve now/i,
  },
  {
    name: 'SendLocalListModal',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P2',
    bespokeScenarios: [],
    parametricOnly: true,
    openButtonNamePattern: /send local list/i,
  },
  {
    name: 'SetChargingProfileModal',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P2',
    bespokeScenarios: [],
    parametricOnly: true,
    openButtonNamePattern: /set charging profile/i,
  },
  {
    name: 'SetDisplayMessageModal',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P2',
    bespokeScenarios: [],
    parametricOnly: true,
    openButtonNamePattern: /set display message/i,
  },
  {
    name: 'SetMonitoringBaseModal',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P2',
    bespokeScenarios: [],
    parametricOnly: true,
    openButtonNamePattern: /set monitoring base/i,
  },
  {
    name: 'SetMonitoringLevelModal',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P2',
    bespokeScenarios: [],
    parametricOnly: true,
    openButtonNamePattern: /set monitoring level/i,
  },
  {
    name: 'SetVariableMonitoringModal',
    versions: ['2.0.1'],
    category: 'ocpp2.0.1',
    priority: 'P2',
    bespokeScenarios: [],
    parametricOnly: true,
    openButtonNamePattern: /set variable monitoring/i,
  },
];

if (OCPP_MODAL_SPECS.length !== 44) {
  // Eager fail at module load so an accidental edit cannot leave the table
  // out of sync with the inventory count of 44 modals.
  throw new Error(
    `OCPP_MODAL_SPECS must have exactly 44 entries; found ${OCPP_MODAL_SPECS.length}.`,
  );
}
