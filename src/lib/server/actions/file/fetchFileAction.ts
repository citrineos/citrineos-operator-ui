// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use server';

import { fetchFile } from '@lib/server/clients/file/fileAccess';
import config from '@lib/utils/config';
import { BucketType } from '@lib/utils/enums';

export async function fetchFileAction(
  fileKey: string,
  bucketType?: BucketType,
) {
  if (!fileKey) {
    throw new Error('Missing file key');
  }

  const bucket =
    bucketType === BucketType.CORE
      ? config.fileStorageType === 'gcp'
        ? config.gcpCloudStorageCoreBucketName
        : config.awsS3BucketName
      : config.fileStorageType === 'gcp'
        ? config.gcpCloudStorageBucketName
        : config.awsS3CoreBucketName;

  try {
    return await fetchFile(fileKey, bucket);
  } catch (err: any) {
    console.error(`Failed to fetch file ${fileKey}`, err);
    throw new Error(`Failed to fetch file ${fileKey}`);
  }
}
