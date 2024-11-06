import { gql } from 'graphql-tag';

export const CHARGING_STATIONS_LIST_QUERY = gql`
  query ChargingStationsList(
    $offset: Int!
    $limit: Int!
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
      StatusNotifications {
        id
        stationId
        evseId
        connectorId
        timestamp
        connectorStatus
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      locationId: Location {
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
    ChargingStations_aggregate(where: $where) {
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
      locationId
      createdAt
      updatedAt
    }
  }
`;

export const CHARGING_STATIONS_CREATE_MUTATION = gql`
  mutation ChargingStationsCreate($object: ChargingStations_insert_input!) {
    insert_ChargingStations_one(object: $object) {
      isOnline
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
      locationId
      createdAt
      updatedAt
    }
  }
`;
