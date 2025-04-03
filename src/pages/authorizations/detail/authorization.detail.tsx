import { useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Flex, Table, Tabs, TabsProps } from 'antd';
import { useNavigation, useOne, useList } from '@refinedev/core';
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

import { getAuthorizationColumns } from '../columns';
import { ResourceType } from '../../../resource-type';
import { getPlainToInstanceOptions } from '@util/tables';
import { TransactionDto } from '../../../dtos/transaction.dto';
import { AuthorizationDto } from '../../../dtos/authoriation.dto';
import { ArrowLeftIcon } from '../../../components/icons/arrow.left.icon';
import {
  AUTHORIZATIONS_SHOW_QUERY,
  GET_TRANSACTIONS_FOR_AUTHORIZATION,
} from '../queries';
import { getTransactionColumns } from '../../transactions/columns';

export const AuthorizationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { goBack, push } = useNavigation();

  const handleGoBack = useCallback(() => goBack(), [goBack]);

  const { data: authorizationData, isLoading: authorizationLoading } =
    useOne<AuthorizationDto>({
      resource: ResourceType.AUTHORIZATIONS,
      id,
      meta: {
        gqlQuery: AUTHORIZATIONS_SHOW_QUERY,
      },
      queryOptions: getPlainToInstanceOptions(AuthorizationDto, true),
    });

  const authorization = authorizationData?.data;

  const { data: transactionData, isLoading: transactionsLoading } =
    useList<TransactionDto>({
      resource: ResourceType.TRANSACTIONS,
      meta: {
        gqlQuery: GET_TRANSACTIONS_FOR_AUTHORIZATION,
        gqlVariables: {
          limit: 10000, // trying to get all the authorized transactions
          id: Number(authorization?.idTokenId),
        },
      },
      queryOptions: getPlainToInstanceOptions(TransactionDto, true),
    });

  const columns = useMemo(() => getAuthorizationColumns(push, false), [push]);
  const transactionColumns = useMemo(
    () => getTransactionColumns(push, false),
    [],
  );

  const tabItems: TabsProps['items'] = useMemo(
    () => [
      {
        key: '1',
        label: 'Transactions',
        children: (
          <Flex vertical gap={32}>
            {transactionsLoading ? (
              <p>Loading data...</p>
            ) : (
              <Table
                rowKey="id"
                dataSource={transactionData?.data}
                className={'full-width'}
                pagination={false}
              >
                {transactionColumns}
              </Table>
            )}
          </Flex>
        ),
      },
      {
        key: '2',
        label: 'Charts',
        children: (
          <Flex vertical gap={32}>
            {transactionsLoading ? (
              <p>Loading Chart...</p>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={transactionData?.data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="id"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Flex>
        ),
      },
      {
        key: '3',
        label: 'Logs',
        children: 'Logs content',
      },
    ],
    [transactionData, transactionsLoading, transactionColumns],
  );

  if (authorizationLoading) return <p>Loading...</p>;
  if (!authorization) return <p>No Data Found</p>;

  return (
    <Flex vertical>
      <Card>
        <Flex vertical gap={32}>
          <Flex align={'center'} gap={16}>
            <ArrowLeftIcon onClick={handleGoBack} />
            <h2>Authorization Details</h2>
          </Flex>
          <Flex>
            <Table
              rowKey="id"
              dataSource={[authorization]}
              className={'full-width'}
              pagination={false}
            >
              {columns}
            </Table>
          </Flex>
          <Tabs defaultActiveKey="1" items={tabItems} />
        </Flex>
      </Card>
    </Flex>
  );
};
