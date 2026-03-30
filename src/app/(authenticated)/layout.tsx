// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import AuthenticatedLayout from '@lib/client/components/authenticated-layout';
import React from 'react';

export default async function Layout({ children }: React.PropsWithChildren) {
  return (
    <AuthenticatedLayout authKey="authenticated">
      {children}
    </AuthenticatedLayout>
  );
}
