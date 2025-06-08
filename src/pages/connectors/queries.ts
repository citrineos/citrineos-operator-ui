// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const CONNECTOR_LIST_QUERY = gql`
  query ConnectorList(
    $offset: Int!
    $limit: Int!
    $order_by: [Connectors_order_by!]
    $where: Connectors_bool_exp
  ) {
    Connectors(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
    ) {
      connectorId
      createdAt
      errorCode
      id
      info
      stationId
      status
      timestamp
      updatedAt
      vendorErrorCode
      vendorId
    }
    Connectors_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const CONNECTOR_GET_QUERY = gql`
  query GetConnectorById($id: Int!) {
    Connectors_by_pk(connectorId: $id) {
      connectorId
      createdAt
      errorCode
      id
      info
      stationId
      status
      timestamp
      updatedAt
      vendorErrorCode
      vendorId
    }
  }
`;

export const CONNECTOR_CREATE_MUTATION = gql`
  mutation ConnectorCreate($object: Connectors_insert_input!) {
    insert_Connectors_one(object: $object) {
      connectorId
      createdAt
      errorCode
      id
      info
      stationId
      status
      timestamp
      updatedAt
      vendorErrorCode
      vendorId
    }
  }
`;

export const CONNECTOR_EDIT_MUTATION = gql`
  mutation ConnectorEdit($id: Int!, $object: Connectors_insert_input!) {
    update_Connectors_by_pk(pk_columns: { connectorId: $id }, _set: $object) {
      connectorId
      createdAt
      errorCode
      id
      info
      status
      vendorErrorCode
      vendorId
    }
  }
`;

export const CONNECTOR_DELETE_MUTATION = gql`
  mutation ConnectorDelete($id: Int!) {
    delete_Connectors_by_pk(connectorId: $id) {
      connectorId
      createdAt
      errorCode
      id
      info
      stationId
      status
      timestamp
      updatedAt
      vendorErrorCode
      vendorId
    }
  }
`;
