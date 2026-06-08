// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
import { z } from 'zod';

export const FilterItemSchema = z.object({
  field: z.string(),
  op: z.string(),
  value: z.union([z.string(), z.array(z.string())]),
});

export type FilterItem = z.infer<typeof FilterItemSchema>;

export const TableQueryStateSchema = z.object({
  page: z.number().optional(),
  size: z.number().optional(),
  sortBy: z.string().optional(),
  direction: z.enum(['asc', 'desc']).optional(),
  filters: z.array(FilterItemSchema).optional(),
});

export type TableQueryState = z.infer<typeof TableQueryStateSchema>;
