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
  IdTokenType,
} from '@citrineos/base';
import GenericTag from '../../components/tag';

export const getAuthorizationColumns = (push: (path: string) => void) => (
  <>
    <Table.Column
      key={IdTokenDtoProps.idToken}
      dataIndex={IdTokenDtoProps.idToken}
      title="Authorization ID"
      sorter={true}
      onCell={(record: IAuthorizationDto) => ({
        className: 'hoverable-value',
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
    />
    <Table.Column
      key="idTokenType"
      dataIndex="idTokenType"
      title="Type"
      sorter={true}
      render={(value) => (
        <GenericTag enumValue={value ?? undefined} enumType={IdTokenType} />
      )}
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
          field: `${AuthorizationDtoProps.idToken}.idTokenType`,
          operator: 'contains',
          value,
        },
      ],
    },
  ];
};
