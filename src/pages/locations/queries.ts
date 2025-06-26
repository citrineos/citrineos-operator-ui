// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const LOCATIONS_LIST_QUERY = gql`
  query LocationsList(
    $offset: Int!
    $limit: Int!
    $order_by: [Locations_order_by!]
    $where: Locations_bool_exp
  ) {
    Locations(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
    ) {
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
      ChargingStations {
        id
        isOnline
        protocol
        createdAt
        updatedAt
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
    Locations_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const LOCATIONS_GET_QUERY = gql`
  query GetLocationById($id: Int!) {
    Locations_by_pk(id: $id) {
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
      ChargingStations {
        id
        isOnline
        protocol
        createdAt
        updatedAt
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
      }
    }
  }
`;

export const LOCATIONS_GET_QUERY_BY_ID = gql`
  query GetLocationById($id: Int!, $where: Locations_bool_exp) {
    Locations_by_pk(id: $id) {
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
      ChargingStations {
        id
        isOnline
        protocol
        createdAt
        updatedAt
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
      }
    }
    Locations(where: $where) {
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
    Locations_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const LOCATIONS_CREATE_MUTATION = gql`
  mutation LocationsCreate($object: Locations_insert_input!) {
    insert_Locations_one(object: $object) {
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
`;

export const LOCATIONS_DELETE_MUTATION = gql`
  mutation LocationsDelete($id: Int!) {
    delete_Locations_by_pk(id: $id) {
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
`;

export const LOCATIONS_EDIT_MUTATION = gql`
  mutation LocationsEdit($id: Int!, $object: Locations_set_input!) {
    update_Locations_by_pk(pk_columns: { id: $id }, _set: $object) {
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
`;
