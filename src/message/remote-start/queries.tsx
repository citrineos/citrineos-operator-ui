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

export const GET_REMOTE_START_REQUEST_ID_FOR_STATION = gql`
  query GetRemoteStartRequestId($stationId: String!) {
    ChargingStationSequences(
      where: { stationId: { _eq: $stationId }, type: { _eq: "remoteStartId" } }
    ) {
      value
    }
  }
`;