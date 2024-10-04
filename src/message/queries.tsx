import { gql } from 'graphql-tag';

export const GET_EVSE_LIST_FOR_STATION = gql`
  query GetEvseListForStation(
    $stationId: String!
    $where: Evses_bool_exp = {}
    $order_by: [Evses_order_by!] = {}
    $offset: Int
    $limit: Int
  ) {
    Evses(
      where: {
        VariableAttributes: { stationId: { _eq: $stationId } }
        _and: [$where]
      }
      order_by: $order_by
      offset: $offset
      limit: $limit
    ) {
      databaseId
      id
      connectorId
      createdAt
      updatedAt
    }
    Evses_aggregate(
      where: {
        VariableAttributes: { stationId: { _eq: $stationId } }
        _and: [$where]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;
