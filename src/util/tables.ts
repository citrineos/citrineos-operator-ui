export function generateSearchFilters(
  values: any,
  searchableKeys: Set<string>,
): [] {
  const result = [];
  let filterValue;

  if (values?.search?.length > 0) {
    filterValue = values.search;
  }

  for (const searchableKey of searchableKeys) {
    result.push({
      field: searchableKey,
      operator: 'contains',
      value: filterValue,
    });
  }

  return [
    {
      operator: 'or',
      value: result,
    },
  ] as any;
}
