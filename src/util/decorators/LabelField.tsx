// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export const LABEL_FIELD = 'labelField';

export const LabelField = (field: any) => {
  return (target: Function) => {
    Reflect.defineMetadata(LABEL_FIELD, field, target.prototype);
  };
};
