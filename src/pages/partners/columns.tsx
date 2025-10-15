// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Table } from 'antd';
import React from 'react';
import { MenuSection } from '../../components/main-menu/main.menu';
import { ITenantPartnerDtoProps } from '@citrineos/base';

/**
 * Get column definitions for partners table
 * @returns React.ReactNode with Table.Column definitions
 */
export const getPartnersColumns = (
  push: (path: string, ...rest: unknown[]) => void,
) => {
  return (
    <>
      <Table.Column
        key={ITenantPartnerDtoProps.partnerProfileOCPI}
        dataIndex={ITenantPartnerDtoProps.partnerProfileOCPI}
        title="Name"
        sorter={true}
        onCell={(record) => ({
          onClick: (event: React.MouseEvent) => {
            const path = `/${MenuSection.PARTNERS}/${record.id}`;

            // If Ctrl key (or Command key on Mac) is pressed, open in new window/tab
            if (event.ctrlKey || event.metaKey) {
              window.open(path, '_blank');
            } else {
              // Default behavior - navigate in current window
              push(path);
            }
          },
          style: { cursor: 'pointer' },
        })}
        render={(_: any, record) => {
          return (
            <h4>
              {record.partnerProfileOCPI?.roles[0]?.businessDetails?.name}
            </h4>
          );
        }}
      />
      <Table.Column
        key={ITenantPartnerDtoProps.countryCode}
        dataIndex={ITenantPartnerDtoProps.countryCode}
        title="Country Code"
      />
      <Table.Column
        key={ITenantPartnerDtoProps.partyId}
        dataIndex={ITenantPartnerDtoProps.partyId}
        title="Party ID"
      />
    </>
  );
};
