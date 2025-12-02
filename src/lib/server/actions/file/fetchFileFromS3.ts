// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use server';

import { fetchFile } from '@lib/server/clients/file/s3';
import config from '@lib/utils/config';
import { BucketType } from '@lib/utils/enums';

export async function fetchFileFromS3(
  fileKey: string,
  bucketType?: BucketType,
) {
  if (!fileKey) {
    throw new Error('Missing file key');
  }

  const bucket =
    bucketType === BucketType.CORE
      ? config.awsS3CoreBucketName
      : config.awsS3BucketName;

  try {
    return await fetchFile(fileKey, bucket);
  } catch (err: any) {
    console.error(`Failed to fetch file ${fileKey}`, err);
    throw new Error(`Failed to fetch file ${fileKey}`);
  }
}
