// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const CERTIFICATES_LIST_QUERY = gql`
  query CertificatesList(
    $offset: Int!
    $limit: Int!
    $order_by: [Certificates_order_by!]
    $where: Certificates_bool_exp
  ) {
    Certificates(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
    ) {
      id
      serialNumber
      issuerName
      organizationName
      commonName
      keyLength
      validBefore
      signatureAlgorithm
      countryName
      isCA
      pathLen
      certificateFileId
      privateKeyFileId
      signedBy
      createdAt
      updatedAt
    }
    Certificates_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const CERTIFICATES_GET_QUERY = gql`
  query GetCertificateById($id: Int!) {
    Certificates_by_pk(id: $id) {
      id
      serialNumber
      issuerName
      organizationName
      commonName
      keyLength
      validBefore
      signatureAlgorithm
      countryName
      isCA
      pathLen
      certificateFileId
      privateKeyFileId
      signedBy
      createdAt
      updatedAt
    }
  }
`;

export const CERTIFICATES_CREATE_MUTATION = gql`
  mutation CertificatesCreate($object: Certificates_insert_input!) {
    insert_Certificates_one(object: $object) {
      id
      serialNumber
      issuerName
      organizationName
      commonName
      keyLength
      validBefore
      signatureAlgorithm
      countryName
      isCA
      pathLen
      certificateFileId
      privateKeyFileId
      signedBy
      createdAt
      updatedAt
    }
  }
`;

export const CERTIFICATES_DELETE_MUTATION = gql`
  mutation CertificatesDelete($id: Int!) {
    delete_Certificates_by_pk(id: $id) {
      id
      serialNumber
      issuerName
      organizationName
      commonName
      keyLength
      validBefore
      signatureAlgorithm
      countryName
      isCA
      pathLen
      certificateFileId
      privateKeyFileId
      signedBy
      createdAt
      updatedAt
    }
  }
`;

export const CERTIFICATES_EDIT_MUTATION = gql`
  mutation CertificatesEdit($id: Int!, $object: Certificates_set_input!) {
    update_Certificates_by_pk(pk_columns: { id: $id }, _set: $object) {
      id
      serialNumber
      issuerName
      organizationName
      commonName
      keyLength
      validBefore
      signatureAlgorithm
      countryName
      isCA
      pathLen
      certificateFileId
      privateKeyFileId
      signedBy
      createdAt
      updatedAt
    }
  }
`;
