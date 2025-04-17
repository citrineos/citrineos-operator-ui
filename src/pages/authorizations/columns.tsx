import React from 'react';
import { Flex, Table } from 'antd';
import { CrudFilter } from '@refinedev/core';
import {
  AuthorizationDto,
  AuthorizationDtoProps,
} from '../../dtos/authoriation.dto';
import { IdTokenEnumType, AuthorizationStatusEnumType } from '@OCPP2_0_1';
import GenericTag from '../../components/tag';
import { IdTokenDtoProps } from '../../dtos/id.token.dto';
import { IdTokenInfoDtoProps } from '../../dtos/id.token.info.dto';
import { MenuSection } from '../../components/main-menu/main.menu';
import { ArrowRightIcon } from '../../components/icons/arrow.right.icon';

export const getAuthorizationColumns = (
  push: (path: string) => void,
  includeActions = true,
) => (
  <>
    <Table.Column
      key={AuthorizationDtoProps.id}
      dataIndex={AuthorizationDtoProps.id}
      title="Authorization ID"
      sorter={true}
      onCell={(record: AuthorizationDto) => ({
        className: `view-authorizations column-${AuthorizationDtoProps.id}`,
        onClick: () => push(`/${MenuSection.AUTHORIZATIONS}/${record.id}`),
        style: { cursor: 'pointer' },
      })}
      render={(_, record) => <h4>{record.id}</h4>}
    />

    <Table.Column
      key={IdTokenDtoProps.type}
      dataIndex={IdTokenDtoProps.type}
      title="Type"
      sorter={true}
      onCell={(record: AuthorizationDto) => ({
        className: `view-authorizations column-${IdTokenDtoProps.type}`,
        onClick: () => push(`/${MenuSection.AUTHORIZATIONS}/${record.id}`),
        style: { cursor: 'pointer' },
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
        onClick: () => push(`/${MenuSection.AUTHORIZATIONS}/${record.id}`),
        style: { cursor: 'pointer' },
      })}
      render={(_, record) => (
        <GenericTag
          enumValue={record.idTokenInfo?.status}
          enumType={AuthorizationStatusEnumType}
          colorMap={{ [AuthorizationStatusEnumType.Accepted]: 'green' }}
        />
      )}
    />

    {includeActions && (
      <Table.Column
        key="actions"
        dataIndex="actions"
        title="Actions"
        onCell={() => ({ className: 'column-actions' })}
        render={(_, record) => (
          <Flex
            className="view-authorizations"
            align="center"
            onClick={() => push(`/${MenuSection.AUTHORIZATIONS}/${record.id}`)}
          >
            View Detail <ArrowRightIcon />
          </Flex>
        )}
      />
    )}
  </>
);

export const getAuthorizationFilters = (value: string): CrudFilter[] => {
  const parsed = parseInt(value, 10);
  return [
    {
      operator: 'or' as const,
      value: [
        {
          field: AuthorizationDtoProps.id,
          operator: 'eq' as const,
          value: !isNaN(parsed) ? parsed : undefined,
        },
        { field: 'IdToken.type', operator: 'contains' as const, value },
        { field: 'IdTokenInfo.status', operator: 'contains' as const, value },
        {
          field: AuthorizationDtoProps.idTokenId,
          operator: 'eq' as const,
          value: !isNaN(parsed) ? parsed : undefined,
        },
        {
          field: AuthorizationDtoProps.idTokenInfoId,
          operator: 'eq' as const,
          value: !isNaN(parsed) ? parsed : undefined,
        },
      ].filter((f) => f.value !== undefined),
    },
  ];
};
