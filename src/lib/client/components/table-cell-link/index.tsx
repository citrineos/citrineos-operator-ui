// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import React, { type ReactNode } from 'react';
import { clickableLinkStyle } from '@lib/client/styles/page';
import { useRouter } from 'next/navigation';

export const TableCellLink = ({
  path,
  value,
}: {
  path: string;
  value: ReactNode | string;
}) => {
  const { push } = useRouter();

  return (
    <div
      className={clickableLinkStyle}
      onClick={(event: React.MouseEvent) => {
        // If Ctrl key (or Command key on Mac) is pressed, open in new window/tab
        if (event.ctrlKey || event.metaKey) {
          window.open(path, '_blank');
        } else {
          // Default behavior - navigate in current window
          push(path);
        }
      }}
    >
      {value}
    </div>
  );
};
