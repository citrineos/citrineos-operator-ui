// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Flex, Table } from 'antd';
import { CanAccess, CrudFilter } from '@refinedev/core';
import {
  AuthorizationDto,
  AuthorizationDtoProps,
} from '../../dtos/authoriation.dto';
import { IdTokenEnumType, AuthorizationStatusEnumType } from '@OCPP2_0_1';
import GenericTag from '../../components/tag';
import { IdTokenDtoProps } from '../../dtos/id.token.dto';
import { IdTokenInfoDtoProps } from '../../dtos/id.token.info.dto';
import { MenuSection } from '../../components/main-menu/main.menu';
import { ActionType, AccessDeniedFallback, ResourceType } from '@util/auth';

export const getAuthorizationColumns = (push: (path: string) => void) => (
  <>
    <Table.Column
      key={IdTokenDtoProps.idToken}
      dataIndex={IdTokenDtoProps.idToken}
      title="Authorization ID"
      sorter={true}
      onCell={(record: AuthorizationDto) => ({
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
      render={(_, record) => <h4>{record.idToken?.idToken}</h4>}
    />

    <Table.Column
      key={IdTokenDtoProps.type}
      dataIndex={IdTokenDtoProps.type}
      title="Type"
      sorter={true}
      onCell={(record: AuthorizationDto) => ({
        className: `view-authorizations column-${IdTokenDtoProps.type}`,
      })}
      render={(_, record) => (
        <GenericTag
          enumValue={record.idToken?.type}
          enumType={IdTokenEnumType}
        />
      )}
    />

    <Table.Column
      key={IdTokenInfoDtoProps.status}
      dataIndex={IdTokenInfoDtoProps.status}
      title="Status"
      sorter={true}
      onCell={(record: AuthorizationDto) => ({
        className: `view-authorizations column-${IdTokenInfoDtoProps.status}`,
      })}
      render={(_, record) => (
        <GenericTag
          enumValue={record.idTokenInfo?.status}
          enumType={AuthorizationStatusEnumType}
          colorMap={{ [AuthorizationStatusEnumType.Accepted]: 'green' }}
        />
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
          field: `${AuthorizationDtoProps.idToken}.${IdTokenDtoProps.idToken}`,
          operator: 'contains',
          value,
        },
        {
          field: `${AuthorizationDtoProps.idToken}.${IdTokenDtoProps.type}`,
          operator: 'contains',
          value,
        },
        {
          field: `${AuthorizationDtoProps.idTokenInfo}.${IdTokenInfoDtoProps.status}`,
          operator: 'contains',
          value,
        },
      ],
    },
  ];
};
