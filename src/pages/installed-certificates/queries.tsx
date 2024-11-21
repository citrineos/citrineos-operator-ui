import { gql } from 'graphql-tag';

export const INSTALLED_CERTIFICATE_QUERY_FIELDS = `
  id
  stationId
  hashAlgorithm
  issuerNameHash
  issuerKeyHash
  serialNumber
  certificateType
  certificateId
`;

export const INSTALLED_CERTIFICATE_LIST_QUERY = gql`
  query InstalledCertificateList(
    $offset: Int!
    $limit: Int!
    $order_by: [InstalledCertificates_order_by!]
    $where: InstalledCertificates_bool_exp
  ) {
    InstalledCertificates(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
    ) {
      ${INSTALLED_CERTIFICATE_QUERY_FIELDS}
    }
    InstalledCertificates_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const INSTALLED_CERTIFICATE_LIST_FOR_STATION_QUERY = gql`
  query InstalledCertificateListForStation(
    $stationId: String!
    $where: [InstalledCertificates_bool_exp!] = []
    $order_by: [InstalledCertificates_order_by!] = {}
    $offset: Int
    $limit: Int
  ) {
    InstalledCertificates(
      where: { stationId: { _eq: $stationId }, _and: $where }
      order_by: $order_by
      offset: $offset
      limit: $limit
    ) {
      ${INSTALLED_CERTIFICATE_QUERY_FIELDS}
    }
    InstalledCertificates_aggregate(
      where: { stationId: { _eq: $stationId }, _and: $where }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const INSTALLED_CERTIFICATE_GET_QUERY = gql`
  query GetInstalledCertificateById($id: Int!) {
    InstalledCertificates_by_pk(id: $id) {
      ${INSTALLED_CERTIFICATE_QUERY_FIELDS}
    }
  }
`;

export const INSTALLED_CERTIFICATE_CREATE_MUTATION = gql`
  mutation InstalledCertificateCreate(
    $object: InstalledCertificates_insert_input!
  ) {
    insert_InstalledCertificates_one(object: $object) {
      ${INSTALLED_CERTIFICATE_QUERY_FIELDS}
    }
  }
`;

export const INSTALLED_CERTIFICATE_EDIT_MUTATION = gql`
  mutation InstalledCertificateEdit(
    $id: Int!
    $object: InstalledCertificates_set_input!
  ) {
    update_InstalledCertificates_by_pk(pk_columns: { id: $id }, _set: $object) {
      ${INSTALLED_CERTIFICATE_QUERY_FIELDS}
    }
  }
`;

export const INSTALLED_CERTIFICATE_DELETE_MUTATION = gql`
  mutation InstalledCertificateDelete($id: Int!) {
    delete_InstalledCertificates_by_pk(id: $id) {
      ${INSTALLED_CERTIFICATE_QUERY_FIELDS}
    }
  }
`;
