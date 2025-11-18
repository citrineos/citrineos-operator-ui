// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  GENERATE_PRESIGNED_GET_URL,
  GENERATE_PRESIGNED_PUT_URL,
} from '@lib/utils/consts';

/*
 * Uploads a file to S3
 * @param file - The file to upload
 * @param fileName - The name of the file. If it is undefined, the original file name will be used
 * @returns The key of the uploaded file
 */
export async function handleUploadToS3(
  file: File,
  fileName?: string,
): Promise<string> {
  // Get signed URL
  const res = await fetch(GENERATE_PRESIGNED_PUT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: fileName || file.name,
      contentType: file.type,
    }),
  });
  if (!res.ok) {
    throw new Error('Failed to get signed URL');
  }

  // Upload file using signed URL
  const { url, key } = await res.json();
  const uploadRes = await fetch(url, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });
  if (!uploadRes.ok) {
    throw new Error('Failed to upload file');
  }

  return key;
}

/*
 * Fetches a presigned URL from S3
 * @param fileKey - The key of the file to fetch
 * @returns The URL of the file
 */
export const fetchUrlFromS3 = async (
  fileKey: string,
): Promise<string | null> => {
  try {
    const res = await fetch(
      `${GENERATE_PRESIGNED_GET_URL}?fileKey=${encodeURIComponent(fileKey)}`,
    );
    if (!res.ok) {
      console.error('Failed to fetch S3 URL', await res.text());
      return null;
    }

    const data = await res.json();
    return data.url ?? null;
  } catch (err) {
    console.error('Failed to fetch S3 URL', err);
    return null;
  }
};
