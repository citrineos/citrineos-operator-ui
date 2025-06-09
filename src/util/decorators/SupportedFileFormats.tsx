// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export const SUPPORTED_FILE_FORMATS = 'supportedFileFormats';

export const SupportedFileFormats = (formats: string[]) => {
  return (target: any, key: string) => {
    Reflect.defineMetadata(SUPPORTED_FILE_FORMATS, formats, target, key);
  };
};
