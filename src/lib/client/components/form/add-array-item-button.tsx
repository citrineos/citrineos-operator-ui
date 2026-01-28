// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { Button } from '@lib/client/components/ui/button';
import { Plus } from 'lucide-react';
import { buttonIconSize } from '@lib/client/styles/icon';
import React from 'react';
import { useTranslate } from '@refinedev/core';

export const AddArrayItemButton = ({
  onAppendAction,
  itemLabel = 'Item',
}: {
  onAppendAction: () => void;
  itemLabel?: string;
}) => {
  const translate = useTranslate();

  // type="button" necessary to not accidentally trigger any form submits
  return (
    <Button type="button" variant="outline" size="sm" onClick={onAppendAction}>
      <Plus className={buttonIconSize} />
      {translate('buttons.add')} {itemLabel}
    </Button>
  );
};
