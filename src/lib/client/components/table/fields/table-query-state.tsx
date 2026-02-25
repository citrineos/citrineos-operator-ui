import { z } from 'zod';

export const TableQueryStateSchema = z.object({
  page: z.number().optional(),
  size: z.number().optional(),
});

export type TableQueryState = z.infer<typeof TableQueryStateSchema>;
