// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const VARIABLE_LIST_QUERY = gql`
  query VariableList(
    $offset: Int!
    $limit: Int!
    $order_by: [Variables_order_by!]
    $where: Variables_bool_exp
  ) {
    Variables(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
    ) {
      id
      instance
      name
      createdAt
      updatedAt
    }
    Variables_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const VARIABLE_LIST_BY_COMPONENT_QUERY = gql`
  query VariableListByComponent(
    $componentId: Int!
    $offset: Int!
    $limit: Int!
    $mutability: String!
    $order_by: [Variables_order_by!]
    $where: Variables_bool_exp = {}
  ) {
    Variables(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: {
        _and: [
          { ComponentVariables: { componentId: { _eq: $componentId } } }
          $where
        ]
        VariableAttributes: { mutability: { _neq: $mutability } }
      }
    ) {
      id
      instance
      name
      createdAt
      updatedAt
    }
    Variables_aggregate(
      where: {
        _and: [
          { ComponentVariables: { componentId: { _eq: $componentId } } }
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

export const VARIABLE_GET_QUERY = gql`
  query GetVariableById($id: Int!) {
    Variables_by_pk(id: $id) {
      id
      instance
      name
      createdAt
      updatedAt
    }
  }
`;

export const VARIABLE_CREATE_MUTATION = gql`
  mutation VariableCreate($object: Variables_insert_input!) {
    insert_Variables_one(object: $object) {
      id
      instance
      name
      createdAt
      updatedAt
    }
  }
`;

export const VARIABLE_EDIT_MUTATION = gql`
  mutation VariableEdit($id: Int!, $object: Variables_set_input!) {
    update_Variables_by_pk(pk_columns: { id: $id }, _set: $object) {
      id
      instance
      name
      createdAt
      updatedAt
    }
  }
`;

export const VARIABLE_DELETE_MUTATION = gql`
  mutation VariableDelete($id: Int!) {
    delete_Variables_by_pk(id: $id) {
      id
      instance
      name
      createdAt
      updatedAt
    }
  }
`;
