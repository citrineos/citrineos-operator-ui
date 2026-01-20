// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use server';

import { getUserLocale } from '@lib/server/hooks/getUserLocale';
import { getRequestConfig } from 'next-intl/server';

const fallbackLocale = 'en';

export default getRequestConfig(async () => {
  const locale = (await getUserLocale()) ?? fallbackLocale;
  const messages = (
    await import(`../../../public/locales/${locale}/common.json`)
  ).default;
  const fallbackMessages = (
    await import(`../../../public/locales/${fallbackLocale}/common.json`)
  ).default;

  return {
    locale,
    messages: { ...fallbackMessages, messages },
  };
});
