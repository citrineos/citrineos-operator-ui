// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const SECURITY_EVENTS_LIST_QUERY = gql`
  query SecurityEventsList(
    $offset: Int!
    $limit: Int!
    $order_by: [SecurityEvents_order_by!]
    $where: SecurityEvents_bool_exp
  ) {
    SecurityEvents(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
    ) {
      id
      stationId
      type
      timestamp
      techInfo
    }
    SecurityEvents_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const SECURITY_EVENTS_CREATE_MUTATION = gql`
  mutation SecurityEventsCreate($object: SecurityEvents_insert_input!) {
    insert_SecurityEvents_one(object: $object) {
      id
      stationId
      type
      timestamp
      techInfo
      createdAt
      updatedAt
    }
  }
`;

export const SECURITY_EVENTS_EDIT_MUTATION = gql`
  mutation SecurityEventsEdit($id: Int!, $object: SecurityEvents_set_input!) {
    update_SecurityEvents_by_pk(pk_columns: { id: $id }, _set: $object) {
      id
      stationId
      type
      timestamp
      techInfo
      createdAt
      updatedAt
    }
  }
`;

export const SECURITY_EVENTS_DELETE_MUTATION = gql`
  mutation SecurityEventsDelete($id: Int!) {
    delete_SecurityEvents_by_pk(id: $id) {
      id
      stationId
      type
      timestamp
      techInfo
      createdAt
      updatedAt
    }
  }
`;

export const SECURITY_EVENTS_SHOW_QUERY = gql`
  query SecurityEventsShow($id: Int!) {
    SecurityEvents_by_pk(id: $id) {
      id
      stationId
      type
      timestamp
      techInfo
      createdAt
      updatedAt
    }
  }
`;
