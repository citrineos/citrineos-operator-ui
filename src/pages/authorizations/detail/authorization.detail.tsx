import React, { useMemo, useCallback } from 'react';
import { Card, Flex, Table, Tabs, TabsProps } from 'antd';
import { useParams } from 'react-router-dom';
import { useNavigation, useOne, useList } from '@refinedev/core';
import { ResourceType } from '../../../resource-type';
import { getPlainToInstanceOptions } from '@util/tables';
import { AuthorizationDto } from '../../../dtos/authoriation.dto';
import {
  AUTHORIZATIONS_SHOW_QUERY,
  GET_TRANSACTIONS_FOR_AUTHORIZATION,
} from '../queries';
import { getAuthorizationColumns } from '../columns';
import { TransactionDto } from '../../../dtos/transaction.dto';
import { getTransactionColumns } from '../../transactions/columns';
import { AuthorizationDetailCard } from './authorization.detail.card';
import './style.scss';

export const AuthorizationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { goBack, push } = useNavigation();
  const back = useCallback(() => goBack(), [goBack]);

  const { data: authData, isLoading: authLoading } = useOne<AuthorizationDto>({
    resource: ResourceType.AUTHORIZATIONS,
    id,
    meta: { gqlQuery: AUTHORIZATIONS_SHOW_QUERY },
    queryOptions: getPlainToInstanceOptions(AuthorizationDto, true),
  });
  const authorization = authData?.data;

  const { data: txData, isLoading: txLoading } = useList<TransactionDto>({
    resource: ResourceType.TRANSACTIONS,
    meta: {
      gqlQuery: GET_TRANSACTIONS_FOR_AUTHORIZATION,
      gqlVariables: {
        limit: 10000,
        id: Number(authorization?.idTokenId),
        offset: 0,
        order_by: [],
        where: {},
      },
    },
    queryOptions: getPlainToInstanceOptions(TransactionDto, true),
  });

  const authColumns = useMemo(
    () => getAuthorizationColumns(push, false),
    [push],
  );
  const txColumns = useMemo(() => getTransactionColumns(push, false), [push]);

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'Transactions',
      children: txLoading ? (
        <p>Loading...</p>
      ) : (
        <Table
          rowKey="id"
          dataSource={txData?.data}
          pagination={false}
          className="full-width"
        >
          {txColumns}
        </Table>
      ),
    },
  ];

  if (authLoading) return <p>Loading...</p>;
  if (!authorization) return <p>No Data Found</p>;

  return (
    <Flex vertical>
      <Card className="authorization-details">
        <AuthorizationDetailCard authorization={authorization} />
      </Card>
      <Card>
        <Tabs defaultActiveKey="1" items={tabItems} />
      </Card>
    </Flex>
  );
};
