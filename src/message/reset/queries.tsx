import { gql } from 'graphql-tag';

export const GET_EVSES_FOR_STATION = gql`
  query GetEvses($stationId: String!) {
    Evses(
      where: { VariableAttributes: { stationId: { _eq: $stationId } } }
    ) {
      databaseId
      id
      connectorId
      createdAt
      updatedAt
    }
  }
`;
