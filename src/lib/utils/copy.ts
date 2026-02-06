// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
import { toast } from 'sonner';

export const copy = async (
  value: string | null | undefined,
  displayValue = true,
) => {
  if (!value) return;

  await navigator.clipboard.writeText(value);

  toast.message(`Copied${displayValue ? ` ${value}` : ''} to clipboard.`);
};
