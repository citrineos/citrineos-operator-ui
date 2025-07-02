// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { CustomAction } from '../../components/custom-actions';

export const FIELD_CUSTOM_ACTIONS = 'fieldCustomActions';

export const FieldCustomActions = (customActions: CustomAction<any>[]) => {
  return function (target: any, key: string) {
    Reflect.defineMetadata(FIELD_CUSTOM_ACTIONS, customActions, target, key);
  };
};
