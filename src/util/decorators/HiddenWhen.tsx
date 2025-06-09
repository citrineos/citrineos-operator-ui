// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export const HIDDEN_WHEN = 'hiddenWhen';

export type IsHiddenCheck = (parentRecord: any) => boolean;

export const HiddenWhen = (isHidden: IsHiddenCheck) => {
  return (target: any, key: string) => {
    Reflect.defineMetadata(HIDDEN_WHEN, isHidden, target, key);
  };
};
