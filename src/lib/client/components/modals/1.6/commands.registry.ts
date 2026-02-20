// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ModalComponentType } from '@lib/client/components/modals/modal.types';

/**
 * Command definition for OCPP 1.6 commands
 */
export interface CommandDefinition {
  /** Display name shown in the UI */
  displayName: string;
  /** Modal component type for registration */
  modalType: ModalComponentType;
}

/**
 * Registry of all OCPP 1.6 commands
 *
 * This registry maps command identifiers to their modal types.
 * To add a new command:
 * 1. Add the modal component to src/lib/client/components/modals/index.tsx
 * 2. Add the corresponding ModalComponentType enum value
 * 3. Add a new entry to this registry with a unique key
 */
export const OCPP1_6_COMMANDS_REGISTRY: Record<string, CommandDefinition> = {
  'Change Availability': {
    displayName: 'Change Availability',
    modalType: ModalComponentType.changeAvailability16,
  },
  'Data Transfer': {
    displayName: 'Data Transfer',
    modalType: ModalComponentType.dataTransfer,
  },
  'Change Configuration': {
    displayName: 'Change Configuration',
    modalType: ModalComponentType.changeConfiguration16,
  },
  'Get Configuration': {
    displayName: 'Get Configuration',
    modalType: ModalComponentType.getConfiguration16,
  },
  'Get Diagnostics': {
    displayName: 'Get Diagnostics',
    modalType: ModalComponentType.getDiagnostics16,
  },
  'Trigger Message': {
    displayName: 'Trigger Message',
    modalType: ModalComponentType.triggerMessage16,
  },
  'Update Firmware': {
    displayName: 'Update Firmware',
    modalType: ModalComponentType.updateFirmware16,
  },
};

/**
 * Get all command keys in the registry
 */
export const getOCPP16CommandKeys = (): string[] => {
  return Object.keys(OCPP1_6_COMMANDS_REGISTRY);
};

/**
 * Get command definition by key
 */
export const getOCPP16Command = (
  key: string,
): CommandDefinition | undefined => {
  return OCPP1_6_COMMANDS_REGISTRY[key];
};
