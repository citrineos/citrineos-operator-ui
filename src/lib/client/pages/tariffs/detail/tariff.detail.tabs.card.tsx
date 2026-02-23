// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import React, { useMemo } from 'react';
import type { TariffDto } from '@citrineos/base';
import { Card, CardContent } from '@lib/client/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@lib/client/components/ui/tabs';
import { cardTabsStyle } from '@lib/client/styles/card';
import { CanAccess, useTranslate } from '@refinedev/core';
import { ActionType, ResourceType } from '@lib/utils/access.types';
import { AccessDeniedFallback } from '@lib/utils/AccessDeniedFallback';
import { Table } from '@lib/client/components/table';
import { DEFAULT_SORTERS } from '@lib/utils/consts';
import { getPlainToInstanceOptions } from '@lib/utils/tables';
import { TransactionClass } from '@lib/cls/transaction.dto';
import { ChargingStationClass } from '@lib/cls/charging.station.dto';
import {
  GET_CHARGING_STATIONS_FOR_TARIFF,
  GET_TRANSACTIONS_FOR_TARIFF,
} from '@lib/queries/tariffs';
import { useRouter } from 'next/navigation';
import {
  getTransactionColumns,
  transactionChargingStationLocationNameField,
} from '@lib/client/pages/transactions/columns';
import { getChargingStationColumns } from '@lib/client/pages/charging-stations/columns';
import { useDispatch } from 'react-redux';
import { openModal } from '@lib/utils/modal.slice';
import { ModalComponentType } from '@lib/client/components/modals/modal.types';
import { instanceToPlain } from 'class-transformer';
import type { ChargingStationDto } from '@citrineos/base';

export const TariffDetailTabsCard = ({
  tariff,
}: {
  tariff: TariffDto;
}) => {
  const { push } = useRouter();
  const dispatch = useDispatch();
  const translate = useTranslate();

  const showRemoteStartModal = (station: ChargingStationDto) => {
    dispatch(
      openModal({
        title: translate('ChargingStations.remoteStart'),
        modalComponentType: ModalComponentType.remoteStart,
        modalComponentProps: { station: instanceToPlain(station) },
      }),
    );
  };

  const handleStopTransactionClick = (station: ChargingStationDto) => {
    dispatch(
      openModal({
        title: translate('ChargingStations.remoteStop'),
        modalComponentType: ModalComponentType.remoteStop,
        modalComponentProps: { station: instanceToPlain(station) },
      }),
    );
  };

  const showResetStartModal = (station: ChargingStationDto) => {
    dispatch(
      openModal({
        title: translate('ChargingStations.reset'),
        modalComponentType: ModalComponentType.reset,
        modalComponentProps: { station: instanceToPlain(station) },
      }),
    );
  };

  const chargingStationColumns = useMemo(
    () =>
      getChargingStationColumns(
        push,
        showRemoteStartModal,
        handleStopTransactionClick,
        showResetStartModal,
      ),
    [push],
  );

  const transactionColumns = useMemo(
    () =>
      getTransactionColumns(push).filter(
        (tc) => tc.key !== transactionChargingStationLocationNameField,
      ),
    [push],
  );

  return (
    <Card>
      <CardContent>
        <Tabs defaultValue="charging-stations">
          <TabsList>
            <TabsTrigger value="charging-stations">
              {translate('ChargingStations.ChargingStations')}
            </TabsTrigger>
            <TabsTrigger value="transactions">
              {translate('Transactions.Transactions')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="charging-stations" className={cardTabsStyle}>
            <CanAccess
              resource={ResourceType.CHARGING_STATIONS}
              action={ActionType.LIST}
              fallback={<AccessDeniedFallback />}
            >
              <Table
                refineCoreProps={{
                  resource: ResourceType.CHARGING_STATIONS,
                  sorters: DEFAULT_SORTERS,
                  meta: {
                    gqlQuery: GET_CHARGING_STATIONS_FOR_TARIFF,
                    gqlVariables: { tariffId: Number(tariff.id) },
                  },
                  queryOptions: getPlainToInstanceOptions(ChargingStationClass),
                }}
                enableSorting
                enableFilters
                showHeader
              >
                {chargingStationColumns}
              </Table>
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
                    gqlQuery: GET_TRANSACTIONS_FOR_TARIFF,
                    gqlVariables: { tariffId: Number(tariff.id) },
                  },
                  queryOptions: getPlainToInstanceOptions(TransactionClass),
                }}
                enableSorting
                enableFilters
                showHeader
              >
                {transactionColumns}
              </Table>
            </CanAccess>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
