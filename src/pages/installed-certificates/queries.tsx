// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

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
      id
      stationId
      hashAlgorithm
      issuerNameHash
      issuerKeyHash
      serialNumber
      certificateType
    }
    InstalledCertificates_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const INSTALLED_CERTIFICATE_GET_QUERY = gql`
  query GetInstalledCertificateById($id: Int!) {
    InstalledCertificates_by_pk(id: $id) {
      id
      stationId
      hashAlgorithm
      issuerNameHash
      issuerKeyHash
      serialNumber
      certificateType
    }
  }
`;

export const INSTALLED_CERTIFICATE_CREATE_MUTATION = gql`
  mutation InstalledCertificateCreate(
    $object: InstalledCertificates_insert_input!
  ) {
    insert_InstalledCertificates_one(object: $object) {
      id
      stationId
      hashAlgorithm
      issuerNameHash
      issuerKeyHash
      serialNumber
      certificateType
    }
  }
`;

export const INSTALLED_CERTIFICATE_EDIT_MUTATION = gql`
  mutation InstalledCertificateEdit(
    $id: Int!
    $object: InstalledCertificates_set_input!
  ) {
    update_InstalledCertificates_by_pk(pk_columns: { id: $id }, _set: $object) {
      id
      stationId
      hashAlgorithm
      issuerNameHash
      issuerKeyHash
      serialNumber
      certificateType
    }
  }
`;

export const INSTALLED_CERTIFICATE_DELETE_MUTATION = gql`
  mutation InstalledCertificateDelete($id: Int!) {
    delete_InstalledCertificates_by_pk(id: $id) {
      id
      stationId
      hashAlgorithm
      issuerNameHash
      issuerKeyHash
      serialNumber
      certificateType
    }
  }
`;
