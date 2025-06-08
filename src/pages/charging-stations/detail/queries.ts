// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const CHANGE_CONFIGURATION_LIST_QUERY = gql`
  query ChangeConfigurationList(
    $offset: Int!
    $limit: Int!
    $order_by: [ChangeConfigurations_order_by!]
    $where: ChangeConfigurations_bool_exp
  ) {
    ChangeConfigurations(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
    ) {
      stationId
      key
      value
      readonly
    }
    ChangeConfigurations_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const CHANGE_CONFIGURATION_DOWNLOAD_QUERY = gql`
  query DownloadChangeConfigurations($stationId: String!) {
    ChangeConfigurations(
      where: { stationId: { _eq: $stationId } }
      order_by: { key: asc }
    ) {
      stationId
      key
      value
    }
    ChangeConfigurations_aggregate(where: { stationId: { _eq: $stationId } }) {
      aggregate {
        count
      }
    }
  }
`;
