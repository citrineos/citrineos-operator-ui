import React from 'react';
import { Card, Tabs, TabsProps, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import { CanAccess } from '@refinedev/core';
import './style.scss';
import { TransactionsList } from '../../transactions/list/transactions.list';
import { ChargingStationDetailCardContent } from './charging.station.detail.card.content';
import { ChargingStationConfiguration } from './charging.station.configuration';
import { OCPPMessages } from './ocpp.messages';
import { EVSESList } from '../../../pages/evses/list/evses.list';
import {
  ActionType,
  ChargingStationAccessType,
  ResourceType,
} from '@util/auth';

export const ChargingStationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) return <p>Loading...</p>;

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'EVSEs',
      children: (
        <CanAccess
          resource={ResourceType.CHARGING_STATIONS}
          action={ActionType.LIST}
          params={{ id: id, accessType: ChargingStationAccessType.TOPOLOGY }}
          fallback={
            <Typography.Text type="secondary">
              You don't have permission to view EVSEs.
            </Typography.Text>
          }
        >
          <EVSESList stationId={id} />
        </CanAccess>
      ),
    },
    {
      key: '2',
      label: 'OCPP Logs',
      children: (
        <CanAccess
          resource={ResourceType.CHARGING_STATIONS}
          action={ActionType.LIST}
          params={{
            id: id,
            accessType: ChargingStationAccessType.OCPP_MESSAGES,
          }}
          fallback={
            <Typography.Text type="secondary">
              You don't have permission to view OCPP logs.
            </Typography.Text>
          }
        >
          <OCPPMessages stationId={id} />
        </CanAccess>
      ),
    },
    {
      key: '3',
      label: 'Configuration',
      children: (
        <CanAccess
          resource={ResourceType.CHARGING_STATIONS}
          action={ActionType.LIST}
          params={{
            id: id,
            accessType: ChargingStationAccessType.CONFIGURATION,
          }}
          fallback={
            <Typography.Text type="secondary">
              You don't have permission to view station configurations.
            </Typography.Text>
          }
        >
          <ChargingStationConfiguration stationId={id} />
        </CanAccess>
      ),
    },
    {
      key: '4',
      label: 'Transactions',
      children: <TransactionsList stationId={id} hideTitle />,
    },
    // {
    //   key: '5',
    //   label: 'Data',
    //   children: 'Data content',
    // },
  ];

  return (
    <CanAccess
      resource={ResourceType.CHARGING_STATIONS}
      action={ActionType.SHOW}
      params={{ id }}
      fallback={
        <Typography.Text>
          You don't have permission to view this charging station.
        </Typography.Text>
      }
    >
      <div style={{ padding: '16px' }}>
        <Card className="station-details">
          <ChargingStationDetailCardContent stationId={id} />
        </Card>

        <Card>
          <Tabs defaultActiveKey="1" items={tabItems} />
        </Card>
      </div>
    </CanAccess>
  );
};
