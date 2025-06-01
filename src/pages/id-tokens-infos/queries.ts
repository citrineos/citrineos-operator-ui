// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const ID_TOKEN_INFOS_LIST_QUERY = gql`
  query IdTokenInfosList(
    $offset: Int!
    $limit: Int!
    $order_by: [IdTokenInfos_order_by!]
    $where: IdTokenInfos_bool_exp
  ) {
    IdTokenInfos(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
    ) {
      id
      cacheExpiryDateTime
      chargingPriority
      createdAt
      groupIdTokenId
      language1
      language2
      personalMessage
      status
      updatedAt
      IdToken {
        id
      }
      Authorizations {
        id
      }
    }
    IdTokenInfos_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const ID_TOKEN_INFOS_CREATE_MUTATION = gql`
  mutation IdTokenInfosCreate($object: IdTokenInfos_insert_input!) {
    insert_IdTokenInfos_one(object: $object) {
      id
      cacheExpiryDateTime
      chargingPriority
      createdAt
      groupIdTokenId
      language1
      language2
      personalMessage
      status
      updatedAt
    }
  }
`;

export const ID_TOKEN_INFOS_EDIT_MUTATION = gql`
  mutation IdTokenInfosEdit($id: Int!, $object: IdTokenInfos_set_input!) {
    update_IdTokenInfos_by_pk(pk_columns: { id: $id }, _set: $object) {
      id
      cacheExpiryDateTime
      chargingPriority
      createdAt
      groupIdTokenId
      language1
      language2
      personalMessage
      status
      updatedAt
    }
  }
`;

export const ID_TOKEN_INFOS_DELETE_MUTATION = gql`
  mutation IdTokenInfosDelete($id: Int!) {
    delete_IdTokenInfos_by_pk(id: $id) {
      id
      cacheExpiryDateTime
      chargingPriority
      createdAt
      groupIdTokenId
      language1
      language2
      personalMessage
      status
      updatedAt
    }
  }
`;

export const ID_TOKEN_INFOS_SHOW_QUERY = gql`
  query IdTokenInfosShow($id: Int!) {
    IdTokenInfos_by_pk(id: $id) {
      id
      cacheExpiryDateTime
      chargingPriority
      createdAt
      groupIdTokenId
      language1
      language2
      personalMessage
      status
      updatedAt
      IdToken {
        id
        idToken
        type
        createdAt
        updatedAt
      }
      Authorizations {
        id
        allowedConnectorTypes
        disallowedEvseIdPrefixes
        createdAt
        updatedAt
      }
    }
  }
`;
