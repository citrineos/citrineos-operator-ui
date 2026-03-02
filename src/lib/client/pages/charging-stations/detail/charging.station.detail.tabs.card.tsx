// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { Card, CardContent } from '@lib/client/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@lib/client/components/ui/tabs';
import { CanAccess, useTranslate } from '@refinedev/core';
import {
  ActionType,
  ChargingStationAccessType,
  ResourceType,
} from '@lib/utils/access.types';
import { EVSESList } from '@lib/client/pages/charging-stations/detail/evses/evses.list';
import { OCPPMessages } from '@lib/client/pages/charging-stations/detail/ocpp.messages';
import { AccessDeniedFallback } from '@lib/utils/AccessDeniedFallback';
import { Table } from '@lib/client/components/table';
import { DEFAULT_SORTERS } from '@lib/utils/consts';
import { GET_TRANSACTION_LIST_FOR_STATION } from '@lib/queries/transactions';
import { getPlainToInstanceOptions } from '@lib/utils/tables';
import { TransactionClass } from '@lib/cls/transaction.dto';
import { AggregatedMeterValuesData } from '@lib/client/pages/charging-stations/detail/charging.station.aggregated.data';
import React from 'react';
import ChargingStationConfiguration from '@lib/client/pages/charging-stations/detail/charging.station.configuration';
import {
  transactionChargingStationLocationNameField,
  transactionsColumns,
  transactionStationIdField,
} from '@lib/client/pages/transactions/columns';
import { cardTabsStyle } from '@lib/client/styles/card';
import { useColumnPreferences } from '@lib/client/hooks/useColumnPreferences';

export const ChargingStationDetailTabsCard = ({
  stationId,
}: {
  stationId: string;
}) => {
  const translate = useTranslate();

  const { renderedVisibleColumns } = useColumnPreferences(
    transactionsColumns.filter(
      (tc) =>
        tc.key !== transactionStationIdField &&
        tc.key !== transactionChargingStationLocationNameField,
    ),
    ResourceType.TRANSACTIONS,
  );

  return (
    <Card>
      <CardContent>
        <Tabs defaultValue="evses">
          <TabsList>
            <TabsTrigger value="evses">EVSEs</TabsTrigger>
            <TabsTrigger value="ocpp-logs">OCPP Logs</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="transactions">
              {translate('Transactions.Transactions')}
            </TabsTrigger>
            <TabsTrigger value="aggregated">
              Aggregated Meter Values Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="evses" className={cardTabsStyle}>
            <CanAccess
              resource={ResourceType.CHARGING_STATIONS}
              action={ActionType.ACCESS}
              params={{
                id: stationId,
                accessType: ChargingStationAccessType.TOPOLOGY,
              }}
              fallback={
                <p className="text-muted-foreground">
                  You don&#39;t have permission to view EVSEs.
                </p>
              }
            >
              <EVSESList stationId={stationId} />
            </CanAccess>
          </TabsContent>

          <TabsContent value="ocpp-logs" className={cardTabsStyle}>
            <CanAccess
              resource={ResourceType.CHARGING_STATIONS}
              action={ActionType.ACCESS}
              params={{
                id: stationId,
                accessType: ChargingStationAccessType.OCPP_MESSAGES,
              }}
              fallback={
                <p className="text-muted-foreground">
                  You don&#39;t have permission to view OCPP logs.
                </p>
              }
            >
              <OCPPMessages stationId={stationId} />
            </CanAccess>
          </TabsContent>

          <TabsContent value="configuration" className={cardTabsStyle}>
            <CanAccess
              resource={ResourceType.CHARGING_STATIONS}
              action={ActionType.ACCESS}
              params={{
                id: stationId,
                accessType: ChargingStationAccessType.CONFIGURATION,
              }}
              fallback={
                <p className="text-muted-foreground">
                  You don&#39;t have permission to view station configurations.
                </p>
              }
            >
              <ChargingStationConfiguration stationId={stationId} />
            </CanAccess>
          </TabsContent>

          <TabsContent value="transactions" className={cardTabsStyle}>
            <CanAccess
              resource={ResourceType.TRANSACTIONS}
              action={ActionType.LIST}
              fallback={<AccessDeniedFallback />}
            >
              <Table
                refineCoreProps={{
                  resource: ResourceType.TRANSACTIONS,
                  sorters: DEFAULT_SORTERS,
                  meta: {
                    gqlQuery: GET_TRANSACTION_LIST_FOR_STATION,
                    gqlVariables: { stationId },
                  },
                  queryOptions: getPlainToInstanceOptions(TransactionClass),
                }}
                enableSorting
                enableFilters
                showHeader
              >
                {renderedVisibleColumns}
              </Table>
            </CanAccess>
          </TabsContent>

          <TabsContent value="aggregated" className={cardTabsStyle}>
            <AggregatedMeterValuesData stationId={stationId} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
