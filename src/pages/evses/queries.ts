// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const EVSE_LIST_QUERY = gql`
  query EvseList(
    $offset: Int!
    $limit: Int!
    $order_by: [Evses_order_by!]
    $where: Evses_bool_exp
    $variableAttributesWhere: VariableAttributes_bool_exp
    $variableAttributesOrder_by: [VariableAttributes_order_by!]
  ) {
    Evses(offset: $offset, limit: $limit, order_by: $order_by, where: $where) {
      databaseId
      id
      connectorId
      createdAt
      updatedAt

      # Join the VariableAttributes for each EVSE
      VariableAttributes(
        where: $variableAttributesWhere
        order_by: $variableAttributesOrder_by
      ) {
        id
        stationId
        type
        dataType
        value
        mutability
        persistent
        constant
        variableId
        componentId
        evseDatabaseId
        createdAt
        updatedAt
      }
    }

    # Aggregating EVSE records
    Evses_aggregate(where: $where) {
      aggregate {
        count
      }
    }

    # Aggregating VariableAttributes
    VariableAttributes_aggregate(where: $variableAttributesWhere) {
      aggregate {
        count
      }
    }
  }
`;

export const EVSE_GET_QUERY = gql`
  query GetEvseById($id: Int!) {
    Evses_by_pk(databaseId: $id) {
      databaseId
      id
      connectorId
      createdAt
      updatedAt

      # Join the VariableAttributes for this EVSE
      VariableAttributes {
        id
        stationId
        type
        dataType
        value
        mutability
        persistent
        constant
        variableId
        componentId
        evseDatabaseId
        createdAt
        updatedAt
      }
    }
  }
`;

export const EVSE_CREATE_MUTATION = gql`
  mutation EvseCreate($object: Evses_insert_input!) {
    insert_Evses_one(object: $object) {
      databaseId
      id
      connectorId
      createdAt
      updatedAt
    }
  }
`;

export const EVSE_EDIT_MUTATION = gql`
  mutation EvseEdit($id: Int!, $object: Evses_set_input!) {
    update_Evses_by_pk(pk_columns: { databaseId: $id }, _set: $object) {
      databaseId
      id
      connectorId
      createdAt
      updatedAt
    }
  }
`;

export const EVSE_EDIT_WITH_VARIABLE_ATTRIBUTES_MUTATION = gql`
  mutation EvseEditWithVariableAttributes(
    $id: Int!
    $object: Evses_set_input!
    $newAssociatedIds: [Int!]!
  ) {
    # Update the EVSE record
    update_Evses_by_pk(pk_columns: { databaseId: $id }, _set: $object) {
      databaseId
      id
      connectorId
      createdAt
      updatedAt
    }

    # Update VariableAttributes to associate them with the EVSE
    update_VariableAttributes: update_VariableAttributes(
      where: { id: { _in: $newAssociatedIds } }
      _set: { evseDatabaseId: $id }
    ) {
      affected_rows
    }

    # Update VariableAttributes to dissociate old ones from this EVSE
    removeOldVariableAttributes: update_VariableAttributes(
      where: { evseDatabaseId: { _eq: $id }, id: { _nin: $newAssociatedIds } }
      _set: { evseDatabaseId: null }
    ) {
      affected_rows
    }
  }
`;

export const EVSE_DELETE_MUTATION = gql`
  mutation EvseDelete($id: Int!) {
    delete_Evses_by_pk(databaseId: $id) {
      databaseId
      id
      connectorId
      createdAt
      updatedAt
    }
  }
`;
