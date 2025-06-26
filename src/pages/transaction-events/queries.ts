// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const TRANSACTION_EVENT_LIST_QUERY = gql`
  query TransactionEventList(
    $offset: Int!
    $limit: Int!
    $order_by: [TransactionEvents_order_by!]
    $where: TransactionEvents_bool_exp
  ) {
    TransactionEvents(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
    ) {
      id
      offline
      eventType
      stationId
      triggerReason
      evseId
      idTokenId
      numberOfPhasesUsed
      reservationId
      seqNo
      transactionDatabaseId
      transactionInfo
      cableMaxCurrent
      createdAt
      timestamp
      updatedAt
      MeterValues {
        id
        transactionDatabaseId
        transactionEventId
        sampledValue
        timestamp
        createdAt
        updatedAt
      }
    }
    TransactionEvents_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const TRANSACTION_EVENT_GET_QUERY = gql`
  query GetTransactionEventById($id: Int!) {
    TransactionEvents_by_pk(id: $id) {
      id
      offline
      eventType
      stationId
      triggerReason
      evseId
      idTokenId
      numberOfPhasesUsed
      reservationId
      seqNo
      transactionDatabaseId
      transactionInfo
      cableMaxCurrent
      createdAt
      timestamp
      updatedAt
    }
  }
`;

export const TRANSACTION_EVENT_CREATE_MUTATION = gql`
  mutation TransactionEventCreate($object: TransactionEvents_insert_input!) {
    insert_TransactionEvents_one(object: $object) {
      id
      offline
      eventType
      stationId
      triggerReason
      evseId
      idTokenId
      numberOfPhasesUsed
      reservationId
      seqNo
      transactionDatabaseId
      transactionInfo
      cableMaxCurrent
      createdAt
      timestamp
      updatedAt
    }
  }
`;

export const TRANSACTION_EVENT_EDIT_MUTATION = gql`
  mutation TransactionEventEdit(
    $id: Int!
    $object: TransactionEvents_set_input!
  ) {
    update_TransactionEvents_by_pk(pk_columns: { id: $id }, _set: $object) {
      id
      offline
      eventType
      stationId
      triggerReason
      evseId
      idTokenId
      numberOfPhasesUsed
      reservationId
      seqNo
      transactionDatabaseId
      transactionInfo
      cableMaxCurrent
      createdAt
      timestamp
      updatedAt
    }
  }
`;

export const TRANSACTION_EVENT_DELETE_MUTATION = gql`
  mutation TransactionEventDelete($id: Int!) {
    delete_TransactionEvents_by_pk(id: $id) {
      id
      offline
      eventType
      stationId
      triggerReason
      evseId
      idTokenId
      numberOfPhasesUsed
      reservationId
      seqNo
      transactionDatabaseId
      transactionInfo
      cableMaxCurrent
      createdAt
      timestamp
      updatedAt
    }
  }
`;

export const GET_TRANSACTION_EVENTS_FOR_TRANSACTION_LIST_QUERY = gql`
  query TransactionEventList(
    $transactionDatabaseId: Int!
    $offset: Int!
    $limit: Int!
    $order_by: [TransactionEvents_order_by!]
    $where: TransactionEvents_bool_exp! = []
  ) {
    TransactionEvents(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: {
        transactionDatabaseId: { _eq: $transactionDatabaseId }
        _and: [$where]
      }
    ) {
      id
      offline
      eventType
      stationId
      triggerReason
      evseId
      idTokenId
      numberOfPhasesUsed
      reservationId
      seqNo
      transactionDatabaseId
      transactionInfo
      cableMaxCurrent
      createdAt
      timestamp
      updatedAt
    }
    TransactionEvents_aggregate(
      where: {
        transactionDatabaseId: { _eq: $transactionDatabaseId }
        _and: [$where]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_OCPPMESSAGES_FOR_TRANSACTION_LIST_QUERY = gql`
  query OCPPMessageList(
    $transactionDatabaseId: Int!
    $offset: Int!
    $limit: Int!
    $order_by: [OCPPMessages_order_by!]
    $where: OCPPMessages_bool_exp!
  ) {
    OCPPMessages(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: {
        _and: [
          {
            message: { _contains: [{ transactionId: $transactionDatabaseId }] }
          }
          {
            _or: [
              {
                _and: [
                  { protocol: { _eq: "ocpp1.6" } }
                  {
                    action: {
                      _in: [
                        "StartTransaction"
                        "StopTransaction"
                        "MeterValues"
                        "RemoteStopTransaction"
                      ]
                    }
                  }
                ]
              }
              {
                _and: [
                  { protocol: { _eq: "ocpp2.0.1" } }
                  { action: { _eq: "GetTransactionStatus" } }
                ]
              }
            ]
          }
          $where
        ]
      }
    ) {
      id
      action
      protocol
      message
      timestamp
    }

    OCPPMessages_aggregate(
      where: {
        _and: [
          {
            message: { _contains: [{ transactionId: $transactionDatabaseId }] }
          }
          {
            _or: [
              {
                _and: [
                  { protocol: { _eq: "ocpp1.6" } }
                  {
                    action: {
                      _in: [
                        "StartTransaction"
                        "StopTransaction"
                        "MeterValues"
                        "RemoteStopTransaction"
                      ]
                    }
                  }
                ]
              }
              {
                _and: [
                  { protocol: { _eq: "ocpp2.0.1" } }
                  { action: { _eq: "GetTransactionStatus" } }
                ]
              }
            ]
          }
          $where
        ]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;
