// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { gql } from 'graphql-tag';

export const TARIFF_LIST_QUERY = gql`
  query TariffList(
    $offset: Int!
    $limit: Int!
    $order_by: [Tariffs_order_by!]
    $where: Tariffs_bool_exp
  ) {
    Tariffs(
      offset: $offset
      limit: $limit
      order_by: $order_by
      where: $where
    ) {
      id
      stationId
      currency
      pricePerKwh
      pricePerMin
      pricePerSession
      authorizationAmount
      paymentFee
      taxRate
      createdAt
      updatedAt
    }
    Tariffs_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const TARIFF_GET_QUERY = gql`
  query GetTariffById($id: Int!) {
    Tariffs_by_pk(id: $id) {
      id
      stationId
      currency
      pricePerKwh
      pricePerMin
      pricePerSession
      authorizationAmount
      paymentFee
      taxRate
      createdAt
      updatedAt
    }
  }
`;

export const TARIFF_CREATE_MUTATION = gql`
  mutation TariffCreate($object: Tariffs_insert_input!) {
    insert_Tariffs_one(object: $object) {
      id
      stationId
      currency
      pricePerKwh
      pricePerMin
      pricePerSession
      authorizationAmount
      paymentFee
      taxRate
      createdAt
      updatedAt
    }
  }
`;

export const TARIFF_EDIT_MUTATION = gql`
  mutation TariffEdit($id: Int!, $object: Tariffs_set_input!) {
    update_Tariffs_by_pk(pk_columns: { id: $id }, _set: $object) {
      id
      stationId
      currency
      pricePerKwh
      pricePerMin
      pricePerSession
      authorizationAmount
      paymentFee
      taxRate
      createdAt
      updatedAt
    }
  }
`;

export const TARIFF_DELETE_MUTATION = gql`
  mutation TariffDelete($id: Int!) {
    delete_Tariffs_by_pk(id: $id) {
      id
      stationId
      currency
      pricePerKwh
      pricePerMin
      pricePerSession
      authorizationAmount
      paymentFee
      taxRate
      createdAt
      updatedAt
    }
  }
`;
