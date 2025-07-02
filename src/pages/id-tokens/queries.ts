// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const ID_TOKENS_LIST_QUERY = gql`
  query IdTokensList(
    $offset: Int!
    $limit: Int!
    $order_by: [IdTokens_order_by!]
    $where: IdTokens_bool_exp
  ) {
    IdTokens(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
    ) {
      id
      idToken
      type
      Authorization {
        id
      }
      IdTokenInfos {
        id
      }
      TransactionEvents {
        id
      }
    }
    IdTokens_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const ID_TOKENS_CREATE_MUTATION = gql`
  mutation IdTokensCreate($object: IdTokens_insert_input!) {
    insert_IdTokens_one(object: $object) {
      id
      idToken
      type
      createdAt
      updatedAt
    }
  }
`;

export const ID_TOKENS_EDIT_MUTATION = gql`
  mutation IdTokensEdit($id: Int!, $object: IdTokens_set_input!) {
    update_IdTokens_by_pk(pk_columns: { id: $id }, _set: $object) {
      id
      idToken
      type
      createdAt
      updatedAt
    }
  }
`;

export const ID_TOKENS_DELETE_MUTATION = gql`
  mutation IdTokensDelete($id: Int!) {
    delete_IdTokens_by_pk(id: $id) {
      id
      idToken
      type
      createdAt
      updatedAt
    }
  }
`;

export const ID_TOKENS_SHOW_QUERY = gql`
  query IdTokensShow($id: Int!) {
    IdTokens_by_pk(id: $id) {
      id
      idToken
      type
      createdAt
      updatedAt
      Authorization {
        id
        allowedConnectorTypes
        disallowedEvseIdPrefixes
        createdAt
        updatedAt
      }
      IdTokenAdditionalInfos {
        additionalInfoId
        createdAt
        idTokenId
        updatedAt
        AdditionalInfo {
          id
          additionalIdToken
          createdAt
          updatedAt
          type
        }
        IdToken {
          id
          idToken
          type
          createdAt
          updatedAt
        }
      }
      IdTokenInfos {
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
      TransactionEvents {
        id
        eventType
        timestamp
        createdAt
        updatedAt
      }
    }
  }
`;
