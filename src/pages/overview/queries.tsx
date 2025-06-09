// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const GET_CHARGING_STATIONS_ONLINE_COUNTS = gql`
  query GetChargingStationCounts {
    total: ChargingStations_aggregate {
      aggregate {
        count
      }
    }
    online: ChargingStations_aggregate(where: { isOnline: { _eq: true } }) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_CHARGING_STATIONS_WITH_LOCATION_AND_LATEST_STATUS_NOTIFICATIONS_AND_TRANSACTIONS = gql`
  query GetChargingStationsWithLocationAndLatestStatusNotificationsAndTransactions {
    ChargingStations {
      id
      isOnline
      protocol
      locationId
      createdAt
      updatedAt
      LatestStatusNotifications {
        StatusNotification {
          id
          stationId
          evseId
          connectorId
          timestamp
          connectorStatus
          createdAt
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
    }
  }
`;
