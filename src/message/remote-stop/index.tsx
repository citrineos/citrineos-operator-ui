import React, { useEffect, useState } from 'react';
import { ChargingStation } from './ChargingStation';
import { Button, Form, notification, Select, Spin } from 'antd';
import { GET_ACTIVE_TRANSACTIONS } from './queries';
import { useCustom } from '@refinedev/core';
import { BaseRestClient } from '../../util/BaseRestClient';
import { MessageConfirmation } from '../MessageConfirmation';

const GRAPHQL_ENDPOINT_URL = import.meta.env.VITE_API_URL;

export interface RemoteStopProps {
  station: ChargingStation;
}

export const requestStopTransaction = async (
  stationId: string,
  transactionId: string,
  setLoading: (loading: boolean) => void,
) => {
  try {
    setLoading(true);
    const payload = { transactionId };
    const client = new BaseRestClient();
    const response = await client.post(
      `/evdriver/requestStopTransaction?identifier=${stationId}&tenantId=1`,
      MessageConfirmation,
      {},
      payload,
    );

    if (response && response.success) {
      notification.success({
        message: 'Success',
        description: 'The stop transaction request was successful.',
        placement: 'topRight',
      });
    } else {
      notification.error({
        message: 'Request Failed',
        description:
          'The stop transaction request did not receive a successful response. Response: ' +
          JSON.stringify(response),
        placement: 'topRight',
      });
    }
  } catch (error: any) {
    const msg = `Could not perform request stop transaction, got error: ${error.message}`;
    console.error(msg, error);
    notification.error({
      message: 'Error',
      description: msg,
      placement: 'topRight',
    });
  } finally {
    setLoading(false);
  }
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
