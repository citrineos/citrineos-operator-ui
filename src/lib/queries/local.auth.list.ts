// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const LOCAL_LIST_VERSION_BY_STATION = gql`
  query LocalListVersionByStation($stationId: String!) {
    LocalListVersions(where: { stationId: { _eq: $stationId } }, limit: 1) {
      id
      stationId
      versionNumber
      updatedAt
      createdAt
      LocalListAuthorizations {
        id
        authorizationId
        idToken
        idTokenType
        status
        cacheExpiryDateTime
        groupAuthorizationId
        chargingPriority
        language1
        language2
        allowedConnectorTypes
        disallowedEvseIdPrefixes
        groupAuthorization: GroupAuthorization {
          id
          idToken
        }
      }
    }
  }
`;

export const SEARCH_AUTHORIZATIONS_FOR_LOCAL_LIST = gql`
  query SearchAuthorizationsForLocalList(
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    Authorizations(
      where: {
        _or: [
          { idToken: { _ilike: $search } }
          { idTokenType: { _ilike: $search } }
        ]
      }
      limit: $limit
      offset: $offset
      order_by: { idToken: asc }
    ) {
      id
      idToken
      idTokenType
      status
      groupAuthorizationId
      cacheExpiryDateTime
    }
    Authorizations_aggregate(
      where: {
        _or: [
          { idToken: { _ilike: $search } }
          { idTokenType: { _ilike: $search } }
        ]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;
