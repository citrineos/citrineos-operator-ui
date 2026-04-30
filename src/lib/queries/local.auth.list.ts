// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

// Refine's hasura data provider always supplies $limit and $offset on useList.
// Hasura rejects undeclared variables, so they must appear in the query signature
// even though the result is the (single) row keyed by stationId.
export const LOCAL_LIST_VERSION_BY_STATION = gql`
  query LocalListVersionByStation(
    $stationId: String!
    $limit: Int!
    $offset: Int!
  ) {
    LocalListVersions(
      where: { stationId: { _eq: $stationId } }
      limit: $limit
      offset: $offset
    ) {
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

// `idToken` is a citext column in the Hasura schema, so the variable used in
// the citext _comparison_exp must be typed `citext` — passing `String` triggers
// "variable 'search' is declared as 'String', but used where 'citext' is expected".
// `idTokenType` is a plain text column, so we coerce against a separate variable.
export const SEARCH_AUTHORIZATIONS_FOR_LOCAL_LIST = gql`
  query SearchAuthorizationsForLocalList(
    $search: citext
    $searchText: String
    $limit: Int!
    $offset: Int!
  ) {
    Authorizations(
      where: {
        _or: [
          { idToken: { _ilike: $search } }
          { idTokenType: { _ilike: $searchText } }
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
      groupAuthorization: GroupAuthorization {
        id
        idToken
      }
    }
    Authorizations_aggregate(
      where: {
        _or: [
          { idToken: { _ilike: $search } }
          { idTokenType: { _ilike: $searchText } }
        ]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;
