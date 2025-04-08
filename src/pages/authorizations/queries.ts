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
      allowedConnectorTypes
      disallowedEvseIdPrefixes
      idTokenId
      idTokenInfoId
      IdToken {
        createdAt
        id
        idToken
        type
        updatedAt
      }
      IdTokenInfo {
        cacheExpiryDateTime
        chargingPriority
        createdAt
        groupIdTokenId
        id
        language1
        language2
        personalMessage
        status
        updatedAt
      }
    }
    Authorizations_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const AUTHORIZATIONS_CREATE_MUTATION = gql`
  mutation AuthorizationsCreate($object: Authorizations_insert_input!) {
    insert_Authorizations_one(object: $object) {
      id
      allowedConnectorTypes
      disallowedEvseIdPrefixes
      createdAt
      updatedAt
    }
  }
`;

export const AUTHORIZATIONS_EDIT_MUTATION = gql`
  mutation AuthorizationsEdit($id: Int!, $object: Authorizations_set_input!) {
    update_Authorizations_by_pk(pk_columns: { id: $id }, _set: $object) {
      id
      allowedConnectorTypes
      disallowedEvseIdPrefixes
      idTokenId
      idTokenInfoId
      createdAt
      updatedAt
    }
  }
`;

export const AUTHORIZATIONS_DELETE_MUTATION = gql`
  mutation AuthorizationsDelete($id: Int!) {
    delete_Authorizations_by_pk(id: $id) {
      id
      allowedConnectorTypes
      disallowedEvseIdPrefixes
      createdAt
      updatedAt
    }
  }
`;

export const AUTHORIZATIONS_SHOW_QUERY = gql`
  query AuthorizationsShow($id: Int!) {
    Authorizations_by_pk(id: $id) {
      id
      allowedConnectorTypes
      disallowedEvseIdPrefixes
      idTokenId
      idTokenInfoId
      createdAt
      updatedAt
      IdToken {
        id
        idToken
        type
        createdAt
        updatedAt
      }
      IdTokenInfo {
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
  }
`;

export const GET_TRANSACTIONS_FOR_AUTHORIZATION = gql`
  query TransactionsList(
    $id: Int!
    $limit: Int!
    $offset: Int!
    $order_by: [Transactions_order_by!]
    $where: Transactions_bool_exp = {}
  ) {
    Transactions(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: {
        _and: [{ TransactionEvents: { IdToken: { id: { _eq: $id } } } }, $where]
      }
    ) {
      id
      timeSpentCharging
      isActive
      chargingState
      stationId
      stoppedReason
      transactionId
      evseDatabaseId
      remoteStartId
      totalKwh
      createdAt
      updatedAt
      ChargingStation {
        id
        isOnline
        protocol
        locationId
        createdAt
        updatedAt
        Location {
          name
          address
          city
          postalCode
          state
          country
          coordinates
          createdAt
          updatedAt
        }
      }
      TransactionEvents(where: { eventType: { _eq: "Started" } }) {
        eventType
        IdToken {
          idToken
        }
      }
    }
    Transactions_aggregate(
      where: {
        _and: [{ TransactionEvents: { IdToken: { id: { _eq: $id } } } }, $where]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;
