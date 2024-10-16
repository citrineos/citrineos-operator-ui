import { gql } from 'graphql-tag';

export const GET_EVSE_LIST_FOR_STATION = gql`
  query GetEvseListForStation(
    $stationId: String!
    $where: Evses_bool_exp = {}
    $order_by: [Evses_order_by!] = {}
    $offset: Int
    $limit: Int
  ) {
    Evses(
      where: {
        VariableAttributes: { stationId: { _eq: $stationId } }
        _and: [$where]
      }
      order_by: $order_by
      offset: $offset
      limit: $limit
    ) {
      databaseId
      id
      connectorId
      createdAt
      updatedAt
    }
    Evses_aggregate(
      where: {
        VariableAttributes: { stationId: { _eq: $stationId } }
        _and: [$where]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_EVSES_FOR_STATION = gql`
  query GetEvsesForStation($stationId: String!) {
    Evses(where: { VariableAttributes: { stationId: { _eq: $stationId } } }) {
      databaseId
      id
      connectorId
      createdAt
      updatedAt
    }
  }
`;

export const GET_TRANSACTION_LIST_FOR_STATION = gql`
  query GetTransactionListForStation(
    $stationId: String!
    $where: [Transactions_bool_exp!] = []
    $order_by: [Transactions_order_by!] = {}
    $offset: Int
    $limit: Int
  ) {
    Transactions(
      where: { stationId: { _eq: $stationId }, _and: $where }
      order_by: $order_by
      offset: $offset
      limit: $limit
    ) {
      id
      timeSpentCharging
      isActive
      chargingState
      stationId
      stoppedReason
      transactionId
      evseDatabaseId
      remoteStartId
      totalKwh
      createdAt
      updatedAt
    }
    Transactions_aggregate(
      where: { stationId: { _eq: $stationId }, _and: $where }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_TRANSACTIONS_FOR_STATION = gql`
  query GetTransactionsForStation($stationId: String!) {
    Transactions(where: { stationId: { _eq: $stationId } }) {
      id
      timeSpentCharging
      isActive
      chargingState
      stationId
      stoppedReason
      transactionId
      evseDatabaseId
      remoteStartId
      totalKwh
      createdAt
      updatedAt
    }
  }
`;
