// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const METER_VALUE_LIST_QUERY = gql`
  query MeterValueList(
    $offset: Int!
    $limit: Int!
    $order_by: [MeterValues_order_by!]
    $where: MeterValues_bool_exp
  ) {
    MeterValues(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
    ) {
      id
      transactionDatabaseId
      transactionEventId
      sampledValue
      timestamp
      createdAt
      updatedAt
    }
    MeterValues_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const METER_VALUE_GET_QUERY = gql`
  query GetMeterValueById($id: Int!) {
    MeterValues_by_pk(id: $id) {
      id
      transactionDatabaseId
      transactionEventId
      sampledValue
      timestamp
      createdAt
      updatedAt
    }
  }
`;

export const METER_VALUE_CREATE_MUTATION = gql`
  mutation MeterValueCreate($object: MeterValues_insert_input!) {
    insert_MeterValues_one(object: $object) {
      id
      transactionDatabaseId
      transactionEventId
      sampledValue
      timestamp
      createdAt
      updatedAt
    }
  }
`;

export const METER_VALUE_EDIT_MUTATION = gql`
  mutation MeterValueEdit($id: Int!, $object: MeterValues_set_input!) {
    update_MeterValues_by_pk(pk_columns: { id: $id }, _set: $object) {
      id
      transactionDatabaseId
      transactionEventId
      sampledValue
      timestamp
      createdAt
      updatedAt
    }
  }
`;

export const METER_VALUE_DELETE_MUTATION = gql`
  mutation MeterValueDelete($id: Int!) {
    delete_MeterValues_by_pk(id: $id) {
      id
      transactionDatabaseId
      transactionEventId
      sampledValue
      timestamp
      createdAt
      updatedAt
    }
  }
`;

export const GET_METER_VALUES_FOR_TRANSACTION_EVENT = gql`
  query MeterValueList(
    $transactionEventId: Int!
    $offset: Int!
    $limit: Int!
    $order_by: [MeterValues_order_by!]
    $where: MeterValues_bool_exp! = []
  ) {
    MeterValues(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: {
        transactionEventId: { _eq: $transactionEventId }
        _and: [$where]
      }
    ) {
      id
      transactionDatabaseId
      transactionEventId
      sampledValue
      timestamp
      createdAt
      updatedAt
    }
    MeterValues_aggregate(
      where: {
        transactionEventId: { _eq: $transactionEventId }
        _and: [$where]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_METER_VALUES_FOR_TRANSACTION = gql`
  query MeterValueList(
    $transactionDatabaseId: Int!
    $offset: Int!
    $limit: Int!
    $order_by: [MeterValues_order_by!]
    $where: MeterValues_bool_exp! = []
  ) {
    MeterValues(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: { transactionDatabaseId: { _eq: $transactionDatabaseId } }
    ) {
      id
      transactionDatabaseId
      transactionEventId
      sampledValue
      timestamp
      createdAt
      updatedAt
    }
    MeterValues_aggregate(
      where: { transactionDatabaseId: { _eq: $transactionDatabaseId } }
    ) {
      aggregate {
        count
      }
    }
  }
`;
