// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const AUTHORIZATIONS_LIST_QUERY = gql`
  query AuthorizationsList(
    $offset: Int!
    $limit: Int!
    $order_by: [Authorizations_order_by!]
    $where: Authorizations_bool_exp
  ) {
    Authorizations(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
    ) {
      id
      idToken
      idTokenType
      status
      groupAuthorizationId
      additionalInfo
      concurrentTransaction
      chargingPriority
      language1
      language2
      personalMessage
      cacheExpiryDateTime
      allowedConnectorTypes
      disallowedEvseIdPrefixes
      createdAt
      updatedAt
    }
    Authorizations_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_AUTHORIZATIONS_BY_TRANSACTION = gql`
  query GetAuthorizationsListByAuthorizationId(
    $id: Int!
    $offset: Int!
    $limit: Int!
    $order_by: [Authorizations_order_by!]
    $where: Authorizations_bool_exp!
  ) {
    Authorizations(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: { id: { _eq: $id } }
    ) {
      id
      idToken
      idTokenType
      status
      groupAuthorizationId
      additionalInfo
      concurrentTransaction
      chargingPriority
      language1
      language2
      personalMessage
      cacheExpiryDateTime
      allowedConnectorTypes
      disallowedEvseIdPrefixes
      createdAt
      updatedAt
    }
    Authorizations_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const AUTHORIZATIONS_SHOW_QUERY = gql`
  query AuthorizationsShow($id: Int!) {
    Authorizations_by_pk(id: $id) {
      id
      idToken
      idTokenType
      status
      groupAuthorizationId
      additionalInfo
      concurrentTransaction
      chargingPriority
      language1
      language2
      personalMessage
      cacheExpiryDateTime
      allowedConnectorTypes
      disallowedEvseIdPrefixes
      realTimeAuth
      realTimeAuthUrl
      createdAt
      updatedAt
      tenantPartner: TenantPartner {
        id
        partnerProfileOCPI
      }
    }
  }
`;

export const AUTHORIZATIONS_CREATE_MUTATION = gql`
  mutation AuthorizationsCreate($object: Authorizations_insert_input!) {
    insert_Authorizations_one(object: $object) {
      id
      idToken
      idTokenType
      status
      groupAuthorizationId
      additionalInfo
      concurrentTransaction
      chargingPriority
      language1
      language2
      personalMessage
      cacheExpiryDateTime
      createdAt
      updatedAt
    }
  }
`;

export const AUTHORIZATIONS_EDIT_MUTATION = gql`
  mutation AuthorizationsEdit($id: Int!, $object: Authorizations_set_input!) {
    update_Authorizations_by_pk(pk_columns: { id: $id }, _set: $object) {
      id
      idToken
      idTokenType
      status
      groupAuthorizationId
      additionalInfo
      concurrentTransaction
      chargingPriority
      language1
      language2
      personalMessage
      cacheExpiryDateTime
      createdAt
      updatedAt
    }
  }
`;

export const AUTHORIZATIONS_DELETE_MUTATION = gql`
  mutation AuthorizationsDelete($id: Int!) {
    delete_Authorizations_by_pk(id: $id) {
      id
      idToken
      idTokenType
      status
      groupAuthorizationId
      additionalInfo
      concurrentTransaction
      chargingPriority
      language1
      language2
      personalMessage
      cacheExpiryDateTime
      createdAt
      updatedAt
    }
  }
`;
