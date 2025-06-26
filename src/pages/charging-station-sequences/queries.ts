// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const CHARGING_STATION_SEQUENCES_GET_QUERY = gql`
  query ChargingStationSequencesGet($stationId: String!, $type: String!) {
    ChargingStationSequences(
      where: { stationId: { _eq: $stationId }, type: { _eq: $type } }
    ) {
      value
    }
  }
`;

export const CHARGING_STATION_SEQUENCES_CREATE_MUTATION = gql`
  mutation ChargingStationSequencesCreate(
    $object: ChargingStationSequences_insert_input!
  ) {
    insert_ChargingStationSequences_one(object: $object) {
      value
    }
  }
`;

export const CHARGING_STATION_SEQUENCES_DELETE_MUTATION = gql`
  mutation ChargingStationSequencesDelete($stationId: String!, $type: String!) {
    delete_ChargingStationSequences_by_pk(stationId: $stationId, type: $type) {
      value
    }
  }
`;

export const CHARGING_STATION_SEQUENCES_EDIT_MUTATION = gql`
  mutation ChargingStationSequencesEdit(
    $stationId: String!
    $type: String!
    $object: ChargingStationSequences_set_input!
  ) {
    update_ChargingStationSequences_by_pk(
      pk_columns: { stationId: $stationId, type: $type }
      _set: $object
    ) {
      value
    }
  }
`;

export const CHARGING_STATION_SEQUENCES_LIST_QUERY = gql`
  query ChargingStationSequencesList(
    $offset: Int!
    $limit: Int!
    $order_by: [ChargingStationSequences_order_by!]
    $where: ChargingStationSequences_bool_exp
  ) {
    ChargingStationSequences(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
    ) {
      value
    }
    ChargingStationSequences_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;
