import {CrudFilter} from "@refinedev/core";

export const NEW_IDENTIFIER = 'new';

export const EMPTY_FILTER: CrudFilter[] = [
  {
    operator: 'or',
    value: [],
  },
];