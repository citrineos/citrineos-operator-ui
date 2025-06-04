// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const MESSAGE_INFOS_LIST_QUERY = gql`
  query MessageInfosList(
    $offset: Int!
    $limit: Int!
    $order_by: [MessageInfos_order_by!]
    $where: MessageInfos_bool_exp
  ) {
    MessageInfos(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
    ) {
      databaseId
      id
      stationId
      priority
      state
      startDateTime
      endDateTime
      transactionId
      message
      active
      displayComponentId
      createdAt
      updatedAt
    }
    MessageInfos_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const MESSAGE_INFOS_GET_QUERY = gql`
  query GetMessageInfoById($id: Int!) {
    MessageInfos_by_pk(databaseId: $id) {
      databaseId
      id
      stationId
      priority
      state
      startDateTime
      endDateTime
      transactionId
      message
      active
      displayComponentId
      createdAt
      updatedAt
    }
  }
`;

export const MESSAGE_INFOS_CREATE_MUTATION = gql`
  mutation MessageInfosCreate($object: MessageInfos_insert_input!) {
    insert_MessageInfos_one(object: $object) {
      id
      stationId
      priority
      state
      startDateTime
      endDateTime
      transactionId
      message
      active
      displayComponentId
      createdAt
      updatedAt
    }
  }
`;

export const MESSAGE_INFOS_DELETE_MUTATION = gql`
  mutation MessageInfosDelete($id: Int!) {
    delete_MessageInfos_by_pk(databaseId: $id) {
      databaseId
      id
      stationId
      priority
      state
      startDateTime
      endDateTime
      transactionId
      message
      active
      displayComponentId
      createdAt
      updatedAt
    }
  }
`;

export const MESSAGE_INFOS_EDIT_MUTATION = gql`
  mutation MessageInfosEdit($id: Int!, $object: MessageInfos_set_input!) {
    update_MessageInfos_by_pk(pk_columns: { databaseId: $id }, _set: $object) {
      databaseId
      id
      stationId
      priority
      state
      startDateTime
      endDateTime
      transactionId
      message
      active
      displayComponentId
      createdAt
      updatedAt
    }
  }
`;
