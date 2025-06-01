// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { Card, Flex, Table, Tabs, TabsProps, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import { CanAccess } from '@refinedev/core';
import './style.scss';
import { ChargingStationDetailCardContent } from './charging.station.detail.card.content';
import { ChargingStationConfiguration } from './charging.station.configuration';
import { OCPPMessages } from './ocpp.messages';
import { EVSESList } from '../../../pages/evses/list/evses.list';
import {
  AccessDeniedFallback,
  ActionType,
  ChargingStationAccessType,
  ResourceType,
} from '@util/auth';
import { getPlainToInstanceOptions } from '@util/tables';
import {
  TransactionDto,
  TransactionDtoProps,
} from '../../../dtos/transaction.dto';
import { GET_TRANSACTION_LIST_FOR_STATION } from '../../../message/queries';
import { DEFAULT_SORTERS } from '../../../components/defaults';
import { getTransactionColumns } from '../../../pages/transactions/columns';
import { useNavigation } from '@refinedev/core';
import { useTable } from '@refinedev/antd';
import { AggregatedMeterValuesData } from './charging.station.aggregated.data';

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
      children: (
        <CanAccess
          resource={ResourceType.CHARGING_STATIONS}
          action={ActionType.ACCESS}
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
          action={ActionType.ACCESS}
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
          action={ActionType.ACCESS}
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
      children: (
        <CanAccess
          resource={ResourceType.TRANSACTIONS}
          action={ActionType.LIST}
          fallback={<AccessDeniedFallback />}
        >
          <Flex vertical gap={32}>
            <Table
              {...tableProps}
              rowKey={TransactionDtoProps.transactionId}
              className={'full-width'}
            >
              {transactionColumns}
            </Table>
          </Flex>
        </CanAccess>
      ),
    },
    {
      key: '5',
      label: 'Aggregated Meter Values Data',
      children: <AggregatedMeterValuesData stationId={id} />,
    },
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
