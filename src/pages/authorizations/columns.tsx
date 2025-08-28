// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Table } from 'antd';
import { CrudFilter } from '@refinedev/core';
import { MenuSection } from '../../components/main-menu/main.menu';
import {
  AuthorizationDtoProps,
  IAuthorizationDto,
  IdTokenDtoProps,
} from '@citrineos/base';

export const getAuthorizationColumns = (push: (path: string) => void) => (
  <>
    <Table.Column
      key={IdTokenDtoProps.idToken}
      dataIndex={IdTokenDtoProps.idToken}
      title="Authorization ID"
      sorter={true}
      onCell={(record: IAuthorizationDto) => ({
        className: `column-${IdTokenDtoProps.idToken}`,
        onClick: (e: React.MouseEvent) => {
          const path = `/${MenuSection.AUTHORIZATIONS}/${record.id}`;
          if (e.ctrlKey || e.metaKey) {
            window.open(path, '_blank');
          } else {
            push(path);
          }
        },
        style: { cursor: 'pointer' },
      })}
      render={(_, record) => <h4>{record.idToken}</h4>}
    />
  </>
);

export const getAuthorizationFilters = (value: string): CrudFilter[] => {
  return [
    {
      operator: 'or',
      value: [
        {
          field: `${AuthorizationDtoProps.idToken}.idToken`,
          operator: 'contains',
          value,
        },
        {
          field: `${AuthorizationDtoProps.idToken}.type`,
          operator: 'contains',
          value,
        },
      ],
    },
  ];
};
