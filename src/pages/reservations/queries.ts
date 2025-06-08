// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const RESERVATIONS_LIST_QUERY = gql`
  query ReservationsList(
    $offset: Int!
    $limit: Int!
    $order_by: [Reservations_order_by!]
    $where: Reservations_bool_exp
  ) {
    Reservations(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
    ) {
      databaseId
      id
      stationId
      expiryDateTime
      connectorType
      reserveStatus
      isActive
      terminatedByTransaction
      idToken
      groupIdToken
      evseId
      createdAt
      updatedAt
    }
    Reservations_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const RESERVATIONS_GET_QUERY = gql`
  query GetReservationById($id: Int!) {
    Reservations_by_pk(databaseId: $id) {
      databaseId
      id
      stationId
      expiryDateTime
      connectorType
      reserveStatus
      isActive
      terminatedByTransaction
      idToken
      groupIdToken
      evseId
      createdAt
      updatedAt
    }
  }
`;

export const RESERVATIONS_CREATE_MUTATION = gql`
  mutation ReservationsCreate($object: Reservations_insert_input!) {
    insert_Reservations_one(object: $object) {
      databaseId
      id
      stationId
      expiryDateTime
      connectorType
      reserveStatus
      isActive
      terminatedByTransaction
      idToken
      groupIdToken
      evseId
      createdAt
      updatedAt
    }
  }
`;

export const RESERVATIONS_DELETE_MUTATION = gql`
  mutation ReservationsDelete($id: Int!) {
    delete_Reservations_by_pk(databaseId: $id) {
      databaseId
      id
      stationId
      expiryDateTime
      connectorType
      reserveStatus
      isActive
      terminatedByTransaction
      idToken
      groupIdToken
      evseId
      createdAt
      updatedAt
    }
  }
`;

export const RESERVATIONS_EDIT_MUTATION = gql`
  mutation ReservationsEdit($id: Int!, $object: Reservations_set_input!) {
    update_Reservations_by_pk(pk_columns: { databaseId: $id }, _set: $object) {
      databaseId
      id
      stationId
      expiryDateTime
      connectorType
      reserveStatus
      isActive
      terminatedByTransaction
      idToken
      groupIdToken
      evseId
      createdAt
      updatedAt
    }
  }
`;
