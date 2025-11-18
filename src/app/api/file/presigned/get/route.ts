// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
import { NextRequest, NextResponse } from 'next/server';
import { generatePresignedGetUrlIfExists } from '@lib/server/clients/file/s3';

export async function GET(req: NextRequest) {
  try {
    const fileKey = req.nextUrl.searchParams.get('fileKey');
    if (!fileKey) {
      return NextResponse.json({ error: 'Missing file key' }, { status: 400 });
    }

    const url = await generatePresignedGetUrlIfExists(fileKey);

    return NextResponse.json({ url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
