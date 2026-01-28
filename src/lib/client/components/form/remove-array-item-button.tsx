// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import React from 'react';
import { X } from 'lucide-react';
import { buttonIconSize } from '@lib/client/styles/icon';
import { Button } from '@lib/client/components/ui/button';

export const RemoveArrayItemButton = ({
  onRemoveAction,
}: {
  onRemoveAction: () => void;
}) => {
  // type="button" necessary to not accidentally trigger any form submits
  return (
    <Button
      type="button"
      variant="destructive"
      size="xs"
      onClick={onRemoveAction}
    >
      <X className={buttonIconSize} />
    </Button>
  );
};
