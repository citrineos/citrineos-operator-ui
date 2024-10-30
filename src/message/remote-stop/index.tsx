import React, { useEffect, useState } from 'react';
import { Button, Form, Select, Spin } from 'antd';
import { GET_ACTIVE_TRANSACTIONS } from './queries';
import { useCustom } from '@refinedev/core';
import { MessageConfirmation } from '../MessageConfirmation';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import { triggerMessageAndHandleResponse } from '../util';

const GRAPHQL_ENDPOINT_URL = import.meta.env.VITE_API_URL;

export interface RemoteStopProps {
  station: ChargingStation;
}

export const requestStopTransaction = async (
  stationId: string,
  transactionId: string,
  setLoading: (loading: boolean) => void,
) => {
  await triggerMessageAndHandleResponse({
    url: `/evdriver/requestStopTransaction?identifier=${stationId}&tenantId=1`,
    responseClass: MessageConfirmation,
    data: { transactionId },
    responseSuccessCheck: (response: MessageConfirmation) =>
      response && response.success,
    setLoading,
  });
};

export const RemoteStop: React.FC<RemoteStopProps> = ({ station }) => {
  const [selectedTransaction, setSelectedTransaction] = useState<
    string | undefined
  >(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const { data, isLoading, isError } = useCustom<any>({
    url: GRAPHQL_ENDPOINT_URL,
    method: 'post',
    config: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
    meta: {
      operation: 'GetActiveTransactions',
      gqlQuery: GET_ACTIVE_TRANSACTIONS,
      variables: {
        stationId: station.id,
      },
    },
  });

  useEffect(() => {
    if (data?.data?.Transactions.length === 1) {
      setSelectedTransaction(data.data.Transactions[0].transactionId);
    }
  }, [data]);

  const handleSubmit = async () => {
    if (selectedTransaction) {
      await requestStopTransaction(station.id, selectedTransaction, setLoading);
    }
  };

  if (isLoading || loading) return <Spin />;
  if (isError) return <p>Error loading transactions</p>;

  return (
    <Form layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="Active Transactions">
        <Select
          value={selectedTransaction}
          onChange={setSelectedTransaction}
          placeholder="Select a transaction"
        >
          {data?.data?.Transactions.map((transaction: any) => (
            <Select.Option
              key={transaction.id}
              value={transaction.transactionId}
            >
              {transaction.transactionId}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          disabled={!selectedTransaction}
        >
          Request Stop
        </Button>
      </Form.Item>
    </Form>
  );
};
