// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { AccessControlProvider, CanReturnType } from '@refinedev/core';
import {
  ActionType,
  ChargingStationAccessType,
  CommandType,
  ListCanReturnType,
  OperatorCanParams,
  ResourceType,
  TransactionAccessType,
} from './types';

/**
 * Configuration options for access provider
 */
export interface AccessProviderConfig {}

export const createAccessProvider = (
  config: AccessProviderConfig = {},
): AccessControlProvider => {
  const canDefault = true; // Permissive By Default

  return {
    can: async (operatorCanParams: OperatorCanParams) => {
      const { resource, action, params } = operatorCanParams;

      let canResponse: CanReturnType | ListCanReturnType = {
        can: canDefault,
        reason: canDefault
          ? undefined
          : `No explicit permission defined for ${action} on ${resource}`,
      };

      const check =
        resource === ResourceType.CHARGING_STATIONS &&
        action === ActionType.COMMAND &&
        params?.commandType === CommandType.OTHER_COMMANDS;

      if (check) {
        canResponse = {
          can: true,
          meta: {
            // Excluding these as an example, and because they would be duplicates
            exceptions: [
              {
                param: 'commandType',
                values: ['Remote Start', 'Remote Stop', 'Reset'],
              },
            ],
          },
        };
      }

      return canResponse;
    },
  };
};
