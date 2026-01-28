// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use server';

import { redirect } from 'next/navigation';

export default async function RootPage() {
  redirect('/overview');
}
