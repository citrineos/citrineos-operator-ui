// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const EVSE_LIST_QUERY = gql`
  query EvseList(
    $offset: Int!
    $limit: Int!
    $order_by: [Evses_order_by!]
    $where: Evses_bool_exp
    $variableAttributesWhere: VariableAttributes_bool_exp
    $variableAttributesOrder_by: [VariableAttributes_order_by!]
  ) {
    Evses(offset: $offset, limit: $limit, order_by: $order_by, where: $where) {
      id
      evseTypeId
      evseId
      createdAt
      updatedAt
    }

    # Aggregating EVSE records
    Evses_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

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

export const EVSE_CREATE_MUTATION = gql`
  mutation EvseCreate($object: Evses_insert_input!) {
    insert_Evses_one(object: $object) {
      id
      evseTypeId
      evseId
      createdAt
      updatedAt
    }
  }
`;

export const EVSE_EDIT_MUTATION = gql`
  mutation EvseEdit($id: Int!, $object: Evses_set_input!) {
    update_Evses_by_pk(pk_columns: { id: $id }, _set: $object) {
      id
      evseTypeId
      evseId
      createdAt
      updatedAt
    }
  }
`;
