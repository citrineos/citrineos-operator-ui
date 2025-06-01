// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useCallback } from 'react';
import { Card, Flex, Table, Tabs, TabsProps } from 'antd';
import { useNavigation, useOne, CanAccess } from '@refinedev/core';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ResourceType } from '@util/auth';
import { getPlainToInstanceOptions } from '@util/tables';
import {
  TransactionDto,
  TransactionDtoProps,
} from '../../../dtos/transaction.dto';
import { AuthorizationDto } from '../../../dtos/authoriation.dto';
import {
  AUTHORIZATIONS_SHOW_QUERY,
  GET_TRANSACTIONS_FOR_AUTHORIZATION,
} from '../queries';
import { getTransactionColumns } from '../../transactions/columns';
import { AccessDeniedFallback, ActionType } from '@util/auth';
import { AuthorizationDetailCard } from './authorization.detail.card';
import './style.scss';
import { useTable } from '@refinedev/antd';
import { useParams } from 'react-router-dom';

export const AuthorizationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { push } = useNavigation();

  const { data: authData, isLoading: authLoading } = useOne<AuthorizationDto>({
    resource: ResourceType.AUTHORIZATIONS,
    id,
    meta: { gqlQuery: AUTHORIZATIONS_SHOW_QUERY },
    queryOptions: getPlainToInstanceOptions(AuthorizationDto, true),
  });
  const authorization = authData?.data;

  const authIdTokenId =
    authorization && authorization.idTokenId != null
      ? Number(authorization.idTokenId)
      : undefined;

  const { tableProps: transactionTableProps } = useTable<TransactionDto>({
    resource: ResourceType.TRANSACTIONS,
    meta: {
      gqlQuery: GET_TRANSACTIONS_FOR_AUTHORIZATION,
      gqlVariables: {
        limit: 10000, // trying to get all the authorized transactions
        id: Number(authorization?.idTokenId),
      },
    },
    queryOptions: {
      enabled: !!authIdTokenId,
      ...getPlainToInstanceOptions(TransactionDto, true),
    },
  });

  const transactionColumns = useMemo(() => getTransactionColumns(push), []);

  const tabItems: TabsProps['items'] = useMemo(
    () => [
      {
        key: '1',
        label: 'Transactions',
        children: (
          <CanAccess
            resource={ResourceType.TRANSACTIONS}
            action={ActionType.LIST}
            fallback={<AccessDeniedFallback />}
          >
            <Flex vertical gap={32}>
              <Table
                {...transactionTableProps}
                rowKey={TransactionDtoProps.transactionId}
                className={'full-width'}
              >
                {transactionColumns}
              </Table>
            </Flex>
          </CanAccess>
        ),
      },
      // {
      //   key: '2',
      //   label: 'Charts',
      //   children: (
      //     <Flex vertical gap={32}>
      //       {transactionsLoading ? (
      //         <p>Loading Chart...</p>
      //       ) : (
      //         <ResponsiveContainer width="100%" height={400}>
      //           <LineChart
      //             data={transactionData?.data}
      //             margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      //           >
      //             <CartesianGrid strokeDasharray="3 3" />
      //             <XAxis dataKey="id" />
      //             <YAxis />
      //             <Tooltip />
      //             <Legend />
      //             <Line
      //               type="monotone"
      //               dataKey="id"
      //               stroke="#8884d8"
      //               activeDot={{ r: 8 }}
      //             />
      //           </LineChart>
      //         </ResponsiveContainer>
      //       )}
      //     </Flex>
      //   ),
      // },
      // {
      //   key: '3',
      //   label: 'Logs',
      //   children: 'Logs content',
      // },
    ],
    [transactionTableProps, transactionColumns],
  );

  if (authLoading) return <p>Loading...</p>;
  if (!authorization) return <p>No Data Found</p>;

  return (
    <CanAccess
      resource={ResourceType.AUTHORIZATIONS}
      action={ActionType.SHOW}
      fallback={<AccessDeniedFallback />}
      params={{ id: authorization.id }}
    >
      <Flex vertical>
        <Card className="authorization-details">
          <AuthorizationDetailCard authorization={authorization} />
        </Card>
        <Card>
          <Tabs defaultActiveKey="1" items={tabItems} />
        </Card>
      </Flex>
    </CanAccess>
  );
};
