// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const TRANSACTION_LIST_QUERY = gql`
  query TransactionList(
    $offset: Int!
    $limit: Int!
    $order_by: [Transactions_order_by!]
    $where: Transactions_bool_exp
  ) {
    Transactions(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
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
      TransactionEvents(where: { eventType: { _eq: "Started" } }) {
        eventType
        IdToken {
          idToken
        }
      }
      StartTransaction {
        IdToken {
          idToken
        }
      }
      ChargingStation {
        id
        isOnline
        protocol
        locationId
        createdAt
        updatedAt
        Location {
          id
          name
          address
          city
          postalCode
          state
          country
          coordinates
          createdAt
          updatedAt
        }
      }
    }
    Transactions_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const TRANSACTION_GET_QUERY = gql`
  query GetTransactionById($id: Int!) {
    Transactions_by_pk(id: $id) {
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
      ChargingStation {
        id
        isOnline
        protocol
        locationId
        createdAt
        updatedAt
        Location {
          name
          address
          city
          postalCode
          state
          country
          coordinates
          createdAt
          updatedAt
        }
      }
      TransactionEvents(where: { eventType: { _eq: "Started" } }) {
        eventType
        IdToken {
          idToken
        }
        idTokenId
      }
    }
  }
`;

export const TRANSACTION_CREATE_MUTATION = gql`
  mutation TransactionCreate($object: Transactions_insert_input!) {
    insert_Transactions_one(object: $object) {
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

export const TRANSACTION_EDIT_MUTATION = gql`
  mutation TransactionEdit($id: Int!, $object: Transactions_set_input!) {
    update_Transactions_by_pk(pk_columns: { id: $id }, _set: $object) {
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

export const TRANSACTION_DELETE_MUTATION = gql`
  mutation TransactionDelete($id: Int!) {
    delete_Transactions_by_pk(id: $id) {
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

export const TRANSACTION_GET_ID_BY_TRANSACTION_ID_STATION_ID_QUERY = gql`
  query GetTransactionIdByTransactionIdAndStationId(
    $transactionId: String!
    $stationId: String!
  ) {
    Transactions(
      where: {
        transactionId: { _eq: $transactionId }
        stationId: { _eq: $stationId }
      }
    ) {
      id
    }
  }
`;

// TODO when possible, include the total time as well
export const TRANSACTION_SUCCESS_RATE_QUERY = gql`
  query TransactionsSuccessRate {
    success: Transactions_aggregate(where: { totalKwh: { _gt: 0 } }) {
      aggregate {
        count
      }
    }
    total: Transactions_aggregate {
      aggregate {
        count
      }
    }
  }
`;

export const GET_TRANSACTIONS_BY_AUTHORIZATION = gql`
  query AuthorizationsList(
    $offset: Int!
    $limit: Int!
    $order_by: [Authorizations_order_by!]
    $where: Authorizations_bool_exp!
  ) {
    Authorizations(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
    ) {
      id
      allowedConnectorTypes
      disallowedEvseIdPrefixes
      idTokenId
      idTokenInfoId
      IdToken {
        createdAt
        id
        idToken
        type
        updatedAt
      }
      IdTokenInfo {
        cacheExpiryDateTime
        chargingPriority
        createdAt
        groupIdTokenId
        id
        language1
        language2
        personalMessage
        status
        updatedAt
      }
    }
    Authorizations_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;
