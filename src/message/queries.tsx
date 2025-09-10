// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const GET_EVSE_LIST_FOR_STATION = gql`
  query GetPaginatedEvseListForStation(
    $stationId: String!
    $where: Evses_bool_exp = {}
    $order_by: [Evses_order_by!] = {}
    $offset: Int
    $limit: Int
  ) {
    Evses(
      where: { stationId: { _eq: $stationId }, _and: [$where] }
      order_by: $order_by
      offset: $offset
      limit: $limit
    ) {
      id
      stationId
      evseTypeId
      evseId
      physicalReference
      removed
      createdAt
      updatedAt
      connectors: Connectors {
        id
        connectorId
        status
        type
        format
        powerType
        maximumAmperage
        maximumVoltage
        maximumPowerWatts
        termsAndConditionsUrl
        createdAt
        updatedAt
      }
    }
    Evses_aggregate(where: { stationId: { _eq: $stationId }, _and: [$where] }) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_EVSES_FOR_STATION = gql`
  query GetEvseListForStation($stationId: String!) {
    Evses(where: { stationId: { _eq: $stationId } }) {
      id
      stationId
      evseTypeId
      evseId
      physicalReference
      removed
      createdAt
      updatedAt
      connectors: Connectors {
        id
        connectorId
        status
        type
        format
        powerType
        maximumAmperage
        maximumVoltage
        maximumPowerWatts
        termsAndConditionsUrl
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_CONNECTOR_LIST_FOR_STATION_EVSE = gql`
  query GetConnectorListForStationEvse(
    $stationId: String!
    $where: Connectors_bool_exp = {}
    $order_by: [Connectors_order_by!] = {}
    $offset: Int
    $limit: Int
  ) {
    Connectors(
      where: { stationId: { _eq: $stationId }, _and: [$where] }
      order_by: $order_by
      offset: $offset
      limit: $limit
    ) {
      id
      stationId
      evseId
      connectorId
      evseTypeConnectorId
      status
      type
      format
      powerType
      maximumAmperage
      maximumVoltage
      maximumPowerWatts
      termsAndConditionsUrl
      createdAt
      updatedAt
    }
    Connectors_aggregate(
      where: { stationId: { _eq: $stationId }, _and: [$where] }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const CONNECTOR_LIST_FOR_STATION_QUERY = gql`
  query GetPaginatedConnectorListForStation(
    $stationId: String!
    $offset: Int!
    $limit: Int!
    $order_by: [Connectors_order_by!]
    $where: Connectors_bool_exp = {}
  ) {
    Connectors(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: { stationId: { _eq: $stationId } }
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

export const CONNECTORS_FOR_STATION_QUERY = gql`
  query GetConnectorListForStation($stationId: String!) {
    Connectors(where: { stationId: { _eq: $stationId } }) {
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

export const GET_METER_VALUES_FOR_STATION = gql`
  query GetMeterValuesForStation(
    $transactionDatabaseIds: [Int!]!
    $where: MeterValues_bool_exp! = {}
    $order_by: [MeterValues_order_by!] = { timestamp: asc }
    $offset: Int
    $limit: Int
  ) {
    MeterValues(
      where: {
        _and: [
          { transactionDatabaseId: { _in: $transactionDatabaseIds } }
          $where
        ]
      }
      order_by: $order_by
      offset: $offset
      limit: $limit
    ) {
      id
      transactionDatabaseId
      sampledValue
      timestamp
    }
    MeterValues_aggregate(
      where: {
        _and: [
          { transactionDatabaseId: { _in: $transactionDatabaseIds } }
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

export const GET_TRANSACTION_LIST_FOR_STATION = gql`
  query GetTransactionListForStation(
    $stationId: String!
    $where: [Transactions_bool_exp!] = []
    $order_by: [Transactions_order_by!] = {}
    $offset: Int
    $limit: Int
  ) {
    Transactions(
      where: { stationId: { _eq: $stationId }, _and: $where }
      order_by: $order_by
      offset: $offset
      limit: $limit
    ) {
      id
      timeSpentCharging
      isActive
      chargingState
      stationId
      stoppedReason
      transactionId
      evseId
      remoteStartId
      totalKwh
      createdAt
      updatedAt
      TransactionEvents(where: { eventType: { _eq: "Started" } }) {
        eventType
        idTokenValue
        idTokenType
      }
      StartTransaction {
        idTokenDatabaseId
      }
      ChargingStation {
        id
        isOnline
        locationId
        createdAt
        updatedAt
        Location {
          id
          name
          address
          city
          postalCode
          state
          country
          coordinates
          createdAt
          updatedAt
        }
      }
    }
    Transactions_aggregate(
      where: { stationId: { _eq: $stationId }, _and: $where }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_TRANSACTIONS_FOR_STATION = gql`
  query GetTransactionsForStation($stationId: String!) {
    Transactions(where: { stationId: { _eq: $stationId } }) {
      id
      timeSpentCharging
      isActive
      chargingState
      stationId
      stoppedReason
      transactionId
      evseId
      remoteStartId
      totalKwh
      createdAt
      updatedAt
    }
  }
`;

export const GET_ACTIVE_TRANSACTION_LIST_FOR_STATION = gql`
  query GetActiveTransactionListForStation(
    $stationId: String!
    $where: [Transactions_bool_exp!] = []
    $order_by: [Transactions_order_by!] = {}
    $offset: Int
    $limit: Int
  ) {
    Transactions(
      where: {
        stationId: { _eq: $stationId }
        isActive: { _eq: true }
        _and: $where
      }
      order_by: $order_by
      offset: $offset
      limit: $limit
    ) {
      id
      timeSpentCharging
      isActive
      chargingState
      stationId
      stoppedReason
      transactionId
      evseId
      remoteStartId
      totalKwh
      createdAt
      updatedAt
    }
    Transactions_aggregate(
      where: {
        stationId: { _eq: $stationId }
        isActive: { _eq: true }
        _and: $where
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_ACTIVE_TRANSACTIONS_FOR_STATION = gql`
  query GetActiveTransactionsForStation($stationId: String!) {
    Transactions(
      where: { stationId: { _eq: $stationId }, isActive: { _eq: true } }
    ) {
      id
      timeSpentCharging
      isActive
      chargingState
      stationId
      stoppedReason
      transactionId
      evseId
      remoteStartId
      totalKwh
      createdAt
      updatedAt
    }
  }
`;

export const GET_CHARGING_STATIONS_FOR_EVSE = gql`
  query GetChargingStationsForEvse($databaseId: Int!) {
    ChargingStations(
      where: { VariableAttributes: { evseDatabaseId: { _eq: $databaseId } } }
      distinct_on: id # Ensure unique charging stations by their ID
    ) {
      id
      isOnline
      locationId
      createdAt
      updatedAt
    }
  }
`;
