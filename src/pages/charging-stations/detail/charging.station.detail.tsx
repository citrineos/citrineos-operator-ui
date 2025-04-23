import React, { useMemo } from 'react';
import { Card, Flex, Table, Tabs, TabsProps } from 'antd';
import { useParams } from 'react-router-dom';
import './style.scss';
import { ChargingStationDetailCardContent } from './charging.station.detail.card.content';
import { ChargingStationConfiguration } from './charging.station.configuration';
import { OCPPMessages } from './ocpp.messages';
import { EVSESList } from '../../../pages/evses/list/evses.list';
import { getPlainToInstanceOptions } from '@util/tables';
import {
  TransactionDto,
  TransactionDtoProps,
} from '../../../dtos/transaction.dto';
import { GET_TRANSACTION_LIST_FOR_STATION } from '../../../message/queries';
import { ResourceType } from '../../../resource-type';
import { DEFAULT_SORTERS } from '../../../components/defaults';
import { getTransactionColumns } from '../../../pages/transactions/columns';
import { useNavigation } from '@refinedev/core';
import { useTable } from '@refinedev/antd';

export const ChargingStationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { push } = useNavigation();

  const { tableProps, setFilters } = useTable<TransactionDto>({
    resource: ResourceType.TRANSACTIONS,
    sorters: DEFAULT_SORTERS,
    meta: {
      gqlQuery: GET_TRANSACTION_LIST_FOR_STATION,
      gqlVariables: { stationId: id },
    },
    queryOptions: getPlainToInstanceOptions(TransactionDto),
  });

  const transactionColumns = useMemo(() => getTransactionColumns(push), []);

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
      children: (
        <Flex vertical gap={32}>
          <Table
            {...tableProps}
            rowKey={TransactionDtoProps.transactionId}
            className={'full-width'}
          >
            {transactionColumns}
          </Table>
        </Flex>
      ),
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
