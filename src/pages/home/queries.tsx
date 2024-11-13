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

export const GET_CHARGING_STATIONS_WITH_LATEST_STATUS_NOTIFICATIONS_AND_TRANSACTIONS = gql`
  query GetChargingStationsWithLatestStatusNotificationsAndTransactions {
    ChargingStations {
      id
      isOnline
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
      Evses: VariableAttributes(
        distinct_on: evseDatabaseId
        where: { Evse: { databaseId: { _is_null: false } } }
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
