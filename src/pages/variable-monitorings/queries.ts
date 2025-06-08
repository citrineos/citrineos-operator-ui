// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const VARIABLE_MONITORINGS_LIST_QUERY = gql`
  query VariableMonitoringsList(
    $offset: Int!
    $limit: Int!
    $order_by: [VariableMonitorings_order_by!]
    $where: VariableMonitorings_bool_exp
  ) {
    VariableMonitorings(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
    ) {
      databaseId
      id
      stationId
      transaction
      value
      type
      severity
      variableId
      componentId
      createdAt
      updatedAt
    }
    VariableMonitorings_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const VARIABLE_MONITORINGS_GET_QUERY = gql`
  query GetVariableMonitoringById($id: Int!) {
    VariableMonitorings_by_pk(databaseId: $id) {
      databaseId
      id
      stationId
      transaction
      value
      type
      severity
      variableId
      componentId
      createdAt
      updatedAt
    }
  }
`;

export const VARIABLE_MONITORINGS_CREATE_MUTATION = gql`
  mutation VariableMonitoringsCreate(
    $object: VariableMonitorings_insert_input!
  ) {
    insert_VariableMonitorings_one(object: $object) {
      databaseId
      id
      stationId
      transaction
      value
      type
      severity
      variableId
      componentId
      createdAt
      updatedAt
    }
  }
`;

export const VARIABLE_MONITORINGS_DELETE_MUTATION = gql`
  mutation VariableMonitoringsDelete($id: Int!) {
    delete_VariableMonitorings_by_pk(databaseId: $id) {
      databaseId
      id
      stationId
      transaction
      value
      type
      severity
      variableId
      componentId
      createdAt
      updatedAt
    }
  }
`;

export const VARIABLE_MONITORINGS_EDIT_MUTATION = gql`
  mutation VariableMonitoringsEdit(
    $id: Int!
    $object: VariableMonitorings_set_input!
  ) {
    update_VariableMonitorings_by_pk(
      pk_columns: { databaseId: $id }
      _set: $object
    ) {
      databaseId
      id
      stationId
      transaction
      value
      type
      severity
      variableId
      componentId
      createdAt
      updatedAt
    }
  }
`;
