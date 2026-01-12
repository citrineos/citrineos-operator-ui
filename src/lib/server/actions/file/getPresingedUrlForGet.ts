// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use server';

/*
 * Fetches a presigned URL from S3
 * @param fileKey - The key of the file to fetch
 * @returns The URL of the file
 */
import { generatePresignedGetUrlIfExists } from '@lib/server/clients/file/fileAccess';

export const getPresignedUrlForGet = async (
  fileKey: string,
): Promise<string | null> => {
  if (!fileKey) {
    throw new Error('Missing file key');
  }

  try {
    return await generatePresignedGetUrlIfExists(fileKey);
  } catch (err) {
    console.error('Failed to fetch Presigned URL', err);
    return null;
  }
};
