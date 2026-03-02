// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
import { z } from 'zod';

const ColumnConfigurationSchema = z.object({
  key: z.string(),
  header: z.string(),
  accessorKey: z.string().optional(),
  visible: z.boolean().optional(),
  sortable: z.boolean().optional(),
  cellRender: z.any().optional(),
});

export type ColumnConfiguration = z.infer<typeof ColumnConfigurationSchema>;
