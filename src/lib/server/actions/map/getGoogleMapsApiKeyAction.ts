// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use server';

import config from '@lib/utils/config';

export async function getGoogleMapsApiKeyAction(): Promise<string> {
  return config.googleMapsApiKey || '';
}
