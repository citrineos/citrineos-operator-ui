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