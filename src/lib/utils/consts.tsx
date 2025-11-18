// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import type { CrudFilter } from '@refinedev/core';

export const I18N_COOKIE_NAME = 'NEXT_LOCALE';
export const DEFAULT_LOCALE = 'en';

export const NEW_IDENTIFIER = 'new';

export const EMPTY_FILTER: CrudFilter[] = [
  {
    operator: 'or',
    value: [],
  },
];

export const DEFAULT_SORTERS: any = {
  initial: [
    {
      field: 'updatedAt',
      order: 'desc',
    },
  ],
};

export const DEFAULT_EXPANDED_DATA_FILTER = (
  field: string,
  operator: string,
  value: any,
) => {
  return {
    permanent: [
      {
        field,
        operator,
        value,
      },
    ],
  };
};

export const NOT_APPLICABLE = 'N/A';

// API routes
export const GENERATE_PRESIGNED_PUT_URL = '/api/file/presigned/upload';
export const GENERATE_PRESIGNED_GET_URL = '/api/file/presigned/get';
export const AUTO_COMPLETE_ADDRESS = '/api/geocode/autocomplete';
export const GET_ADDRESS_DETAILS = '/api/geocode/details';

// S3 bucket folder name
export const S3_BUCKET_FOLDER_IMAGES = 'images';


