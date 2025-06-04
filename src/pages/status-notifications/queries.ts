// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const STATUS_NOTIFICATIONS_LIST_QUERY = gql`
  query StatusNotificationsList(
    $offset: Int!
    $limit: Int!
    $order_by: [StatusNotifications_order_by!]
    $where: StatusNotifications_bool_exp
  ) {
    StatusNotifications(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
    ) {
      id
      stationId
      evseId
      connectorId
      timestamp
      connectorStatus
      createdAt
      updatedAt
    }
    StatusNotifications_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const STATUS_NOTIFICATIONS_LIST_FOR_STATION_QUERY = gql`
  query StatusNotificationsList(
    $stationId: String!
    $order_by: [StatusNotifications_order_by!] = {}
    $where: [StatusNotifications_bool_exp!] = []
    $offset: Int!
    $limit: Int!
  ) {
    StatusNotifications(
      where: { stationId: { _eq: $stationId }, _and: $where }
      offset: $offset
      limit: $limit
      order_by: $order_by
    ) {
      id
      stationId
      evseId
      connectorId
      timestamp
      connectorStatus
      createdAt
      updatedAt
    }
    StatusNotifications_aggregate(
      where: { stationId: { _eq: $stationId }, _and: $where }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const STATUS_NOTIFICATIONS_GET_QUERY = gql`
  query GetStatusNotificationById($id: Int!) {
    StatusNotifications_by_pk(id: $id) {
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
`;

export const STATUS_NOTIFICATIONS_CREATE_MUTATION = gql`
  mutation StatusNotificationsCreate(
    $object: StatusNotifications_insert_input!
  ) {
    insert_StatusNotifications_one(object: $object) {
      stationId
      evseId
      connectorId
      timestamp
      connectorStatus
      createdAt
      updatedAt
    }
  }
`;

export const STATUS_NOTIFICATIONS_DELETE_MUTATION = gql`
  mutation StatusNotificationsDelete($id: Int!) {
    delete_StatusNotifications_by_pk(id: $id) {
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
`;

export const STATUS_NOTIFICATIONS_EDIT_MUTATION = gql`
  mutation StatusNotificationsEdit(
    $id: Int!
    $object: StatusNotifications_set_input!
  ) {
    update_StatusNotifications_by_pk(pk_columns: { id: $id }, _set: $object) {
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
`;
