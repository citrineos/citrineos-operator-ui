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
const bucketName = config.awsS3BucketName;

// AWS SDK automatically uses credentials in this order:
// 1. Environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
// 2. IRSA (IAM Roles for Service Accounts) via web identity token
// 3. EC2 instance metadata (IAM role)
const s3Config: any = { region };

// Only add explicit credentials if they're provided
if (config.awsAccessKeyId && config.awsSecretAccessKey) {
  s3Config.credentials = {
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsSecretAccessKey,
    ...(config.awsSessionToken && { sessionToken: config.awsSessionToken }),
  };
}

const s3 = new S3Client(s3Config);

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

/*
 * Fetches a file from S3 directly
 * @param fileKey - The key of the file to fetch
 * @returns The file
 */
export const fetchFile = async (fileKey: string, bucket?: string) => {
  const command = new GetObjectCommand({
    Bucket: bucket || bucketName!,
    Key: fileKey,
  });
  const data = await s3.send(command);
  return await new Response(data.Body as ReadableStream).json();
};
