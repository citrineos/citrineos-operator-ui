// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Providers } from '@lib/providers';
import config from '@lib/utils/config';
import { type Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import localFont from 'next/font/local';
import { cookies } from 'next/headers';
import React from 'react';
import './globals.css';

const roobertFont = localFont({
  src: [
    {
      path: './_fonts/Roobert-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './_fonts/Roobert-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './_fonts/Roobert-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './_fonts/Roobert-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './_fonts/Roobert-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './_fonts/Roobert-Heavy.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-roobert',
});

export const metadata: Metadata = {
  title: config.appName,
  icons: {
    icon: '/Citrine_Favicon_256_clear3.png',
  },
};

const fallbackLocale = 'en';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme');
  const mode = theme?.value === 'dark' ? 'dark' : 'light';

  const locale = await getLocale();
  const messages = await getMessages();
  const fallbackMessages = await getMessages({ locale: fallbackLocale });

  return (
    <html
      lang={locale}
      className={roobertFont.variable}
      suppressHydrationWarning
    >
      <body>
        <NextIntlClientProvider
          locale={locale}
          messages={{ ...fallbackMessages, ...messages }}
        >
          <Providers defaultMode={mode}>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
