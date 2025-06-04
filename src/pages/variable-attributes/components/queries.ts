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
      Evse {
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

export const COMPONENT_CREATE_MUTATION = gql`
  mutation ComponentCreate($object: Components_insert_input!) {
    insert_Components_one(object: $object) {
      id
      instance
      name
      evseDatabaseId
      createdAt
      updatedAt
    }
  }
`;

export const COMPONENT_EDIT_MUTATION = gql`
  mutation ComponentEdit($id: Int!, $object: Components_set_input!) {
    update_Components_by_pk(pk_columns: { id: $id }, _set: $object) {
      id
      instance
      name
      evseDatabaseId
      createdAt
      updatedAt
    }
  }
`;

export const COMPONENT_DELETE_MUTATION = gql`
  mutation ComponentDelete($id: Int!) {
    delete_Components_by_pk(id: $id) {
      id
      instance
      name
      evseDatabaseId
      createdAt
      updatedAt
    }
  }
`;
