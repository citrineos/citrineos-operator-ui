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
      id
      stationId
      evseId
      evseTypeConnectorId
      connectorId
      status
      type
      maximumPowerWatts
      maximumAmperage
      maximumVoltage
      format
      powerType
      termsAndConditionsUrl
      errorCode
      timestamp
      info
      vendorId
      vendorErrorCode
      createdAt
      updatedAt
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
    Connectors_by_pk(id: $id) {
      id
      stationId
      evseId
      evseTypeConnectorId
      connectorId
      status
      type
      maximumPowerWatts
      maximumAmperage
      maximumVoltage
      format
      powerType
      termsAndConditionsUrl
      errorCode
      timestamp
      info
      vendorId
      vendorErrorCode
      createdAt
      updatedAt
    }
  }
`;

export const CONNECTOR_CREATE_MUTATION = gql`
  mutation ConnectorCreate($object: Connectors_insert_input!) {
    insert_Connectors_one(object: $object) {
      id
      stationId
      evseId
      evseTypeConnectorId
      connectorId
      status
      type
      maximumPowerWatts
      maximumAmperage
      maximumVoltage
      format
      powerType
      termsAndConditionsUrl
      errorCode
      timestamp
      info
      vendorId
      vendorErrorCode
      createdAt
      updatedAt
    }
  }
`;

export const CONNECTOR_EDIT_MUTATION = gql`
  mutation ConnectorEdit($id: Int!, $object: Connectors_set_input!) {
    update_Connectors_by_pk(pk_columns: { id: $id }, _set: $object) {
      id
      stationId
      evseId
      evseTypeConnectorId
      connectorId
      status
      type
      maximumPowerWatts
      maximumAmperage
      maximumVoltage
      format
      powerType
      termsAndConditionsUrl
      errorCode
      timestamp
      info
      vendorId
      vendorErrorCode
      createdAt
      updatedAt
    }
  }
`;

export const CONNECTOR_DELETE_MUTATION = gql`
  mutation ConnectorDelete($id: Int!) {
    delete_Connectors_by_pk(id: $id) {
      id
      stationId
      evseId
      evseTypeConnectorId
      connectorId
      status
      type
      maximumPowerWatts
      maximumAmperage
      maximumVoltage
      format
      powerType
      termsAndConditionsUrl
      errorCode
      timestamp
      info
      vendorId
      vendorErrorCode
      createdAt
      updatedAt
    }
  }
`;
