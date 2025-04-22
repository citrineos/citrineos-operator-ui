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
import { ArrowRightIcon } from '../../components/icons/arrow.right.icon';
import {
  ActionType,
  AccessDeniedFallback,
  ResourceType,
} from '@util/auth';

export const getAuthorizationColumns = (
  push: (path: string, ...rest: unknown[]) => void,
  includeActions = true,
) => {
  return (
    <CanAccess
      resource={ResourceType.AUTHORIZATIONS}
      action={ActionType.LIST}
      fallback={<AccessDeniedFallback />}
    >
      <Table.Column
        key={AuthorizationDtoProps.id}
        dataIndex={AuthorizationDtoProps.id}
        title="Authorization ID"
        sorter={true}
        onCell={() => ({
          className: `column-${AuthorizationDtoProps.id}`,
        })}
        render={(_: any, record: AuthorizationDto) => record.id}
      />
      <Table.Column
        key={IdTokenDtoProps.type}
        dataIndex={IdTokenDtoProps.type}
        title="Type"
        sorter={true}
        onCell={() => ({
          className: `column-${IdTokenDtoProps.type}`,
        })}
        render={(_: any, record: AuthorizationDto) => {
          return (
            <GenericTag
              enumValue={record.idToken?.type}
              enumType={IdTokenEnumType}
            />
          );
        }}
      />
      <Table.Column
        key={IdTokenInfoDtoProps.status}
        dataIndex={IdTokenInfoDtoProps.status}
        title="Status"
        sorter={true}
        onCell={() => ({
          className: `column-${IdTokenInfoDtoProps.status}`,
        })}
        render={(_: any, record: AuthorizationDto) => {
          return (
            <GenericTag
              colorMap={{
                [AuthorizationStatusEnumType.Accepted]: 'green',
              }}
              enumValue={record.idTokenInfo?.status}
              enumType={AuthorizationStatusEnumType}
            />
          );
        }}
      />
      {includeActions && (
        <Table.Column
          key="actions"
          dataIndex="actions"
          title="Actions"
          onCell={() => ({
            className: 'column-actions',
          })}
          render={(_: any, record: AuthorizationDto) => (
            <Flex
              onClick={() =>
                push(`/${MenuSection.AUTHORIZATIONS}/${record.id}`)
              }
              className="pointer"
              align={'center'}
            >
              View Detail <ArrowRightIcon />
            </Flex>
          )}
        />
      )}
    </CanAccess>
  );
};

export const getAuthorizationFilters = (value: string): CrudFilter[] => {
  const parsedValue = parseInt(value, 10);

  const filters = [
    {
      operator: 'or' as const,
      value: [
        {
          field: AuthorizationDtoProps.id,
          operator: 'eq' as const,
          value: !isNaN(parsedValue) ? parsedValue : undefined,
        },
        {
          field: 'IdToken.type',
          operator: 'contains' as const,
          value,
        },
        {
          field: 'IdTokenInfo.status',
          operator: 'contains' as const,
          value,
        },
        {
          field: AuthorizationDtoProps.idTokenId,
          operator: 'eq' as const,
          value: !isNaN(parsedValue) ? parsedValue : undefined,
        },
        {
          field: AuthorizationDtoProps.idTokenInfoId,
          operator: 'eq' as const,
          value: !isNaN(parsedValue) ? parsedValue : undefined,
        },
      ],
    },
  ];

  // Remove filters with undefined values
  filters[0].value = filters[0].value.filter(
    (filter) => filter.value !== undefined,
  );

  return filters;
};
