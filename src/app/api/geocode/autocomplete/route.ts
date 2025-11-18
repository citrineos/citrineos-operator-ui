// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
import { NextResponse } from 'next/server';
import { getAddressAutocomplete } from '@lib/server/clients/map/address';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const input = searchParams.get('input');
  const country = searchParams.get('country') || 'us';

  if (!input)
    return NextResponse.json({ error: 'Missing input' }, { status: 400 });

  try {
    const predictions = await getAddressAutocomplete(input, country);
    return NextResponse.json(predictions);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
