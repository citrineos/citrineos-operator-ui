// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import config from '@lib/utils/config';

const region = config.awsRegion;
const accessKeyId = config.awsAccessKeyId;
const secretAccessKey = config.awsSecretAccessKey;
const sessionToken = config.awsSessionToken;
const bucketName = config.awsS3BucketName;

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: accessKeyId!,
    secretAccessKey: secretAccessKey!,
    sessionToken: sessionToken, // Optional. Needed for temporary credentials
  },
});

export const generatePresignedPutUrl = async (
  fileName: string,
  contentType: string,
) => {
  const command = new PutObjectCommand({
    Bucket: bucketName!,
    Key: fileName,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 600 }); // 10 min
  return { url, key: fileName };
};

export const generatePresignedGetUrlIfExists = async (fileKey: string) => {
  try {
    // Check if object exists
    await s3.send(new HeadObjectCommand({ Bucket: bucketName!, Key: fileKey }));

    const command = new GetObjectCommand({ Bucket: bucketName!, Key: fileKey });
    return await getSignedUrl(s3, command, { expiresIn: 600 }); // 10 min
  } catch (err: any) {
    // If object does not exist, return null
    if (err.name === 'NotFound') {
      console.warn(`File ${fileKey} not found`);
      return null;
    }
    throw err;
  }
};
