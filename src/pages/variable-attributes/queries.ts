import { gql } from 'graphql-tag';

export const VARIABLE_ATTRIBUTE_LIST_QUERY = gql`
  query VariableAttributeList(
    $offset: Int!
    $limit: Int!
    $order_by: [VariableAttributes_order_by!]
    $where: VariableAttributes_bool_exp
  ) {
    VariableAttributes(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
    ) {
      id
      stationId
      type
      dataType
      value
      mutability
      persistent
      constant
      variableId
      componentId
      evseDatabaseId
      createdAt
      updatedAt
      Variable {
        id
        instance
        name
        createdAt
        updatedAt
      }
      Component {
        id
        instance
        name
        evseDatabaseId
        createdAt
        updatedAt
      }
    }
    VariableAttributes_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const VARIABLE_ATTRIBUTE_LIST_FOR_STATION_QUERY = gql`
  query VariableAttributeListByEvse(
    $stationId: String!
    $offset: Int
    $limit: Int
    $order_by: [VariableAttributes_order_by!] = {}
    $where: [VariableAttributes_bool_exp!] = []
  ) {
    VariableAttributes(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: { stationId: { _eq: $stationId }, _and: $where }
    ) {
      id
      stationId
      type
      dataType
      value
      mutability
      persistent
      constant
      variableId
      componentId
      evseDatabaseId
      createdAt
      updatedAt
      Variable {
        id
        instance
        name
        createdAt
        updatedAt
      }
      Component {
        id
        instance
        name
        evseDatabaseId
        createdAt
        updatedAt
      }
    }
    VariableAttributes_aggregate(
      where: { stationId: { _eq: $stationId }, _and: $where }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const VARIABLE_ATTRIBUTE_GET_QUERY = gql`
  query GetVariableAttributeById($id: Int!) {
    VariableAttributes_by_pk(id: $id) {
      id
      stationId
      type
      dataType
      value
      mutability
      persistent
      constant
      variableId
      componentId
      evseDatabaseId
      createdAt
      updatedAt
    }
  }
`;

export const VARIABLE_ATTRIBUTE_CREATE_MUTATION = gql`
  mutation VariableAttributeCreate($object: VariableAttributes_insert_input!) {
    insert_VariableAttributes_one(object: $object) {
      id
      stationId
      type
      dataType
      value
      mutability
      persistent
      constant
      variableId
      componentId
      evseDatabaseId
      createdAt
      updatedAt
    }
  }
`;

export const VARIABLE_ATTRIBUTE_EDIT_MUTATION = gql`
  mutation VariableAttributeEdit(
    $id: Int!
    $object: VariableAttributes_set_input!
  ) {
    update_VariableAttributes_by_pk(pk_columns: { id: $id }, _set: $object) {
      id
      stationId
      type
      dataType
      value
      mutability
      persistent
      constant
      variableId
      componentId
      evseDatabaseId
      createdAt
      updatedAt
    }
  }
`;

export const VARIABLE_ATTRIBUTE_DELETE_MUTATION = gql`
  mutation VariableAttributeDelete($id: Int!) {
    delete_VariableAttributes_by_pk(id: $id) {
      id
      stationId
      type
      dataType
      value
      mutability
      persistent
      constant
      variableId
      componentId
      evseDatabaseId
      createdAt
      updatedAt
    }
  }
`;
