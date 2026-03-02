// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import React from 'react';
import { TenantPartnerProps } from '@citrineos/base';
import { MenuSection } from '@lib/client/components/main-menu/main.menu';
import { TenantPartnerClass } from '@lib/cls/tenant.partner.cls';
import { TableCellLink } from '@lib/client/components/table-cell-link';
import type { CellContext } from '@tanstack/react-table';

export const partnersColumns = [
  {
    key: TenantPartnerProps.partnerProfileOCPI,
    header: 'Name',
    visible: true,
    cellRender: ({ row }: CellContext<TenantPartnerClass, unknown>) => (
      <TableCellLink
        path={`/${MenuSection.PARTNERS}/${row.original.id}`}
        value={
          row.original.partnerProfileOCPI?.roles[0]?.businessDetails?.name ??
          'Unnamed Business'
        }
      />
    ),
  },
  {
    key: TenantPartnerProps.countryCode,
    header: 'Country Code',
    visible: true,
  },
  {
    key: TenantPartnerProps.partyId,
    header: 'Party ID',
    visible: true,
  },
];
