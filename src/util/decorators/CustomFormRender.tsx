// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export const CUSTOM_FORM_RENDER = 'customFormRender';

export const CustomFormRender = (func: Function) => {
  return (target: any, key: string) => {
    Reflect.defineMetadata(CUSTOM_FORM_RENDER, func, target, key);
  };
};
