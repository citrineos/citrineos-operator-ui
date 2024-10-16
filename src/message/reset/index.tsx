import React, { useEffect, useState } from 'react';
import { Button, Form, notification, Select, Spin } from 'antd';
import { useCustom } from '@refinedev/core';
import { BaseRestClient } from '../../util/BaseRestClient';
import { MessageConfirmation } from '../MessageConfirmation';
import { ResetEnumType, ResetRequest } from '@citrineos/base';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import { GET_EVSES_FOR_STATION } from '../queries';

const GRAPHQL_ENDPOINT_URL = import.meta.env.VITE_API_URL;

export interface ResetChargingStationProps {
  station: ChargingStation;
}

export const ResetChargingStation: React.FC<ResetChargingStationProps> = ({
  station,
}) => {
  const [selectedResetType, setSelectedResetType] = useState<ResetEnumType>(
    ResetEnumType.Immediate,
  );
  const [selectedEvseId, setSelectedEvseId] = useState<number | undefined>(
    undefined,
  );
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
      operation: 'GetEvsesForStation',
      gqlQuery: GET_EVSES_FOR_STATION,
      variables: {
        stationId: station.id,
      },
    },
  });

  useEffect(() => {
    if (data?.data?.Evses?.length === 1) {
      setSelectedEvseId(data.data.Evses[0].id);
    }
  }, [data]);

  const requestReset = async (request: ResetRequest) => {
    try {
      setLoading(true);
      const client = new BaseRestClient();
      const response = await client.post(
        `/configuration/reset?identifier=${station.id}&tenantId=1`, // TODO: update when multi-tenancy is implemented
        MessageConfirmation,
        {},
        request,
      );

      if (response && response.success) {
        notification.success({
          message: 'Success',
          description: 'The reset request was successful.',
        });
      } else {
        notification.error({
          message: 'Request Failed',
          description:
            'The reset request did not receive a successful response.',
        });
      }
    } catch (error: any) {
      const msg = `Could not perform request reset, got error: ${error.message}`;
      console.error(msg, error);
      notification.error({
        message: 'Error',
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (selectedResetType) {
      requestReset({ type: selectedResetType, evseId: selectedEvseId });
    }
  };

  if (isLoading || loading) return <Spin />;
  if (isError) return <p>Error loading EVSEs</p>;

  return (
    <Form layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="Type">
        <Select
          value={selectedResetType}
          onChange={setSelectedResetType}
          placeholder="Select reset type"
        >
          {Object.entries(ResetEnumType).map(([key, value]) => (
            <Select.Option key={key} value={value}>
              {value}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="EVSEs"
        extra="Selecting no EVSE will reset the whole charger."
      >
        <Select
          value={selectedEvseId}
          onChange={setSelectedEvseId}
          placeholder="Select EVSE"
        >
          {data?.data?.Evses?.map((evse: any) => (
            <Select.Option key={evse.id} value={evse.id}>
              {evse.id}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" disabled={!selectedResetType}>
          Request Reset
        </Button>
      </Form.Item>
    </Form>
  );
};
