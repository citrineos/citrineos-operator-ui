'use server';

import { fetchFile } from '@lib/server/clients/file/s3';

export async function fetchFileFromS3(fileKey: string, bucket?: string) {
  if (!fileKey) {
    throw new Error('Missing file key');
  }

  try {
    return await fetchFile(fileKey, bucket);
  } catch (err: any) {
    console.error(`Failed to fetch file ${fileKey}`, err);
    throw new Error(`Failed to fetch file ${fileKey}`);
  }
}