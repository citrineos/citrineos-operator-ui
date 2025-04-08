import { gql } from 'graphql-tag';

export const GET_EVSE_LIST_FOR_STATION = gql`
  query GetEvseListForStation(
    $stationId: String!
    $where: Evses_bool_exp = {}
    $order_by: [Evses_order_by!] = {}
    $offset: Int
    $limit: Int
  ) {
    Evses(
      where: {
        VariableAttributes: {
          stationId: { _eq: $stationId }
          evseDatabaseId: { _is_null: false }
          Evse: { connectorId: { _is_null: false } }
        }
        _and: [$where]
      }
      order_by: $order_by
      offset: $offset
      limit: $limit
    ) {
      databaseId
      id
      connectorId
      createdAt
      updatedAt
    }
    Evses_aggregate(
      where: {
        VariableAttributes: { stationId: { _eq: $stationId } }
        _and: [$where]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_EVSES_FOR_STATION = gql`
  query GetEvseListForStation($stationId: String!) {
    Evses(where: { VariableAttributes: { stationId: { _eq: $stationId } } }) {
      databaseId
      id
      connectorId
      createdAt
      updatedAt
    }
  }
`;

export const CONNECTOR_LIST_FOR_STATION_QUERY = gql`
  query ConnectorList(
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
      evseDatabaseId
      remoteStartId
      totalKwh
      createdAt
      updatedAt
      TransactionEvents(where: { eventType: { _eq: "Started" } }) {
        eventType
        IdToken {
          idToken
        }
      }
      ChargingStation {
        id
        isOnline
        locationId
        createdAt
        updatedAt
        Location {
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
      evseDatabaseId
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
      evseDatabaseId
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
      evseDatabaseId
      remoteStartId
      totalKwh
      createdAt
      updatedAt
    }
  }
`;

export const GET_CHARGING_STATION_LIST_FOR_EVSE = gql`
  query GetChargingStationListForEvse(
    $databaseId: Int!
    $where: VariableAttributes_bool_exp = {}
    $order_by: [VariableAttributes_order_by!] = {}
    $offset: Int
    $limit: Int
  ) {
    # Step 1: Fetch station IDs from VariableAttributes
    VariableAttributes(
      where: { evseDatabaseId: { _eq: $databaseId }, _and: [$where] }
      order_by: $order_by
      offset: $offset
      limit: $limit
    ) {
      stationId
    }

    # Step 2: Fetch ChargingStations by the list of station IDs from VariableAttributes
    ChargingStations(
      where: { id: { _in: [stationId] } } # stationId list from the above query
    ) {
      id
      isOnline
      locationId
      createdAt
      updatedAt
    }

    # Step 3: Get the aggregate count for VariableAttributes
    VariableAttributes_aggregate(
      where: { evseDatabaseId: { _eq: $databaseId }, _and: [$where] }
    ) {
      aggregate {
        count
      }
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
