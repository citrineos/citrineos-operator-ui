// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export const FIELD_LABEL = 'fieldLabel';

export const FieldLabel = (label: string) => {
  return (target: any, key: string) => {
    Reflect.defineMetadata(FIELD_LABEL, label, target, key);
  };
};
