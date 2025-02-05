import { ResourceType } from '../../resource-type';
import { Route, Routes } from 'react-router-dom';
import React from 'react';
import { GenericParameterizedView, GenericView } from '../../components/view';
import { Transaction } from './Transaction';
import {
  TRANSACTION_CREATE_MUTATION,
  TRANSACTION_DELETE_MUTATION,
  TRANSACTION_EDIT_MUTATION,
  TRANSACTION_GET_ID_BY_TRANSACTION_ID_STATION_ID_QUERY,
  TRANSACTION_GET_QUERY,
} from './queries';
import { ExpandableColumn } from '../../components/data-model-table/expandable-column';
import { useCustom } from '@refinedev/core';
import { TruncateDisplay } from '../../components/truncate-display';
import { GenericDataTable } from '../../components/data-model-table/editable';
import { GenericViewState } from '../../model/enums';

export const TransactionView: React.FC = () => {
  return (
    <GenericView
      dtoClass={Transaction}
      resourceType={ResourceType.TRANSACTIONS}
      gqlQuery={TRANSACTION_GET_QUERY}
      editMutation={TRANSACTION_EDIT_MUTATION}
      createMutation={TRANSACTION_CREATE_MUTATION}
      deleteMutation={TRANSACTION_DELETE_MUTATION}
    />
  );
};

export const TransactionList = () => {
  return <GenericDataTable dtoClass={Transaction} editable={false} />;
};

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<TransactionList />} />
      <Route path="/:id/*" element={<TransactionView />} />
    </Routes>
  );
};

export const renderAssociatedTransactionId = (
  _: any,
  record: {
    transactionDatabaseId: string;
    [key: string]: any;
  },
  initialContent: any = record.transactionDatabaseId,
) => {
  if (!record?.transactionDatabaseId) {
    return '';
  }
  const transactionDatabaseId = record.transactionDatabaseId;
  return (
    <ExpandableColumn
      initialContent={initialContent}
      expandedContent={
        <GenericParameterizedView
          resourceType={ResourceType.TRANSACTIONS}
          id={transactionDatabaseId}
          state={GenericViewState.SHOW}
          dtoClass={Transaction}
          gqlQuery={TRANSACTION_GET_QUERY}
        />
      }
      viewTitle={`Transaction linked with ID ${record.id}`}
    />
  );
};

export const AssociatedTransaction: React.FC<{
  transactionId: string;
  stationId: string;
  associateId: any;
}> = ({ transactionId, stationId, associateId }) => {
  const { data, isLoading, isError } = useCustom<any>({
    url: 'http://localhost:8090/v1/graphql',
    method: 'post',
    config: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
    meta: {
      operation: 'GetTransactionByTransactionIdAndStationId',
      gqlQuery: TRANSACTION_GET_ID_BY_TRANSACTION_ID_STATION_ID_QUERY,
      variables: {
        transactionId: transactionId,
        stationId: stationId,
      },
    },
  });

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    console.error(
      `Error fetching transaction ${transactionId} for station ${stationId}`,
    );
    return <span>Error loading transaction</span>;
  }

  if (data?.data?.Transactions?.length !== 1) {
    return <span>N/A</span>;
  }

  const transaction = data!.data.Transactions[0];
  return renderAssociatedTransactionId(
    undefined,
    { transactionDatabaseId: transaction.id, id: associateId },
    <TruncateDisplay id={transactionId} />,
  );
};
