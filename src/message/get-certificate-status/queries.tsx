import { gql } from 'graphql-tag';

export const GET_CERTIFICATES = gql`
  query GetCertificates {
    Certificates {
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
