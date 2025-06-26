// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const SUBSCRIPTIONS_LIST_QUERY = gql`
  query SubscriptionsList(
    $offset: Int!
    $limit: Int!
    $order_by: [Subscriptions_order_by!]
    $where: Subscriptions_bool_exp
  ) {
    Subscriptions(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
    ) {
      id
      stationId
      onConnect
      onClose
      onMessage
      sentMessage
      messageRegexFilter
      url
      createdAt
      updatedAt
    }
    Subscriptions_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const SUBSCRIPTIONS_CREATE_MUTATION = gql`
  mutation SubscriptionsCreate($object: Subscriptions_insert_input!) {
    insert_Subscriptions_one(object: $object) {
      id
      stationId
      onConnect
      onClose
      onMessage
      sentMessage
      messageRegexFilter
      url
      createdAt
      updatedAt
    }
  }
`;

export const SUBSCRIPTIONS_EDIT_MUTATION = gql`
  mutation SubscriptionsEdit($id: Int!, $object: Subscriptions_set_input!) {
    update_Subscriptions_by_pk(pk_columns: { id: $id }, _set: $object) {
      id
      stationId
      onConnect
      onClose
      onMessage
      sentMessage
      messageRegexFilter
      url
      createdAt
      updatedAt
    }
  }
`;

export const SUBSCRIPTIONS_DELETE_MUTATION = gql`
  mutation SubscriptionsDelete($id: Int!) {
    delete_Subscriptions_by_pk(id: $id) {
      id
      stationId
      onConnect
      onClose
      onMessage
      sentMessage
      messageRegexFilter
      url
      createdAt
      updatedAt
    }
  }
`;

export const SUBSCRIPTIONS_GET_QUERY = gql`
  query GetSubscriptionById($id: Int!) {
    Subscriptions_by_pk(id: $id) {
      id
      stationId
      onConnect
      onClose
      onMessage
      sentMessage
      messageRegexFilter
      url
      createdAt
      updatedAt
    }
  }
`;
