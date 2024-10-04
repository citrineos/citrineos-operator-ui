import { gql } from 'graphql-tag';

export const GET_ACTIVE_TRANSACTIONS = gql`
  query GetTransactions($stationId: String!) {
    Transactions(
      where: { stationId: { _eq: $stationId }, isActive: { _eq: true } }
    ) {
      transactionId
      id
      timeSpentCharging
      chargingState
      evseDatabaseId
      remoteStartId
      totalKwh
      stoppedReason
      createdAt
      updatedAt
    }
  }
`;
