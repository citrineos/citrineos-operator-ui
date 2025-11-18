// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import type { DefaultColors } from '@lib/utils/enums';

export interface IDDisplayProps {
  id: string;
  startLength?: number; // Number of characters to show from the start
  endLength?: number; // Number of characters to show from the end
  color?: DefaultColors; // Color of the Tag
}
