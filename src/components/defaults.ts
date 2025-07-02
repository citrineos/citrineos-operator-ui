// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

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
