// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const BOOTS_LIST_QUERY = gql`
  query BootsList(
    $offset: Int!
    $limit: Int!
    $order_by: [Boots_order_by!]
    $where: Boots_bool_exp
  ) {
    Boots(offset: $offset, limit: $limit, order_by: $order_by, where: $where) {
      id
      lastBootTime
      heartbeatInterval
      bootRetryInterval
      status
      statusInfo
      getBaseReportOnPending
      variablesRejectedOnLastBoot
      bootWithRejectedVariables
      createdAt
      updatedAt
    }
    Boots_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const BOOTS_GET_QUERY = gql`
  query GetBootById($id: String!) {
    Boots_by_pk(id: $id) {
      id
      lastBootTime
      heartbeatInterval
      bootRetryInterval
      status
      statusInfo
      getBaseReportOnPending
      variablesRejectedOnLastBoot
      bootWithRejectedVariables
      createdAt
      updatedAt
    }
  }
`;

export const BOOTS_CREATE_MUTATION = gql`
  mutation BootsCreate($object: Boots_insert_input!) {
    insert_Boots_one(object: $object) {
      lastBootTime
      heartbeatInterval
      bootRetryInterval
      status
      statusInfo
      getBaseReportOnPending
      variablesRejectedOnLastBoot
      bootWithRejectedVariables
      createdAt
      updatedAt
    }
  }
`;

export const BOOTS_EDIT_MUTATION = gql`
  mutation BootsEdit($id: String!, $object: Boots_set_input!) {
    update_Boots_by_pk(pk_columns: { id: $id }, _set: $object) {
      id
      lastBootTime
      heartbeatInterval
      bootRetryInterval
      status
      statusInfo
      getBaseReportOnPending
      variablesRejectedOnLastBoot
      bootWithRejectedVariables
      createdAt
      updatedAt
    }
  }
`;

export const BOOTS_DELETE_MUTATION = gql`
  mutation BootsDelete($id: String!) {
    delete_Boots_by_pk(id: $id) {
      id
      lastBootTime
      heartbeatInterval
      bootRetryInterval
      status
      statusInfo
      getBaseReportOnPending
      variablesRejectedOnLastBoot
      bootWithRejectedVariables
      createdAt
      updatedAt
    }
  }
`;
