import { z } from 'zod';

export const TableQueryStateSchema = z.object({
  page: z.number().optional(),
  size: z.number().optional(),
  sortBy: z.string().optional(),
  direction: z.enum(['asc', 'desc']).optional(),
});

export type TableQueryState = z.infer<typeof TableQueryStateSchema>;
