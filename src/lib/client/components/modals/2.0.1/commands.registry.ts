// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ModalComponentType } from '@lib/client/components/modals/modal.types';

/**
 * Command definition for OCPP 2.0.1 commands
 */
export interface CommandDefinition {
  /** Display name shown in the UI */
  displayName: string;
  /** Modal component type for registration */
  modalType: ModalComponentType;
}

/**
 * Registry of all OCPP 2.0.1 commands
 *
 * This registry maps command identifiers to their modal types.
 * To add a new command:
 * 1. Add the modal component to src/lib/client/components/modals/index.tsx
 * 2. Add the corresponding ModalComponentType enum value
 * 3. Add a new entry to this registry with a unique key
 */
export const OCPP2_0_1_COMMANDS_REGISTRY: Record<string, CommandDefinition> = {
  'Certificate Signed': {
    displayName: 'Certificate Signed',
    modalType: ModalComponentType.certificateSigned,
  },
  'Change Availability': {
    displayName: 'Change Availability',
    modalType: ModalComponentType.changeAvailability201,
  },
  'Clear Cache': {
    displayName: 'Clear Cache',
    modalType: ModalComponentType.clearCache,
  },
  'Customer Information': {
    displayName: 'Customer Information',
    modalType: ModalComponentType.customerInformation,
  },
  'Data Transfer': {
    displayName: 'Data Transfer',
    modalType: ModalComponentType.dataTransfer,
  },
  'Delete Certificate': {
    displayName: 'Delete Certificate',
    modalType: ModalComponentType.deleteCertificate,
  },
  'Delete Station Network Profiles': {
    displayName: 'Delete Station Network Profiles',
    modalType: ModalComponentType.deleteStationNetworkProfiles,
  },
  'Get Base Report': {
    displayName: 'Get Base Report',
    modalType: ModalComponentType.getBaseReport,
  },
  'Get Installed Certificate IDs': {
    displayName: 'Get Installed Certificate IDs',
    modalType: ModalComponentType.getInstalledCertificateIds,
  },
  'Get Logs': {
    displayName: 'Get Logs',
    modalType: ModalComponentType.getLogs,
  },
  'Get Transaction Status': {
    displayName: 'Get Transaction Status',
    modalType: ModalComponentType.getTransactionStatus,
  },
  'Get Variables': {
    displayName: 'Get Variables',
    modalType: ModalComponentType.getVariables,
  },
  'Install Certificate': {
    displayName: 'Install Certificate',
    modalType: ModalComponentType.installCertificate,
  },
  'Set Network Profile': {
    displayName: 'Set Network Profile',
    modalType: ModalComponentType.setNetworkProfile,
  },
  'Set Variables': {
    displayName: 'Set Variables',
    modalType: ModalComponentType.setVariables,
  },
  'Trigger Message': {
    displayName: 'Trigger Message',
    modalType: ModalComponentType.triggerMessage201,
  },
  'Unlock Connector': {
    displayName: 'Unlock Connector',
    modalType: ModalComponentType.unlockConnector,
  },
  'Update Auth Password': {
    displayName: 'Update Auth Password',
    modalType: ModalComponentType.updateAuthPassword,
  },
  'Update Firmware': {
    displayName: 'Update Firmware',
    modalType: ModalComponentType.updateFirmware201,
  },
};

/**
 * Get all command keys in the registry
 */
export const getOCPP201CommandKeys = (): string[] => {
  return Object.keys(OCPP2_0_1_COMMANDS_REGISTRY);
};

/**
 * Get command definition by key
 */
export const getOCPP201Command = (
  key: string,
): CommandDefinition | undefined => {
  return OCPP2_0_1_COMMANDS_REGISTRY[key];
};
