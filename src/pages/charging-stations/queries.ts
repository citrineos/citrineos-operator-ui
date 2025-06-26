// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const CHARGING_STATIONS_LIST_QUERY = gql`
  query ChargingStationsList(
    $offset: Int
    $limit: Int
    $order_by: [ChargingStations_order_by!]
    $where: ChargingStations_bool_exp
  ) {
    ChargingStations(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
    ) {
      id
      isOnline
      protocol
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
      LatestStatusNotifications {
        id
        stationId
        statusNotificationId
        updatedAt
        createdAt
        StatusNotification {
          connectorId
          connectorStatus
          createdAt
          evseId
          stationId
          id
          timestamp
          updatedAt
        }
      }
      Transactions(where: { isActive: { _eq: true } }) {
        id
        timeSpentCharging
        isActive
        chargingState
        stationId
        stoppedReason
        transactionId
        evseDatabaseId
        remoteStartId
        totalKwh
        createdAt
        updatedAt
      }
      Connectors {
        connectorId
        status
        errorCode
        timestamp
        info
        vendorId
        vendorErrorCode
        createdAt
        updatedAt
      }
    }
    ChargingStations_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const FAULTED_CHARGING_STATIONS_LIST_QUERY = gql`
  query ChargingStationsList(
    $offset: Int!
    $limit: Int!
    $order_by: [ChargingStations_order_by!]
    $where: ChargingStations_bool_exp = {}
  ) {
    ChargingStations(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: {
        _and: [
          {
            LatestStatusNotifications: {
              StatusNotification: { connectorStatus: { _eq: "Faulted" } }
            }
          }
          $where
        ]
      }
    ) {
      id
      isOnline
      protocol
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
      LatestStatusNotifications {
        id
        stationId
        statusNotificationId
        updatedAt
        createdAt
        StatusNotification {
          connectorId
          connectorStatus
          createdAt
          evseId
          stationId
          id
          timestamp
          updatedAt
        }
      }
    }
    ChargingStations_aggregate(
      where: {
        _and: [
          {
            LatestStatusNotifications: {
              StatusNotification: { connectorStatus: { _eq: "Faulted" } }
            }
          }
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

export const CHARGING_STATIONS_GET_QUERY = gql`
  query GetChargingStationById($id: String!) {
    ChargingStations_by_pk(id: $id) {
      id
      isOnline
      protocol
      locationId
      chargePointVendor
      chargePointModel
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
      ConnectorTypes: VariableAttributes(
        where: { Variable: { name: { _eq: "ConnectorType" } } }
      ) {
        value
      }
      Evses: VariableAttributes(
        distinct_on: evseDatabaseId
        where: {
          evseDatabaseId: { _is_null: false }
          Evse: { connectorId: { _is_null: false } }
        }
      ) {
        Evse {
          databaseId
          id
          connectorId
          createdAt
          updatedAt
        }
      }
      LatestStatusNotifications {
        id
        stationId
        statusNotificationId
        updatedAt
        createdAt
        StatusNotification {
          connectorId
          connectorStatus
          createdAt
          evseId
          stationId
          id
          timestamp
          updatedAt
        }
      }
      Transactions(where: { isActive: { _eq: true } }) {
        id
        timeSpentCharging
        isActive
        chargingState
        stationId
        stoppedReason
        transactionId
        evseDatabaseId
        remoteStartId
        totalKwh
        createdAt
        updatedAt
      }
      Connectors {
        connectorId
        status
        errorCode
        timestamp
        info
        vendorId
        vendorErrorCode
        createdAt
        updatedAt
      }
    }
  }
`;

export const CHARGING_STATIONS_CREATE_MUTATION = gql`
  mutation ChargingStationsCreate($object: ChargingStations_insert_input!) {
    insert_ChargingStations_one(object: $object) {
      id
      isOnline
      protocol
      locationId
      createdAt
      updatedAt
    }
  }
`;

export const CHARGING_STATIONS_DELETE_MUTATION = gql`
  mutation ChargingStationsDelete($id: String!) {
    delete_ChargingStations_by_pk(id: $id) {
      id
      isOnline
      protocol
      locationId
      createdAt
      updatedAt
    }
  }
`;

export const CHARGING_STATIONS_EDIT_MUTATION = gql`
  mutation ChargingStationsEdit(
    $id: String!
    $object: ChargingStations_set_input!
  ) {
    update_ChargingStations_by_pk(pk_columns: { id: $id }, _set: $object) {
      id
      isOnline
      protocol
      locationId
      createdAt
      updatedAt
    }
  }
`;

export const GET_OCPP_MESSAGES = gql`
  query GetOCPPMessages($id: String!) {
    OCPPMessages(id: $id) {
      id
      stationId
      correlationId
      origin
      protocol
      action
      message
      timestamp
      createdAt
      updatedAt
    }
  }
`;

export const GET_OCPP_MESSAGES_FOR_STATION = gql`
  query GetOCPPMessagesForStation($stationId: String!) {
    OCPPMessages(where: { stationId: { _eq: $stationId } }) {
      id
      stationId
      correlationId
      origin
      protocol
      action
      message
      timestamp
      createdAt
      updatedAt
    }
  }
`;

export const GET_OCPP_MESSAGES_LIST = gql`
  query GetOCPPMessagesList(
    $offset: Int!
    $limit: Int!
    $order_by: [OCPPMessages_order_by!]
    $where: OCPPMessages_bool_exp
  ) {
    OCPPMessages(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
    ) {
      id
      stationId
      correlationId
      origin
      protocol
      action
      message
      timestamp
      createdAt
      updatedAt
    }
    OCPPMessages_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_OCPP_MESSAGES_LIST_FOR_STATION = gql`
  query GetOCPPMessagesListForStation(
    $stationId: String!
    $where: [OCPPMessages_bool_exp!] = []
    $order_by: [OCPPMessages_order_by!] = {}
    $offset: Int
    $limit: Int
  ) {
    OCPPMessages(
      where: { stationId: { _eq: $stationId }, _and: $where }
      order_by: $order_by
      offset: $offset
      limit: $limit
    ) {
      id
      stationId
      correlationId
      origin
      protocol
      action
      message
      timestamp
      createdAt
      updatedAt
    }
    OCPPMessages_aggregate(
      where: { stationId: { _eq: $stationId }, _and: $where }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const CHARGING_STATIONS_STATUS_COUNT_QUERY = gql`
  query ChargingStationsCount {
    online: ChargingStations_aggregate(where: { isOnline: { _eq: true } }) {
      aggregate {
        count
      }
    }
    offline: ChargingStations_aggregate(
      where: {
        _or: [{ isOnline: { _eq: false } }, { isOnline: { _is_null: true } }]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;
