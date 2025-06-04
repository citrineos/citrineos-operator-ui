// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const CHARGING_PROFILES_LIST_QUERY = gql`
  query ChargingProfilesList(
    $offset: Int!
    $limit: Int!
    $order_by: [ChargingProfiles_order_by!]
    $where: ChargingProfiles_bool_exp
  ) {
    ChargingProfiles(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
    ) {
      id
      databaseId
      stationId
      chargingProfileKind
      chargingProfilePurpose
      recurrencyKind
      stackLevel
      validFrom
      validTo
      evseId
      isActive
      chargingLimitSource
      transactionDatabaseId
      createdAt
      updatedAt
    }
    ChargingProfiles_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const CHARGING_PROFILES_GET_QUERY = gql`
  query GetChargingProfileById($id: Int!) {
    ChargingProfiles_by_pk(databaseId: $id) {
      id
      databaseId
      stationId
      chargingProfileKind
      chargingProfilePurpose
      recurrencyKind
      stackLevel
      validFrom
      validTo
      evseId
      isActive
      chargingLimitSource
      transactionDatabaseId
      createdAt
      updatedAt
    }
  }
`;

export const CHARGING_PROFILES_CREATE_MUTATION = gql`
  mutation ChargingProfilesCreate($object: ChargingProfiles_insert_input!) {
    insert_ChargingProfiles_one(object: $object) {
      databaseId
      stationId
      chargingProfileKind
      chargingProfilePurpose
      recurrencyKind
      stackLevel
      validFrom
      validTo
      evseId
      isActive
      chargingLimitSource
      transactionDatabaseId
      createdAt
      updatedAt
    }
  }
`;

export const CHARGING_PROFILES_DELETE_MUTATION = gql`
  mutation ChargingProfilesDelete($id: Int!) {
    delete_ChargingProfiles_by_pk(databaseId: $id) {
      id
      databaseId
      stationId
      chargingProfileKind
      chargingProfilePurpose
      recurrencyKind
      stackLevel
      validFrom
      validTo
      evseId
      isActive
      chargingLimitSource
      transactionDatabaseId
      createdAt
      updatedAt
    }
  }
`;

export const CHARGING_PROFILES_EDIT_MUTATION = gql`
  mutation ChargingProfilesEdit(
    $id: Int!
    $object: ChargingProfiles_set_input!
  ) {
    update_ChargingProfiles_by_pk(
      pk_columns: { databaseId: $id }
      _set: $object
    ) {
      id
      databaseId
      stationId
      chargingProfileKind
      chargingProfilePurpose
      recurrencyKind
      stackLevel
      validFrom
      validTo
      evseId
      isActive
      chargingLimitSource
      transactionDatabaseId
      createdAt
      updatedAt
    }
  }
`;
