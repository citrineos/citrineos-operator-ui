'use server';

/*
 * Fetches a presigned URL from S3
 * @param fileKey - The key of the file to fetch
 * @returns The URL of the file
 */
import { generatePresignedGetUrlIfExists } from '@lib/server/clients/file/s3';

export const getPresignedUrlForGet = async (
  fileKey: string,
): Promise<string | null> => {
  if (!fileKey) {
    throw new Error('Missing file key');
  }

  try {
    return await generatePresignedGetUrlIfExists(fileKey);
  } catch (err) {
    console.error('Failed to fetch S3 Presigned URL', err);
    return null;
  }
};