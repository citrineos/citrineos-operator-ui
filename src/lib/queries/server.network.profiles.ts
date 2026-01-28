// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const SERVER_NETWORK_PROFILE_LIST_QUERY = gql`
  query ServerNetworkProfileList(
    $offset: Int!
    $limit: Int!
    $order_by: [ServerNetworkProfiles_order_by!]
    $where: ServerNetworkProfiles_bool_exp
  ) {
    ServerNetworkProfiles(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
    ) {
      id
      host
      port
      pingInterval
      protocol
      messageTimeout
      securityProfile
      allowUnknownChargingStations
      tlsKeyFilePath
      tlsCertificateChainFilePath
      mtlsCertificateAuthorityKeyFilePath
      rootCACertificateFilePath
    }
    ServerNetworkProfiles_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const SERVER_NETWORK_PROFILE_GET_QUERY = gql`
  query GetServerNetworkProfileById($id: String!) {
    ServerNetworkProfiles_by_pk(id: $id) {
      id
      host
      port
      pingInterval
      protocol
      messageTimeout
      securityProfile
      allowUnknownChargingStations
      tlsKeyFilePath
      tlsCertificateChainFilePath
      mtlsCertificateAuthorityKeyFilePath
      rootCACertificateFilePath
    }
  }
`;
