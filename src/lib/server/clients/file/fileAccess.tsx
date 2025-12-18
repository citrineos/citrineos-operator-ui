// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import config from '@lib/utils/config';
import {
  fetchFileCloudStorage,
  generatePresignedGetUrlIfExistsCloudStorage,
  generatePresignedPutUrlCloudStorage,
} from './cloudstorage';
import { fetchFileS3, generatePresignedGetUrlIfExistsS3, generatePresignedPutUrlS3 } from './s3';

const useGcp = config.fileStorageType?.toLowerCase() === 'gcp';

export const generatePresignedPutUrl = useGcp
  ? generatePresignedPutUrlCloudStorage
  : generatePresignedPutUrlS3;

export const generatePresignedGetUrlIfExists = useGcp
  ? generatePresignedGetUrlIfExistsCloudStorage
  : generatePresignedGetUrlIfExistsS3;

export const fetchFile = useGcp ? fetchFileCloudStorage : fetchFileS3;
