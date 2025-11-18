// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { TenantPartnerProps } from '@citrineos/base';
import { MenuSection } from '@lib/client/components/main-menu/main.menu';
import { Table } from '@lib/client/components/table';
import type { RouterPush } from '@lib/utils/types';
import React from 'react';
import { clickableLinkStyle } from '@lib/client/styles/page';

/**
 * Get column definitions for partners table
 * @returns React.ReactNode with Table.Column definitions
 */
export const getPartnersColumns = (push: RouterPush) => {
  return [
    <Table.Column
      id={TenantPartnerProps.partnerProfileOCPI}
      key={TenantPartnerProps.partnerProfileOCPI}
      accessorKey={TenantPartnerProps.partnerProfileOCPI}
      header="Name"
      cell={({ row }) => {
        return (
          <div
            className={clickableLinkStyle}
            onClick={(event: React.MouseEvent) => {
              const path = `/${MenuSection.PARTNERS}/${row.original.id}`;

              // If Ctrl key (or Command key on Mac) is pressed, open in new window/tab
              if (event.ctrlKey || event.metaKey) {
                window.open(path, '_blank');
              } else {
                // Default behavior - navigate in current window
                push(path);
              }
            }}
          >
            {row.original.partnerProfileOCPI?.roles[0]?.businessDetails?.name ??
              'Unnamed Business'}
          </div>
        );
      }}
    />,
    <Table.Column
      id={TenantPartnerProps.countryCode}
      key={TenantPartnerProps.countryCode}
      accessorKey={TenantPartnerProps.countryCode}
      header="Country Code"
    />,
    <Table.Column
      id={TenantPartnerProps.partyId}
      key={TenantPartnerProps.partyId}
      accessorKey={TenantPartnerProps.partyId}
      header="Party ID"
    />,
  ];
};
