import React, { useEffect, useMemo } from 'react';
import { Flex, GetProps, Input, Table } from 'antd';
import { useTable } from '@refinedev/antd';
import { ResourceType } from '../../../resource-type';
import { getPlainToInstanceOptions } from '@util/tables';
import { TRANSACTION_LIST_QUERY } from '../queries';
import { TransactionDto } from '../../../dtos/transaction.dto';
import { useNavigation } from '@refinedev/core';
import { getTransactionColumns, getTransactionsFilters } from '../columns';
import { ChargingStationDto } from '../../../dtos/charging.station.dto';
import { GET_TRANSACTION_LIST_FOR_STATION } from '../../../message/queries';
import { BaseDtoProps } from '../../../dtos/base.dto';
import { DebounceSearch } from '../../../components/debounce-search';
import { EMPTY_FILTER } from '@util/consts';

type SearchProps = GetProps<typeof Input.Search>;

export interface TransactionsListProps {
  stationId?: string;
  hideTitle?: boolean;
}

export const TransactionsList = ({
  stationId,
  hideTitle = false,
}: TransactionsListProps) => {
  const { push } = useNavigation();

  const { tableProps, setFilters } = useTable<TransactionDto>({
    resource: ResourceType.TRANSACTIONS,
    sorters: { initial: [{ field: BaseDtoProps.updatedAt, order: 'desc' }] },
    meta: {
      gqlQuery: stationId
        ? GET_TRANSACTION_LIST_FOR_STATION
        : TRANSACTION_LIST_QUERY,
      gqlVariables: stationId ? { stationId } : undefined,
    },
    queryOptions: getPlainToInstanceOptions(TransactionDto),
  });

  const onSearch: SearchProps['onSearch'] = (value, _e?, _info?) => {
    if (!value || value === '') {
      setFilters(EMPTY_FILTER);
    } else {
      setFilters(getTransactionsFilters(value));
    }
  };

  const columns = useMemo(() => getTransactionColumns(push), []);

  return (
    <Flex vertical gap={32}>
      <Flex justify={'space-between'}>
        {!hideTitle && <h2>Transactions</h2>}
        <DebounceSearch onSearch={onSearch} placeholder="Search Transactions" />
      </Flex>
      <Flex>
        <Table rowKey="id" {...tableProps} className={'full-width'}>
          {columns}
        </Table>
      </Flex>
    </Flex>
  );
};
