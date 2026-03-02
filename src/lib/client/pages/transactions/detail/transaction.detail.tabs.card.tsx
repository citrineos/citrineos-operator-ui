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
import { cardTabsStyle } from '@lib/client/styles/card';
import { CanAccess, useList, useTranslate } from '@refinedev/core';
import {
  ActionType,
  ResourceType,
  TransactionAccessType,
} from '@lib/utils/access.types';
import { AccessDeniedFallback } from '@lib/utils/AccessDeniedFallback';
import { Table } from '@lib/client/components/table';
import {
  type MeterValueDto,
  MeterValueProps,
  OCPP2_0_1,
  type TransactionDto,
} from '@citrineos/base';
import { GET_AUTHORIZATIONS_BY_TRANSACTION } from '@lib/queries/authorizations';
import { getPlainToInstanceOptions } from '@lib/utils/tables';
import { pageFlex } from '@lib/client/styles/page';
import { MultiSelect } from '@lib/client/components/multi-select';
import { ChartsWrapper } from '@lib/client/pages/transactions/chart/charts.wrapper';
import { TransactionEventsList } from '@lib/client/pages/transactions/detail/transaction-events/transaction.events.list';
import { GET_METER_VALUES_FOR_TRANSACTION } from '@lib/queries/meter.values';
import { MeterValueClass } from '@lib/cls/meter.value.dto';
import { useState } from 'react';
import { DEFAULT_SORTERS } from '@lib/utils/consts';
import { AuthorizationClass } from '@lib/cls/authorization.dto';
import { useColumnPreferences } from '@lib/client/hooks/useColumnPreferences';
import { authorizationsColumns } from '@lib/client/pages/authorizations/columns';

export const TransactionDetailTabsCard = ({
  transaction,
}: {
  transaction: TransactionDto;
}) => {
  const translate = useTranslate();

  const [validContexts, setValidContexts] = useState<
    OCPP2_0_1.ReadingContextEnumType[]
  >([
    OCPP2_0_1.ReadingContextEnumType.Transaction_Begin,
    OCPP2_0_1.ReadingContextEnumType.Sample_Periodic,
    OCPP2_0_1.ReadingContextEnumType.Transaction_End,
  ]);

  const {
    query: { data: meterValuesData },
  } = useList<MeterValueDto>({
    resource: ResourceType.METER_VALUES,
    meta: {
      gqlQuery: GET_METER_VALUES_FOR_TRANSACTION,
      gqlVariables: {
        limit: 10000,
        transactionDatabaseId: Number(transaction.id),
      },
    },
    sorters: [{ field: MeterValueProps.timestamp, order: 'asc' }],
    queryOptions: getPlainToInstanceOptions(MeterValueClass),
  });
  const meterValues = meterValuesData?.data ?? [];

  const authorization = transaction?.authorization;

  const { renderedVisibleColumns } = useColumnPreferences(
    authorizationsColumns,
    ResourceType.AUTHORIZATIONS,
  );

  return (
    <Card>
      <CardContent>
        <Tabs defaultValue="authorizations">
          <TabsList>
            <TabsTrigger value="authorizations">
              {translate('Authorizations.Authorizations')}
            </TabsTrigger>
            <TabsTrigger value="meter-values">Meter Value Data</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="authorizations" className={cardTabsStyle}>
            <CanAccess
              resource={ResourceType.AUTHORIZATIONS}
              action={ActionType.LIST}
              fallback={<AccessDeniedFallback />}
            >
              <Table
                refineCoreProps={{
                  resource: ResourceType.AUTHORIZATIONS,
                  sorters: DEFAULT_SORTERS,
                  meta: {
                    gqlQuery: GET_AUTHORIZATIONS_BY_TRANSACTION,
                    gqlVariables: {
                      id: authorization?.id,
                      offset: 0,
                      limit: 10,
                      order_by: [],
                    },
                  },
                  queryOptions: {
                    ...getPlainToInstanceOptions(AuthorizationClass),
                    select: (data: any) => {
                      return data;
                    },
                  },
                }}
                enableSorting
                enableFilters
                showHeader
              >
                {renderedVisibleColumns}
              </Table>
            </CanAccess>
          </TabsContent>

          <TabsContent value="meter-values" className={cardTabsStyle}>
            <CanAccess
              resource={ResourceType.TRANSACTIONS}
              action={ActionType.ACCESS}
              fallback={<AccessDeniedFallback />}
              params={{
                id: transaction.id,
                accessType: TransactionAccessType.EVENTS,
              }}
            >
              <div className={pageFlex}>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold">Contexts:</label>
                  <MultiSelect<OCPP2_0_1.ReadingContextEnumType>
                    options={Object.values(OCPP2_0_1.ReadingContextEnumType)}
                    selectedValues={validContexts}
                    setSelectedValues={setValidContexts}
                    placeholder="Select reading contexts"
                    searchPlaceholder="Search reading contexts"
                  />
                </div>

                <ChartsWrapper
                  meterValues={meterValues}
                  validContexts={validContexts}
                />
              </div>
            </CanAccess>
          </TabsContent>

          <TabsContent value="events" className={cardTabsStyle}>
            <CanAccess
              resource={ResourceType.TRANSACTIONS}
              action={ActionType.ACCESS}
              fallback={<AccessDeniedFallback />}
              params={{
                id: transaction.id,
                accessType: TransactionAccessType.EVENTS,
              }}
            >
              <TransactionEventsList transactionDatabaseId={transaction.id} />
            </CanAccess>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
