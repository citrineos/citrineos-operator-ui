export const DEFAULT_SORTERS: any = {
  initial: [
    {
      field: 'id',
      order: 'asc',
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
