import { NextRequest, NextResponse } from 'next/server';
import { generatePresignedPutUrl } from '@lib/server/clients/file/s3';

export async function POST(req: NextRequest) {
  try {
    const { fileName, contentType } = await req.json();

    if (!fileName || !contentType) {
      return NextResponse.json({ error: 'Missing fileName or contentType' }, { status: 400 });
    }

    const { url, key } = await generatePresignedPutUrl(fileName, contentType);

    return NextResponse.json({ url, key });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
