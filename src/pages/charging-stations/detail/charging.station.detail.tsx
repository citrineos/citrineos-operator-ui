import React from 'react';
import { Card, Tabs, TabsProps } from 'antd';
import { useParams } from 'react-router-dom';
import './style.scss';
import { TransactionsList } from '../../transactions/list/transactions.list';
import { ChargingStationDetailCardContent } from './charging.station.detail.card.content';
import { ChargingStationConfiguration } from './charging.station.configuration';
import { OCPPMessages } from './ocpp.messages';
import { EVSESList } from '../../../pages/evses/list/evses.list';

export const ChargingStationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) return <p>Loading...</p>;

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'EVSEs',
      children: <EVSESList stationId={id} />,
    },
    {
      key: '2',
      label: 'OCPP Logs',
      children: <OCPPMessages stationId={id} />,
    },
    {
      key: '3',
      label: 'Configuration',
      children: <ChargingStationConfiguration stationId={id} />,
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
    <div style={{ padding: '16px' }}>
      <Card className="station-details">
        <ChargingStationDetailCardContent stationId={id} />
      </Card>

      <Card>
        <Tabs defaultActiveKey="1" items={tabItems} />
      </Card>
    </div>
  );
};
