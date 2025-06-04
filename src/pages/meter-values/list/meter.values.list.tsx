// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { useTable } from '@refinedev/antd';
import { TransactionEventDto } from '../../../dtos/transaction.event.dto';
import { ResourceType } from '@util/auth';
import { getPlainToInstanceOptions } from '@util/tables';
import React, { useMemo } from 'react';
import {
  GET_METER_VALUES_FOR_TRANSACTION_EVENT,
  METER_VALUE_LIST_QUERY,
} from '../queries';
import {
  MeterValueDto,
  MeterValueDtoProps,
} from '../../../dtos/meter.value.dto';
import { getMeterValueColumns } from '../columns';
import { Table } from 'antd';

export const MeterValuesList = ({ transactionEventId }: any) => {
  const { tableProps } = useTable<MeterValueDto>({
    resource: ResourceType.METER_VALUES,
    sorters: {
      initial: [{ field: MeterValueDtoProps.timestamp, order: 'desc' }],
    },
    meta: {
      gqlQuery: transactionEventId
        ? GET_METER_VALUES_FOR_TRANSACTION_EVENT
        : METER_VALUE_LIST_QUERY,
      gqlVariables: transactionEventId ? { transactionEventId } : undefined,
    },
    queryOptions: getPlainToInstanceOptions(TransactionEventDto),
  });

  const columns = useMemo(() => getMeterValueColumns(), []);

  return (
    <Table
      rowKey="id"
      className={transactionEventId ? 'table nested' : 'full-width'}
      {...tableProps}
    >
      {columns}
    </Table>
  );
};
