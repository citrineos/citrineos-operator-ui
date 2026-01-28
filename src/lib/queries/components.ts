// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const COMPONENT_LIST_QUERY = gql`
  query ComponentList(
    $offset: Int!
    $limit: Int!
    $order_by: [Components_order_by!]
    $where: Components_bool_exp
  ) {
    Components(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
    ) {
      id
      instance
      name
      evseDatabaseId
      createdAt
      updatedAt
      EvseType {
        connectorId
        id
      }
    }
    Components_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const COMPONENT_GET_QUERY = gql`
  query GetComponentById($id: Int!) {
    Components_by_pk(id: $id) {
      id
      instance
      name
      evseDatabaseId
      createdAt
      updatedAt
    }
  }
`;
