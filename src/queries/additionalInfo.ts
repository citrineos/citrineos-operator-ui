// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const ADDITIONAL_INFOS_LIST_QUERY = gql`
  query AdditionalInfosList(
    $offset: Int!
    $limit: Int!
    $order_by: [AdditionalInfos_order_by!]
    $where: AdditionalInfos_bool_exp
  ) {
    AdditionalInfos(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
    ) {
      id
      additionalIdToken
      type
      IdTokenAdditionalInfos {
        IdToken {
          id
        }
      }
    }
    AdditionalInfos_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const ADDITIONAL_INFOS_CREATE_MUTATION = gql`
  mutation AdditionalInfosCreate($object: AdditionalInfos_insert_input!) {
    insert_AdditionalInfos_one(object: $object) {
      id
      additionalIdToken
      createdAt
      updatedAt
      type
    }
  }
`;

export const ADDITIONAL_INFOS_EDIT_MUTATION = gql`
  mutation AdditionalInfosEdit($id: Int!, $object: AdditionalInfos_set_input!) {
    update_AdditionalInfos_by_pk(pk_columns: { id: $id }, _set: $object) {
      id
      additionalIdToken
      createdAt
      updatedAt
      type
    }
  }
`;

export const ADDITIONAL_INFOS_DELETE_MUTATION = gql`
  mutation AdditionalInfosDelete($id: Int!) {
    delete_AdditionalInfos_by_pk(id: $id) {
      id
      additionalIdToken
      createdAt
      updatedAt
      type
    }
  }
`;

export const ADDITIONAL_INFOS_SHOW_QUERY = gql`
  query AdditionalInfosShow($id: Int!) {
    AdditionalInfos_by_pk(id: $id) {
      id
      additionalIdToken
      createdAt
      updatedAt
      type
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
    }
  }
`;

export const ADDITIONAL_INFOS_RELATED_IDTOKENS_QUERY = gql`
  query IdTokenAdditionalInfos_Related_IdTokensList(
    $offset: Int!
    $limit: Int!
    $order_by: [IdTokenAdditionalInfos_order_by!]
    $where: IdTokenAdditionalInfos_bool_exp
  ) {
    IdTokenAdditionalInfos(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
    ) {
      IdToken {
        id
        idToken
        type
        createdAt
        updatedAt
      }
    }
    IdTokenAdditionalInfos_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const ADDITIONAL_INFOS_RELATED_IDTOKENS = gql`
  query FetchIdTokensWithGroupedAdditionalInfos(
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
      createdAt
      updatedAt
      IdTokenAdditionalInfos {
        AdditionalInfo {
          id
          additionalIdToken
          type
          createdAt
          updatedAt
        }
      }
    }
    IdTokens_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;
