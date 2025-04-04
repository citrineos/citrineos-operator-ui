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
