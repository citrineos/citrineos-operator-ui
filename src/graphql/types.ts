// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import type * as Types from './schema.types';

export type ConnectorCreateInput = Omit<Types.Connectors, 'id'>;

export type ConnectorUpdateInput = Partial<Omit<Types.Connectors, 'id'>> & {
  id: number;
};

export type GetConnectorListQuery = {
  Connectors: Array<
    Pick<
      Types.Connectors,
      | 'id'
      | 'stationId'
      | 'connectorId'
      | 'status'
      | 'errorCode'
      | 'info'
      | 'vendorId'
      | 'vendorErrorCode'
    >
  >;
  Connectors_aggregate: {
    aggregate?: Types.Maybe<Pick<Types.Connectors_Aggregate_Fields, 'count'>>;
  };
};

export type ConnectorCreateMutationVariables = Types.Exact<{
  object: Types.Connectors_Insert_Input;
}>;

export type ConnectorDeleteMutation = {
  delete_Connectors_by_pk?: Types.Maybe<
    Pick<
      Types.Connectors,
      | 'id'
      | 'stationId'
      | 'connectorId'
      | 'status'
      | 'errorCode'
      | 'info'
      | 'vendorId'
      | 'vendorErrorCode'
    >
  >;
};

export type GetConnectorListQueryVariables = Types.Exact<{
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
  order_by?: Types.InputMaybe<
    Array<Types.Connectors_Order_By> | Types.Connectors_Order_By
  >;
  where?: Types.InputMaybe<Types.Connectors_Bool_Exp>;
}>;

export type GetTransactionsQueryVariables = Types.Exact<{
  stationId: Types.Scalars['String']['input'];
}>;

export type GetTransactionsQuery = {
  Transactions: Array<
    Pick<
      Types.Transactions,
      | 'transactionId'
      | 'id'
      | 'timeSpentCharging'
      | 'chargingState'
      | 'evseDatabaseId'
      | 'remoteStartId'
      | 'totalKwh'
      | 'stoppedReason'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type AdditionalInfosListQueryVariables = Types.Exact<{
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
  order_by?: Types.InputMaybe<
    Array<Types.AdditionalInfos_Order_By> | Types.AdditionalInfos_Order_By
  >;
  where?: Types.InputMaybe<Types.AdditionalInfos_Bool_Exp>;
}>;

export type AdditionalInfosListQuery = {
  AdditionalInfos: Array<
    Pick<Types.AdditionalInfos, 'id' | 'additionalIdToken' | 'type'> & {
      IdTokenAdditionalInfos: Array<{ IdToken: Pick<Types.IdTokens, 'id'> }>;
    }
  >;
  AdditionalInfos_aggregate: {
    aggregate?: Types.Maybe<
      Pick<Types.AdditionalInfos_Aggregate_Fields, 'count'>
    >;
  };
};

export type AdditionalInfosCreateMutationVariables = Types.Exact<{
  object: Types.AdditionalInfos_Insert_Input;
}>;

export type AdditionalInfosCreateMutation = {
  insert_AdditionalInfos_one?: Types.Maybe<
    Pick<
      Types.AdditionalInfos,
      'id' | 'additionalIdToken' | 'createdAt' | 'updatedAt' | 'type'
    >
  >;
};

export type AdditionalInfosEditMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  object: Types.AdditionalInfos_Set_Input;
}>;

export type AdditionalInfosEditMutation = {
  update_AdditionalInfos_by_pk?: Types.Maybe<
    Pick<
      Types.AdditionalInfos,
      'id' | 'additionalIdToken' | 'createdAt' | 'updatedAt' | 'type'
    >
  >;
};

export type AdditionalInfosDeleteMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type AdditionalInfosDeleteMutation = {
  delete_AdditionalInfos_by_pk?: Types.Maybe<
    Pick<
      Types.AdditionalInfos,
      'id' | 'additionalIdToken' | 'createdAt' | 'updatedAt' | 'type'
    >
  >;
};

export type AdditionalInfosShowQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type AdditionalInfosShowQuery = {
  AdditionalInfos_by_pk?: Types.Maybe<
    Pick<
      Types.AdditionalInfos,
      'id' | 'additionalIdToken' | 'createdAt' | 'updatedAt' | 'type'
    > & {
      IdTokenAdditionalInfos: Array<
        Pick<
          Types.IdTokenAdditionalInfos,
          'additionalInfoId' | 'createdAt' | 'idTokenId' | 'updatedAt'
        > & {
          AdditionalInfo: Pick<
            Types.AdditionalInfos,
            'id' | 'additionalIdToken' | 'createdAt' | 'updatedAt' | 'type'
          >;
          IdToken: Pick<
            Types.IdTokens,
            'id' | 'idToken' | 'type' | 'createdAt' | 'updatedAt'
          >;
        }
      >;
    }
  >;
};

export type IdTokenAdditionalInfos_Related_IdTokensListQueryVariables =
  Types.Exact<{
    offset: Types.Scalars['Int']['input'];
    limit: Types.Scalars['Int']['input'];
    order_by?: Types.InputMaybe<
      | Array<Types.IdTokenAdditionalInfos_Order_By>
      | Types.IdTokenAdditionalInfos_Order_By
    >;
    where?: Types.InputMaybe<Types.IdTokenAdditionalInfos_Bool_Exp>;
  }>;

export type IdTokenAdditionalInfos_Related_IdTokensListQuery = {
  IdTokenAdditionalInfos: Array<{
    IdToken: Pick<
      Types.IdTokens,
      'id' | 'idToken' | 'type' | 'createdAt' | 'updatedAt'
    >;
  }>;
  IdTokenAdditionalInfos_aggregate: {
    aggregate?: Types.Maybe<
      Pick<Types.IdTokenAdditionalInfos_Aggregate_Fields, 'count'>
    >;
  };
};

export type AuthorizationsListQueryVariables = Types.Exact<{
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
  order_by?: Types.InputMaybe<
    Array<Types.Authorizations_Order_By> | Types.Authorizations_Order_By
  >;
  where?: Types.InputMaybe<Types.Authorizations_Bool_Exp>;
}>;

export type AuthorizationsListQuery = {
  Authorizations: Array<
    Pick<
      Types.Authorizations,
      | 'id'
      | 'allowedConnectorTypes'
      | 'disallowedEvseIdPrefixes'
      | 'idTokenId'
      | 'idTokenInfoId'
    >
  >;
  Authorizations_aggregate: {
    aggregate?: Types.Maybe<
      Pick<Types.Authorizations_Aggregate_Fields, 'count'>
    >;
  };
};

export type AuthorizationsCreateMutationVariables = Types.Exact<{
  object: Types.Authorizations_Insert_Input;
}>;

export type AuthorizationsCreateMutation = {
  insert_Authorizations_one?: Types.Maybe<
    Pick<
      Types.Authorizations,
      | 'id'
      | 'allowedConnectorTypes'
      | 'disallowedEvseIdPrefixes'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type AuthorizationsEditMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  object: Types.Authorizations_Set_Input;
}>;

export type AuthorizationsEditMutation = {
  update_Authorizations_by_pk?: Types.Maybe<
    Pick<
      Types.Authorizations,
      | 'id'
      | 'allowedConnectorTypes'
      | 'disallowedEvseIdPrefixes'
      | 'idTokenId'
      | 'idTokenInfoId'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type AuthorizationsDeleteMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type AuthorizationsDeleteMutation = {
  delete_Authorizations_by_pk?: Types.Maybe<
    Pick<
      Types.Authorizations,
      | 'id'
      | 'allowedConnectorTypes'
      | 'disallowedEvseIdPrefixes'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type AuthorizationsShowQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type AuthorizationsShowQuery = {
  Authorizations_by_pk?: Types.Maybe<
    Pick<
      Types.Authorizations,
      | 'id'
      | 'allowedConnectorTypes'
      | 'disallowedEvseIdPrefixes'
      | 'idTokenId'
      | 'idTokenInfoId'
      | 'createdAt'
      | 'updatedAt'
    > & {
      IdToken?: Types.Maybe<
        Pick<
          Types.IdTokens,
          'id' | 'idToken' | 'type' | 'createdAt' | 'updatedAt'
        >
      >;
      IdTokenInfo?: Types.Maybe<
        Pick<
          Types.IdTokenInfos,
          | 'id'
          | 'cacheExpiryDateTime'
          | 'chargingPriority'
          | 'createdAt'
          | 'groupIdTokenId'
          | 'language1'
          | 'language2'
          | 'personalMessage'
          | 'status'
          | 'updatedAt'
        >
      >;
    }
  >;
};

export type BootsListQueryVariables = Types.Exact<{
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
  order_by?: Types.InputMaybe<
    Array<Types.Boots_Order_By> | Types.Boots_Order_By
  >;
  where?: Types.InputMaybe<Types.Boots_Bool_Exp>;
}>;

export type BootsListQuery = {
  Boots: Array<
    Pick<
      Types.Boots,
      | 'id'
      | 'lastBootTime'
      | 'heartbeatInterval'
      | 'bootRetryInterval'
      | 'status'
      | 'statusInfo'
      | 'getBaseReportOnPending'
      | 'variablesRejectedOnLastBoot'
      | 'bootWithRejectedVariables'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
  Boots_aggregate: {
    aggregate?: Types.Maybe<Pick<Types.Boots_Aggregate_Fields, 'count'>>;
  };
};

export type GetBootByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;

export type GetBootByIdQuery = {
  Boots_by_pk?: Types.Maybe<
    Pick<
      Types.Boots,
      | 'id'
      | 'lastBootTime'
      | 'heartbeatInterval'
      | 'bootRetryInterval'
      | 'status'
      | 'statusInfo'
      | 'getBaseReportOnPending'
      | 'variablesRejectedOnLastBoot'
      | 'bootWithRejectedVariables'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type BootsCreateMutationVariables = Types.Exact<{
  object: Types.Boots_Insert_Input;
}>;

export type BootsCreateMutation = {
  insert_Boots_one?: Types.Maybe<
    Pick<
      Types.Boots,
      | 'lastBootTime'
      | 'heartbeatInterval'
      | 'bootRetryInterval'
      | 'status'
      | 'statusInfo'
      | 'getBaseReportOnPending'
      | 'variablesRejectedOnLastBoot'
      | 'bootWithRejectedVariables'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type BootsEditMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
  object: Types.Boots_Set_Input;
}>;

export type BootsEditMutation = {
  update_Boots_by_pk?: Types.Maybe<
    Pick<
      Types.Boots,
      | 'id'
      | 'lastBootTime'
      | 'heartbeatInterval'
      | 'bootRetryInterval'
      | 'status'
      | 'statusInfo'
      | 'getBaseReportOnPending'
      | 'variablesRejectedOnLastBoot'
      | 'bootWithRejectedVariables'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type BootsDeleteMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;

export type BootsDeleteMutation = {
  delete_Boots_by_pk?: Types.Maybe<
    Pick<
      Types.Boots,
      | 'id'
      | 'lastBootTime'
      | 'heartbeatInterval'
      | 'bootRetryInterval'
      | 'status'
      | 'statusInfo'
      | 'getBaseReportOnPending'
      | 'variablesRejectedOnLastBoot'
      | 'bootWithRejectedVariables'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type CertificatesListQueryVariables = Types.Exact<{
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
  order_by?: Types.InputMaybe<
    Array<Types.Certificates_Order_By> | Types.Certificates_Order_By
  >;
  where?: Types.InputMaybe<Types.Certificates_Bool_Exp>;
}>;

export type CertificatesListQuery = {
  Certificates: Array<
    Pick<
      Types.Certificates,
      | 'id'
      | 'serialNumber'
      | 'issuerName'
      | 'organizationName'
      | 'commonName'
      | 'keyLength'
      | 'validBefore'
      | 'signatureAlgorithm'
      | 'countryName'
      | 'isCA'
      | 'pathLen'
      | 'certificateFileId'
      | 'privateKeyFileId'
      | 'signedBy'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
  Certificates_aggregate: {
    aggregate?: Types.Maybe<Pick<Types.Certificates_Aggregate_Fields, 'count'>>;
  };
};

export type GetCertificateByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type GetCertificateByIdQuery = {
  Certificates_by_pk?: Types.Maybe<
    Pick<
      Types.Certificates,
      | 'id'
      | 'serialNumber'
      | 'issuerName'
      | 'organizationName'
      | 'commonName'
      | 'keyLength'
      | 'validBefore'
      | 'signatureAlgorithm'
      | 'countryName'
      | 'isCA'
      | 'pathLen'
      | 'certificateFileId'
      | 'privateKeyFileId'
      | 'signedBy'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type CertificatesCreateMutationVariables = Types.Exact<{
  object: Types.Certificates_Insert_Input;
}>;

export type CertificatesCreateMutation = {
  insert_Certificates_one?: Types.Maybe<
    Pick<
      Types.Certificates,
      | 'id'
      | 'serialNumber'
      | 'issuerName'
      | 'organizationName'
      | 'commonName'
      | 'keyLength'
      | 'validBefore'
      | 'signatureAlgorithm'
      | 'countryName'
      | 'isCA'
      | 'pathLen'
      | 'certificateFileId'
      | 'privateKeyFileId'
      | 'signedBy'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type CertificatesDeleteMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type CertificatesDeleteMutation = {
  delete_Certificates_by_pk?: Types.Maybe<
    Pick<
      Types.Certificates,
      | 'id'
      | 'serialNumber'
      | 'issuerName'
      | 'organizationName'
      | 'commonName'
      | 'keyLength'
      | 'validBefore'
      | 'signatureAlgorithm'
      | 'countryName'
      | 'isCA'
      | 'pathLen'
      | 'certificateFileId'
      | 'privateKeyFileId'
      | 'signedBy'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type CertificatesEditMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  object: Types.Certificates_Set_Input;
}>;

export type CertificatesEditMutation = {
  update_Certificates_by_pk?: Types.Maybe<
    Pick<
      Types.Certificates,
      | 'id'
      | 'serialNumber'
      | 'issuerName'
      | 'organizationName'
      | 'commonName'
      | 'keyLength'
      | 'validBefore'
      | 'signatureAlgorithm'
      | 'countryName'
      | 'isCA'
      | 'pathLen'
      | 'certificateFileId'
      | 'privateKeyFileId'
      | 'signedBy'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type ChargingProfilesListQueryVariables = Types.Exact<{
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
  order_by?: Types.InputMaybe<
    Array<Types.ChargingProfiles_Order_By> | Types.ChargingProfiles_Order_By
  >;
  where?: Types.InputMaybe<Types.ChargingProfiles_Bool_Exp>;
}>;

export type ChargingProfilesListQuery = {
  ChargingProfiles: Array<
    Pick<
      Types.ChargingProfiles,
      | 'id'
      | 'databaseId'
      | 'stationId'
      | 'chargingProfileKind'
      | 'chargingProfilePurpose'
      | 'recurrencyKind'
      | 'stackLevel'
      | 'validFrom'
      | 'validTo'
      | 'evseId'
      | 'isActive'
      | 'chargingLimitSource'
      | 'transactionDatabaseId'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
  ChargingProfiles_aggregate: {
    aggregate?: Types.Maybe<
      Pick<Types.ChargingProfiles_Aggregate_Fields, 'count'>
    >;
  };
};

export type GetChargingProfileByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type GetChargingProfileByIdQuery = {
  ChargingProfiles_by_pk?: Types.Maybe<
    Pick<
      Types.ChargingProfiles,
      | 'id'
      | 'databaseId'
      | 'stationId'
      | 'chargingProfileKind'
      | 'chargingProfilePurpose'
      | 'recurrencyKind'
      | 'stackLevel'
      | 'validFrom'
      | 'validTo'
      | 'evseId'
      | 'isActive'
      | 'chargingLimitSource'
      | 'transactionDatabaseId'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type ChargingProfilesCreateMutationVariables = Types.Exact<{
  object: Types.ChargingProfiles_Insert_Input;
}>;

export type ChargingProfilesCreateMutation = {
  insert_ChargingProfiles_one?: Types.Maybe<
    Pick<
      Types.ChargingProfiles,
      | 'databaseId'
      | 'stationId'
      | 'chargingProfileKind'
      | 'chargingProfilePurpose'
      | 'recurrencyKind'
      | 'stackLevel'
      | 'validFrom'
      | 'validTo'
      | 'evseId'
      | 'isActive'
      | 'chargingLimitSource'
      | 'transactionDatabaseId'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type ChargingProfilesDeleteMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type ChargingProfilesDeleteMutation = {
  delete_ChargingProfiles_by_pk?: Types.Maybe<
    Pick<
      Types.ChargingProfiles,
      | 'id'
      | 'databaseId'
      | 'stationId'
      | 'chargingProfileKind'
      | 'chargingProfilePurpose'
      | 'recurrencyKind'
      | 'stackLevel'
      | 'validFrom'
      | 'validTo'
      | 'evseId'
      | 'isActive'
      | 'chargingLimitSource'
      | 'transactionDatabaseId'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type ChargingProfilesEditMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  object: Types.ChargingProfiles_Set_Input;
}>;

export type ChargingProfilesEditMutation = {
  update_ChargingProfiles_by_pk?: Types.Maybe<
    Pick<
      Types.ChargingProfiles,
      | 'id'
      | 'databaseId'
      | 'stationId'
      | 'chargingProfileKind'
      | 'chargingProfilePurpose'
      | 'recurrencyKind'
      | 'stackLevel'
      | 'validFrom'
      | 'validTo'
      | 'evseId'
      | 'isActive'
      | 'chargingLimitSource'
      | 'transactionDatabaseId'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type ChargingStationsListQueryVariables = Types.Exact<{
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
  order_by?: Types.InputMaybe<
    Array<Types.ChargingStations_Order_By> | Types.ChargingStations_Order_By
  >;
  where?: Types.InputMaybe<Types.ChargingStations_Bool_Exp>;
}>;

export type ChargingStationsListQuery = {
  ChargingStations: Array<
    Pick<
      Types.ChargingStations,
      'id' | 'isOnline' | 'locationId' | 'createdAt' | 'updatedAt'
    > & { StatusNotifications: Array<Pick<Types.StatusNotifications, 'id'>> }
  >;
  ChargingStations_aggregate: {
    aggregate?: Types.Maybe<
      Pick<Types.ChargingStations_Aggregate_Fields, 'count'>
    >;
  };
};

export type GetChargingStationByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;

export type GetChargingStationByIdQuery = {
  ChargingStations_by_pk?: Types.Maybe<
    Pick<
      Types.ChargingStations,
      'id' | 'isOnline' | 'locationId' | 'createdAt' | 'updatedAt'
    >
  >;
};

export type ChargingStationsCreateMutationVariables = Types.Exact<{
  object: Types.ChargingStations_Insert_Input;
}>;

export type ChargingStationsCreateMutation = {
  insert_ChargingStations_one?: Types.Maybe<
    Pick<
      Types.ChargingStations,
      'isOnline' | 'locationId' | 'createdAt' | 'updatedAt'
    >
  >;
};

export type ChargingStationsDeleteMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;

export type ChargingStationsDeleteMutation = {
  delete_ChargingStations_by_pk?: Types.Maybe<
    Pick<
      Types.ChargingStations,
      'id' | 'isOnline' | 'locationId' | 'createdAt' | 'updatedAt'
    >
  >;
};

export type ChargingStationsEditMutationVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
  object: Types.ChargingStations_Set_Input;
}>;

export type ChargingStationsEditMutation = {
  update_ChargingStations_by_pk?: Types.Maybe<
    Pick<
      Types.ChargingStations,
      'id' | 'isOnline' | 'locationId' | 'createdAt' | 'updatedAt'
    >
  >;
};

export type EvseListQueryVariables = Types.Exact<{
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
  order_by?: Types.InputMaybe<
    Array<Types.Evses_Order_By> | Types.Evses_Order_By
  >;
  where?: Types.InputMaybe<Types.Evses_Bool_Exp>;
}>;

export type EvseListQuery = {
  Evses: Array<
    Pick<
      Types.Evses,
      'databaseId' | 'id' | 'connectorId' | 'createdAt' | 'updatedAt'
    >
  >;
  Evses_aggregate: {
    aggregate?: Types.Maybe<Pick<Types.Evses_Aggregate_Fields, 'count'>>;
  };
};

export type GetEvseByIdQueryVariables = Types.Exact<{
  databaseId: Types.Scalars['Int']['input'];
}>;

export type GetEvseByIdQuery = {
  Evses_by_pk?: Types.Maybe<
    Pick<
      Types.Evses,
      'databaseId' | 'id' | 'connectorId' | 'createdAt' | 'updatedAt'
    >
  >;
};

export type EvseCreateMutationVariables = Types.Exact<{
  object: Types.Evses_Insert_Input;
}>;

export type EvseCreateMutation = {
  insert_Evses_one?: Types.Maybe<
    Pick<
      Types.Evses,
      'databaseId' | 'id' | 'connectorId' | 'createdAt' | 'updatedAt'
    >
  >;
};

export type EvseEditMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  object: Types.Evses_Set_Input;
}>;

export type EvseEditMutation = {
  update_Evses_by_pk?: Types.Maybe<
    Pick<
      Types.Evses,
      'databaseId' | 'id' | 'connectorId' | 'createdAt' | 'updatedAt'
    >
  >;
};

export type EvseDeleteMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type EvseDeleteMutation = {
  delete_Evses_by_pk?: Types.Maybe<
    Pick<
      Types.Evses,
      'databaseId' | 'id' | 'connectorId' | 'createdAt' | 'updatedAt'
    >
  >;
};

export type ComponentListQueryVariables = Types.Exact<{
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
  order_by?: Types.InputMaybe<
    Array<Types.Components_Order_By> | Types.Components_Order_By
  >;
  where?: Types.InputMaybe<Types.Components_Bool_Exp>;
}>;

export type ComponentListQuery = {
  Components: Array<
    Pick<
      Types.Components,
      'id' | 'instance' | 'name' | 'evseDatabaseId' | 'createdAt' | 'updatedAt'
    >
  >;
  Components_aggregate: {
    aggregate?: Types.Maybe<Pick<Types.Components_Aggregate_Fields, 'count'>>;
  };
};

export type GetComponentByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type GetComponentByIdQuery = {
  Components_by_pk?: Types.Maybe<
    Pick<
      Types.Components,
      'id' | 'instance' | 'name' | 'evseDatabaseId' | 'createdAt' | 'updatedAt'
    >
  >;
};

export type ComponentCreateMutationVariables = Types.Exact<{
  object: Types.Components_Insert_Input;
}>;

export type ComponentCreateMutation = {
  insert_Components_one?: Types.Maybe<
    Pick<
      Types.Components,
      'id' | 'instance' | 'name' | 'evseDatabaseId' | 'createdAt' | 'updatedAt'
    >
  >;
};

export type ComponentEditMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  object: Types.Components_Set_Input;
}>;

export type ComponentEditMutation = {
  update_Components_by_pk?: Types.Maybe<
    Pick<
      Types.Components,
      'id' | 'instance' | 'name' | 'evseDatabaseId' | 'createdAt' | 'updatedAt'
    >
  >;
};

export type ComponentDeleteMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type ComponentDeleteMutation = {
  delete_Components_by_pk?: Types.Maybe<
    Pick<
      Types.Components,
      'id' | 'instance' | 'name' | 'evseDatabaseId' | 'createdAt' | 'updatedAt'
    >
  >;
};

export type VariableAttributeListQueryVariables = Types.Exact<{
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
  order_by?: Types.InputMaybe<
    Array<Types.VariableAttributes_Order_By> | Types.VariableAttributes_Order_By
  >;
  where?: Types.InputMaybe<Types.VariableAttributes_Bool_Exp>;
}>;

export type VariableAttributeListQuery = {
  VariableAttributes: Array<
    Pick<
      Types.VariableAttributes,
      | 'id'
      | 'stationId'
      | 'type'
      | 'dataType'
      | 'value'
      | 'mutability'
      | 'persistent'
      | 'constant'
      | 'evseDatabaseId'
      | 'createdAt'
      | 'updatedAt'
    > & {
      Variable?: Types.Maybe<Pick<Types.Variables, 'id' | 'name'>>;
      Component?: Types.Maybe<Pick<Types.Components, 'id' | 'name'>>;
    }
  >;
  VariableAttributes_aggregate: {
    aggregate?: Types.Maybe<
      Pick<Types.VariableAttributes_Aggregate_Fields, 'count'>
    >;
  };
};

export type GetVariableAttributeByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type GetVariableAttributeByIdQuery = {
  VariableAttributes_by_pk?: Types.Maybe<
    Pick<
      Types.VariableAttributes,
      | 'id'
      | 'stationId'
      | 'type'
      | 'dataType'
      | 'value'
      | 'mutability'
      | 'persistent'
      | 'constant'
      | 'variableId'
      | 'componentId'
      | 'evseDatabaseId'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type VariableAttributeCreateMutationVariables = Types.Exact<{
  object: Types.VariableAttributes_Insert_Input;
}>;

export type VariableAttributeCreateMutation = {
  insert_VariableAttributes_one?: Types.Maybe<
    Pick<
      Types.VariableAttributes,
      | 'id'
      | 'stationId'
      | 'type'
      | 'dataType'
      | 'value'
      | 'mutability'
      | 'persistent'
      | 'constant'
      | 'variableId'
      | 'componentId'
      | 'evseDatabaseId'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type VariableAttributeEditMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  object: Types.VariableAttributes_Set_Input;
}>;

export type VariableAttributeEditMutation = {
  update_VariableAttributes_by_pk?: Types.Maybe<
    Pick<
      Types.VariableAttributes,
      | 'id'
      | 'stationId'
      | 'type'
      | 'dataType'
      | 'value'
      | 'mutability'
      | 'persistent'
      | 'constant'
      | 'variableId'
      | 'componentId'
      | 'evseDatabaseId'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type VariableAttributeDeleteMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type VariableAttributeDeleteMutation = {
  delete_VariableAttributes_by_pk?: Types.Maybe<
    Pick<
      Types.VariableAttributes,
      | 'id'
      | 'stationId'
      | 'type'
      | 'dataType'
      | 'value'
      | 'mutability'
      | 'persistent'
      | 'constant'
      | 'variableId'
      | 'componentId'
      | 'evseDatabaseId'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type VariableListQueryVariables = Types.Exact<{
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
  order_by?: Types.InputMaybe<
    Array<Types.Variables_Order_By> | Types.Variables_Order_By
  >;
  where?: Types.InputMaybe<Types.Variables_Bool_Exp>;
}>;

export type VariableListQuery = {
  Variables: Array<
    Pick<
      Types.Variables,
      'id' | 'instance' | 'name' | 'createdAt' | 'updatedAt'
    >
  >;
  Variables_aggregate: {
    aggregate?: Types.Maybe<Pick<Types.Variables_Aggregate_Fields, 'count'>>;
  };
};

export type GetVariableByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type GetVariableByIdQuery = {
  Variables_by_pk?: Types.Maybe<
    Pick<
      Types.Variables,
      'id' | 'instance' | 'name' | 'createdAt' | 'updatedAt'
    >
  >;
};

export type VariableCreateMutationVariables = Types.Exact<{
  object: Types.Variables_Insert_Input;
}>;

export type VariableCreateMutation = {
  insert_Variables_one?: Types.Maybe<
    Pick<
      Types.Variables,
      'id' | 'instance' | 'name' | 'createdAt' | 'updatedAt'
    >
  >;
};

export type VariableEditMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  object: Types.Variables_Set_Input;
}>;

export type VariableEditMutation = {
  update_Variables_by_pk?: Types.Maybe<
    Pick<
      Types.Variables,
      'id' | 'instance' | 'name' | 'createdAt' | 'updatedAt'
    >
  >;
};

export type VariableDeleteMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type VariableDeleteMutation = {
  delete_Variables_by_pk?: Types.Maybe<
    Pick<
      Types.Variables,
      'id' | 'instance' | 'name' | 'createdAt' | 'updatedAt'
    >
  >;
};

export type IdTokenInfosListQueryVariables = Types.Exact<{
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
  order_by?: Types.InputMaybe<
    Array<Types.IdTokenInfos_Order_By> | Types.IdTokenInfos_Order_By
  >;
  where?: Types.InputMaybe<Types.IdTokenInfos_Bool_Exp>;
}>;

export type IdTokenInfosListQuery = {
  IdTokenInfos: Array<
    Pick<
      Types.IdTokenInfos,
      | 'id'
      | 'cacheExpiryDateTime'
      | 'chargingPriority'
      | 'createdAt'
      | 'groupIdTokenId'
      | 'language1'
      | 'language2'
      | 'personalMessage'
      | 'status'
      | 'updatedAt'
    > & {
      IdToken?: Types.Maybe<Pick<Types.IdTokens, 'id'>>;
      Authorizations: Array<Pick<Types.Authorizations, 'id'>>;
    }
  >;
  IdTokenInfos_aggregate: {
    aggregate?: Types.Maybe<Pick<Types.IdTokenInfos_Aggregate_Fields, 'count'>>;
  };
};

export type IdTokenInfosCreateMutationVariables = Types.Exact<{
  object: Types.IdTokenInfos_Insert_Input;
}>;

export type IdTokenInfosCreateMutation = {
  insert_IdTokenInfos_one?: Types.Maybe<
    Pick<
      Types.IdTokenInfos,
      | 'id'
      | 'cacheExpiryDateTime'
      | 'chargingPriority'
      | 'createdAt'
      | 'groupIdTokenId'
      | 'language1'
      | 'language2'
      | 'personalMessage'
      | 'status'
      | 'updatedAt'
    >
  >;
};

export type IdTokenInfosEditMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  object: Types.IdTokenInfos_Set_Input;
}>;

export type IdTokenInfosEditMutation = {
  update_IdTokenInfos_by_pk?: Types.Maybe<
    Pick<
      Types.IdTokenInfos,
      | 'id'
      | 'cacheExpiryDateTime'
      | 'chargingPriority'
      | 'createdAt'
      | 'groupIdTokenId'
      | 'language1'
      | 'language2'
      | 'personalMessage'
      | 'status'
      | 'updatedAt'
    >
  >;
};

export type IdTokenInfosDeleteMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type IdTokenInfosDeleteMutation = {
  delete_IdTokenInfos_by_pk?: Types.Maybe<
    Pick<
      Types.IdTokenInfos,
      | 'id'
      | 'cacheExpiryDateTime'
      | 'chargingPriority'
      | 'createdAt'
      | 'groupIdTokenId'
      | 'language1'
      | 'language2'
      | 'personalMessage'
      | 'status'
      | 'updatedAt'
    >
  >;
};

export type IdTokenInfosShowQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type IdTokenInfosShowQuery = {
  IdTokenInfos_by_pk?: Types.Maybe<
    Pick<
      Types.IdTokenInfos,
      | 'id'
      | 'cacheExpiryDateTime'
      | 'chargingPriority'
      | 'createdAt'
      | 'groupIdTokenId'
      | 'language1'
      | 'language2'
      | 'personalMessage'
      | 'status'
      | 'updatedAt'
    > & {
      IdToken?: Types.Maybe<
        Pick<
          Types.IdTokens,
          'id' | 'idToken' | 'type' | 'createdAt' | 'updatedAt'
        >
      >;
      Authorizations: Array<
        Pick<
          Types.Authorizations,
          | 'id'
          | 'allowedConnectorTypes'
          | 'disallowedEvseIdPrefixes'
          | 'createdAt'
          | 'updatedAt'
        >
      >;
    }
  >;
};

export type IdTokensListQueryVariables = Types.Exact<{
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
  order_by?: Types.InputMaybe<
    Array<Types.IdTokens_Order_By> | Types.IdTokens_Order_By
  >;
  where?: Types.InputMaybe<Types.IdTokens_Bool_Exp>;
}>;

export type IdTokensListQuery = {
  IdTokens: Array<
    Pick<Types.IdTokens, 'id' | 'idToken' | 'type'> & {
      Authorization?: Types.Maybe<Pick<Types.Authorizations, 'id'>>;
      IdTokenInfos: Array<Pick<Types.IdTokenInfos, 'id'>>;
      TransactionEvents: Array<Pick<Types.TransactionEvents, 'id'>>;
    }
  >;
  IdTokens_aggregate: {
    aggregate?: Types.Maybe<Pick<Types.IdTokens_Aggregate_Fields, 'count'>>;
  };
};

export type IdTokensCreateMutationVariables = Types.Exact<{
  object: Types.IdTokens_Insert_Input;
}>;

export type IdTokensCreateMutation = {
  insert_IdTokens_one?: Types.Maybe<
    Pick<Types.IdTokens, 'id' | 'idToken' | 'type' | 'createdAt' | 'updatedAt'>
  >;
};

export type IdTokensEditMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  object: Types.IdTokens_Set_Input;
}>;

export type IdTokensEditMutation = {
  update_IdTokens_by_pk?: Types.Maybe<
    Pick<Types.IdTokens, 'id' | 'idToken' | 'type' | 'createdAt' | 'updatedAt'>
  >;
};

export type IdTokensDeleteMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type IdTokensDeleteMutation = {
  delete_IdTokens_by_pk?: Types.Maybe<
    Pick<Types.IdTokens, 'id' | 'idToken' | 'type' | 'createdAt' | 'updatedAt'>
  >;
};

export type IdTokensShowQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type IdTokensShowQuery = {
  IdTokens_by_pk?: Types.Maybe<
    Pick<
      Types.IdTokens,
      'id' | 'idToken' | 'type' | 'createdAt' | 'updatedAt'
    > & {
      Authorization?: Types.Maybe<
        Pick<
          Types.Authorizations,
          | 'id'
          | 'allowedConnectorTypes'
          | 'disallowedEvseIdPrefixes'
          | 'createdAt'
          | 'updatedAt'
        >
      >;
      IdTokenAdditionalInfos: Array<
        Pick<
          Types.IdTokenAdditionalInfos,
          'additionalInfoId' | 'createdAt' | 'idTokenId' | 'updatedAt'
        > & {
          AdditionalInfo: Pick<
            Types.AdditionalInfos,
            'id' | 'additionalIdToken' | 'createdAt' | 'updatedAt' | 'type'
          >;
          IdToken: Pick<
            Types.IdTokens,
            'id' | 'idToken' | 'type' | 'createdAt' | 'updatedAt'
          >;
        }
      >;
      IdTokenInfos: Array<
        Pick<
          Types.IdTokenInfos,
          | 'id'
          | 'cacheExpiryDateTime'
          | 'chargingPriority'
          | 'createdAt'
          | 'groupIdTokenId'
          | 'language1'
          | 'language2'
          | 'personalMessage'
          | 'status'
          | 'updatedAt'
        >
      >;
      TransactionEvents: Array<
        Pick<
          Types.TransactionEvents,
          'id' | 'eventType' | 'timestamp' | 'createdAt' | 'updatedAt'
        >
      >;
    }
  >;
};

export type LocationsListQueryVariables = Types.Exact<{
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
  order_by?: Types.InputMaybe<
    Array<Types.Locations_Order_By> | Types.Locations_Order_By
  >;
  where?: Types.InputMaybe<Types.Locations_Bool_Exp>;
}>;

export type LocationsListQuery = {
  Locations: Array<
    Pick<
      Types.Locations,
      | 'id'
      | 'name'
      | 'address'
      | 'city'
      | 'postalCode'
      | 'state'
      | 'country'
      | 'coordinates'
      | 'createdAt'
      | 'updatedAt'
    > & { ChargingStations: Array<Pick<Types.ChargingStations, 'id'>> }
  >;
  Locations_aggregate: {
    aggregate?: Types.Maybe<Pick<Types.Locations_Aggregate_Fields, 'count'>>;
  };
};

export type GetLocationByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type GetLocationByIdQuery = {
  Locations_by_pk?: Types.Maybe<
    Pick<
      Types.Locations,
      | 'id'
      | 'name'
      | 'address'
      | 'city'
      | 'postalCode'
      | 'state'
      | 'country'
      | 'coordinates'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type LocationsCreateMutationVariables = Types.Exact<{
  object: Types.Locations_Insert_Input;
}>;

export type LocationsCreateMutation = {
  insert_Locations_one?: Types.Maybe<
    Pick<
      Types.Locations,
      | 'name'
      | 'address'
      | 'city'
      | 'postalCode'
      | 'state'
      | 'country'
      | 'coordinates'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type LocationsDeleteMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type LocationsDeleteMutation = {
  delete_Locations_by_pk?: Types.Maybe<
    Pick<
      Types.Locations,
      | 'id'
      | 'name'
      | 'address'
      | 'city'
      | 'postalCode'
      | 'state'
      | 'country'
      | 'coordinates'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type LocationsEditMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  object: Types.Locations_Set_Input;
}>;

export type LocationsEditMutation = {
  update_Locations_by_pk?: Types.Maybe<
    Pick<
      Types.Locations,
      | 'id'
      | 'name'
      | 'address'
      | 'city'
      | 'postalCode'
      | 'state'
      | 'country'
      | 'coordinates'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type MessageInfosListQueryVariables = Types.Exact<{
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
  order_by?: Types.InputMaybe<
    Array<Types.MessageInfos_Order_By> | Types.MessageInfos_Order_By
  >;
  where?: Types.InputMaybe<Types.MessageInfos_Bool_Exp>;
}>;

export type MessageInfosListQuery = {
  MessageInfos: Array<
    Pick<
      Types.MessageInfos,
      | 'databaseId'
      | 'id'
      | 'stationId'
      | 'priority'
      | 'state'
      | 'startDateTime'
      | 'endDateTime'
      | 'transactionId'
      | 'message'
      | 'active'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
  MessageInfos_aggregate: {
    aggregate?: Types.Maybe<Pick<Types.MessageInfos_Aggregate_Fields, 'count'>>;
  };
};

export type GetMessageInfoByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type GetMessageInfoByIdQuery = {
  MessageInfos_by_pk?: Types.Maybe<
    Pick<
      Types.MessageInfos,
      | 'databaseId'
      | 'id'
      | 'stationId'
      | 'priority'
      | 'state'
      | 'startDateTime'
      | 'endDateTime'
      | 'transactionId'
      | 'message'
      | 'active'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type MessageInfosCreateMutationVariables = Types.Exact<{
  object: Types.MessageInfos_Insert_Input;
}>;

export type MessageInfosCreateMutation = {
  insert_MessageInfos_one?: Types.Maybe<
    Pick<
      Types.MessageInfos,
      | 'id'
      | 'stationId'
      | 'priority'
      | 'state'
      | 'startDateTime'
      | 'endDateTime'
      | 'transactionId'
      | 'message'
      | 'active'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type MessageInfosDeleteMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type MessageInfosDeleteMutation = {
  delete_MessageInfos_by_pk?: Types.Maybe<
    Pick<
      Types.MessageInfos,
      | 'databaseId'
      | 'id'
      | 'stationId'
      | 'priority'
      | 'state'
      | 'startDateTime'
      | 'endDateTime'
      | 'transactionId'
      | 'message'
      | 'active'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type MessageInfosEditMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  object: Types.MessageInfos_Set_Input;
}>;

export type MessageInfosEditMutation = {
  update_MessageInfos_by_pk?: Types.Maybe<
    Pick<
      Types.MessageInfos,
      | 'databaseId'
      | 'id'
      | 'stationId'
      | 'priority'
      | 'state'
      | 'startDateTime'
      | 'endDateTime'
      | 'transactionId'
      | 'message'
      | 'active'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type MeterValueListQueryVariables = Types.Exact<{
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
  order_by?: Types.InputMaybe<
    Array<Types.MeterValues_Order_By> | Types.MeterValues_Order_By
  >;
  where?: Types.InputMaybe<Types.MeterValues_Bool_Exp>;
}>;

export type MeterValueListQuery = {
  MeterValues: Array<
    Pick<
      Types.MeterValues,
      | 'id'
      | 'transactionDatabaseId'
      | 'transactionEventId'
      | 'sampledValue'
      | 'timestamp'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
  MeterValues_aggregate: {
    aggregate?: Types.Maybe<Pick<Types.MeterValues_Aggregate_Fields, 'count'>>;
  };
};

export type GetMeterValueByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type GetMeterValueByIdQuery = {
  MeterValues_by_pk?: Types.Maybe<
    Pick<
      Types.MeterValues,
      | 'id'
      | 'transactionDatabaseId'
      | 'transactionEventId'
      | 'sampledValue'
      | 'timestamp'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type MeterValueCreateMutationVariables = Types.Exact<{
  object: Types.MeterValues_Insert_Input;
}>;

export type MeterValueCreateMutation = {
  insert_MeterValues_one?: Types.Maybe<
    Pick<
      Types.MeterValues,
      | 'id'
      | 'transactionDatabaseId'
      | 'transactionEventId'
      | 'sampledValue'
      | 'timestamp'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type MeterValueEditMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  object: Types.MeterValues_Set_Input;
}>;

export type MeterValueEditMutation = {
  update_MeterValues_by_pk?: Types.Maybe<
    Pick<
      Types.MeterValues,
      | 'id'
      | 'transactionDatabaseId'
      | 'transactionEventId'
      | 'sampledValue'
      | 'timestamp'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type MeterValueDeleteMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type MeterValueDeleteMutation = {
  delete_MeterValues_by_pk?: Types.Maybe<
    Pick<
      Types.MeterValues,
      | 'id'
      | 'transactionDatabaseId'
      | 'transactionEventId'
      | 'sampledValue'
      | 'timestamp'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type ReservationsListQueryVariables = Types.Exact<{
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
  order_by?: Types.InputMaybe<
    Array<Types.Reservations_Order_By> | Types.Reservations_Order_By
  >;
  where?: Types.InputMaybe<Types.Reservations_Bool_Exp>;
}>;

export type ReservationsListQuery = {
  Reservations: Array<
    Pick<
      Types.Reservations,
      | 'databaseId'
      | 'id'
      | 'stationId'
      | 'expiryDateTime'
      | 'connectorType'
      | 'reserveStatus'
      | 'isActive'
      | 'terminatedByTransaction'
      | 'idToken'
      | 'groupIdToken'
      | 'evseId'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
  Reservations_aggregate: {
    aggregate?: Types.Maybe<Pick<Types.Reservations_Aggregate_Fields, 'count'>>;
  };
};

export type GetReservationByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type GetReservationByIdQuery = {
  Reservations_by_pk?: Types.Maybe<
    Pick<
      Types.Reservations,
      | 'databaseId'
      | 'id'
      | 'stationId'
      | 'expiryDateTime'
      | 'connectorType'
      | 'reserveStatus'
      | 'isActive'
      | 'terminatedByTransaction'
      | 'idToken'
      | 'groupIdToken'
      | 'evseId'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type ReservationsCreateMutationVariables = Types.Exact<{
  object: Types.Reservations_Insert_Input;
}>;

export type ReservationsCreateMutation = {
  insert_Reservations_one?: Types.Maybe<
    Pick<
      Types.Reservations,
      | 'databaseId'
      | 'id'
      | 'stationId'
      | 'expiryDateTime'
      | 'connectorType'
      | 'reserveStatus'
      | 'isActive'
      | 'terminatedByTransaction'
      | 'idToken'
      | 'groupIdToken'
      | 'evseId'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type ReservationsDeleteMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type ReservationsDeleteMutation = {
  delete_Reservations_by_pk?: Types.Maybe<
    Pick<
      Types.Reservations,
      | 'databaseId'
      | 'id'
      | 'stationId'
      | 'expiryDateTime'
      | 'connectorType'
      | 'reserveStatus'
      | 'isActive'
      | 'terminatedByTransaction'
      | 'idToken'
      | 'groupIdToken'
      | 'evseId'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type ReservationsEditMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  object: Types.Reservations_Set_Input;
}>;

export type ReservationsEditMutation = {
  update_Reservations_by_pk?: Types.Maybe<
    Pick<
      Types.Reservations,
      | 'databaseId'
      | 'id'
      | 'stationId'
      | 'expiryDateTime'
      | 'connectorType'
      | 'reserveStatus'
      | 'isActive'
      | 'terminatedByTransaction'
      | 'idToken'
      | 'groupIdToken'
      | 'evseId'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type SecurityEventsListQueryVariables = Types.Exact<{
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
  order_by?: Types.InputMaybe<
    Array<Types.SecurityEvents_Order_By> | Types.SecurityEvents_Order_By
  >;
  where?: Types.InputMaybe<Types.SecurityEvents_Bool_Exp>;
}>;

export type SecurityEventsListQuery = {
  SecurityEvents: Array<
    Pick<
      Types.SecurityEvents,
      'id' | 'stationId' | 'type' | 'timestamp' | 'techInfo'
    >
  >;
  SecurityEvents_aggregate: {
    aggregate?: Types.Maybe<
      Pick<Types.SecurityEvents_Aggregate_Fields, 'count'>
    >;
  };
};

export type SecurityEventsCreateMutationVariables = Types.Exact<{
  object: Types.SecurityEvents_Insert_Input;
}>;

export type SecurityEventsCreateMutation = {
  insert_SecurityEvents_one?: Types.Maybe<
    Pick<
      Types.SecurityEvents,
      | 'id'
      | 'stationId'
      | 'type'
      | 'timestamp'
      | 'techInfo'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type SecurityEventsEditMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  object: Types.SecurityEvents_Set_Input;
}>;

export type SecurityEventsEditMutation = {
  update_SecurityEvents_by_pk?: Types.Maybe<
    Pick<
      Types.SecurityEvents,
      | 'id'
      | 'stationId'
      | 'type'
      | 'timestamp'
      | 'techInfo'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type SecurityEventsDeleteMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type SecurityEventsDeleteMutation = {
  delete_SecurityEvents_by_pk?: Types.Maybe<
    Pick<
      Types.SecurityEvents,
      | 'id'
      | 'stationId'
      | 'type'
      | 'timestamp'
      | 'techInfo'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type SecurityEventsShowQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type SecurityEventsShowQuery = {
  SecurityEvents_by_pk?: Types.Maybe<
    Pick<
      Types.SecurityEvents,
      | 'id'
      | 'stationId'
      | 'type'
      | 'timestamp'
      | 'techInfo'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type StatusNotificationsListQueryVariables = Types.Exact<{
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
  order_by?: Types.InputMaybe<
    | Array<Types.StatusNotifications_Order_By>
    | Types.StatusNotifications_Order_By
  >;
  where?: Types.InputMaybe<Types.StatusNotifications_Bool_Exp>;
}>;

export type StatusNotificationsListQuery = {
  StatusNotifications: Array<
    Pick<
      Types.StatusNotifications,
      | 'id'
      | 'stationId'
      | 'evseId'
      | 'connectorId'
      | 'timestamp'
      | 'connectorStatus'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
  StatusNotifications_aggregate: {
    aggregate?: Types.Maybe<
      Pick<Types.StatusNotifications_Aggregate_Fields, 'count'>
    >;
  };
};

export type GetStatusNotificationByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type GetStatusNotificationByIdQuery = {
  StatusNotifications_by_pk?: Types.Maybe<
    Pick<
      Types.StatusNotifications,
      | 'id'
      | 'stationId'
      | 'evseId'
      | 'connectorId'
      | 'timestamp'
      | 'connectorStatus'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type StatusNotificationsCreateMutationVariables = Types.Exact<{
  object: Types.StatusNotifications_Insert_Input;
}>;

export type StatusNotificationsCreateMutation = {
  insert_StatusNotifications_one?: Types.Maybe<
    Pick<
      Types.StatusNotifications,
      | 'stationId'
      | 'evseId'
      | 'connectorId'
      | 'timestamp'
      | 'connectorStatus'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type StatusNotificationsDeleteMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type StatusNotificationsDeleteMutation = {
  delete_StatusNotifications_by_pk?: Types.Maybe<
    Pick<
      Types.StatusNotifications,
      | 'id'
      | 'stationId'
      | 'evseId'
      | 'connectorId'
      | 'timestamp'
      | 'connectorStatus'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type StatusNotificationsEditMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  object: Types.StatusNotifications_Set_Input;
}>;

export type StatusNotificationsEditMutation = {
  update_StatusNotifications_by_pk?: Types.Maybe<
    Pick<
      Types.StatusNotifications,
      | 'id'
      | 'stationId'
      | 'evseId'
      | 'connectorId'
      | 'timestamp'
      | 'connectorStatus'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type SubscriptionsListQueryVariables = Types.Exact<{
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
  order_by?: Types.InputMaybe<
    Array<Types.Subscriptions_Order_By> | Types.Subscriptions_Order_By
  >;
  where?: Types.InputMaybe<Types.Subscriptions_Bool_Exp>;
}>;

export type SubscriptionsListQuery = {
  Subscriptions: Array<
    Pick<
      Types.Subscriptions,
      | 'id'
      | 'stationId'
      | 'onConnect'
      | 'onClose'
      | 'onMessage'
      | 'sentMessage'
      | 'messageRegexFilter'
      | 'url'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
  Subscriptions_aggregate: {
    aggregate?: Types.Maybe<
      Pick<Types.Subscriptions_Aggregate_Fields, 'count'>
    >;
  };
};

export type SubscriptionsCreateMutationVariables = Types.Exact<{
  object: Types.Subscriptions_Insert_Input;
}>;

export type SubscriptionsCreateMutation = {
  insert_Subscriptions_one?: Types.Maybe<
    Pick<
      Types.Subscriptions,
      | 'id'
      | 'stationId'
      | 'onConnect'
      | 'onClose'
      | 'onMessage'
      | 'sentMessage'
      | 'messageRegexFilter'
      | 'url'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type SubscriptionsEditMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  object: Types.Subscriptions_Set_Input;
}>;

export type SubscriptionsEditMutation = {
  update_Subscriptions_by_pk?: Types.Maybe<
    Pick<
      Types.Subscriptions,
      | 'id'
      | 'stationId'
      | 'onConnect'
      | 'onClose'
      | 'onMessage'
      | 'sentMessage'
      | 'messageRegexFilter'
      | 'url'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type SubscriptionsDeleteMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type SubscriptionsDeleteMutation = {
  delete_Subscriptions_by_pk?: Types.Maybe<
    Pick<
      Types.Subscriptions,
      | 'id'
      | 'stationId'
      | 'onConnect'
      | 'onClose'
      | 'onMessage'
      | 'sentMessage'
      | 'messageRegexFilter'
      | 'url'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type GetSubscriptionByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type GetSubscriptionByIdQuery = {
  Subscriptions_by_pk?: Types.Maybe<
    Pick<
      Types.Subscriptions,
      | 'id'
      | 'stationId'
      | 'onConnect'
      | 'onClose'
      | 'onMessage'
      | 'sentMessage'
      | 'messageRegexFilter'
      | 'url'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type TariffListQueryVariables = Types.Exact<{
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
  order_by?: Types.InputMaybe<
    Array<Types.Tariffs_Order_By> | Types.Tariffs_Order_By
  >;
  where?: Types.InputMaybe<Types.Tariffs_Bool_Exp>;
}>;

export type TariffListQuery = {
  Tariffs: Array<
    Pick<
      Types.Tariffs,
      | 'id'
      | 'stationId'
      | 'currency'
      | 'pricePerKwh'
      | 'pricePerMin'
      | 'pricePerSession'
      | 'authorizationAmount'
      | 'paymentFee'
      | 'taxRate'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
  Tariffs_aggregate: {
    aggregate?: Types.Maybe<Pick<Types.Tariffs_Aggregate_Fields, 'count'>>;
  };
};

export type GetTariffByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type GetTariffByIdQuery = {
  Tariffs_by_pk?: Types.Maybe<
    Pick<
      Types.Tariffs,
      | 'id'
      | 'stationId'
      | 'currency'
      | 'pricePerKwh'
      | 'pricePerMin'
      | 'pricePerSession'
      | 'authorizationAmount'
      | 'paymentFee'
      | 'taxRate'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type TariffCreateMutationVariables = Types.Exact<{
  object: Types.Tariffs_Insert_Input;
}>;

export type TariffCreateMutation = {
  insert_Tariffs_one?: Types.Maybe<
    Pick<
      Types.Tariffs,
      | 'id'
      | 'stationId'
      | 'currency'
      | 'pricePerKwh'
      | 'pricePerMin'
      | 'pricePerSession'
      | 'authorizationAmount'
      | 'paymentFee'
      | 'taxRate'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type TariffEditMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  object: Types.Tariffs_Set_Input;
}>;

export type TariffEditMutation = {
  update_Tariffs_by_pk?: Types.Maybe<
    Pick<
      Types.Tariffs,
      | 'id'
      | 'stationId'
      | 'currency'
      | 'pricePerKwh'
      | 'pricePerMin'
      | 'pricePerSession'
      | 'authorizationAmount'
      | 'paymentFee'
      | 'taxRate'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type TariffDeleteMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type TariffDeleteMutation = {
  delete_Tariffs_by_pk?: Types.Maybe<
    Pick<
      Types.Tariffs,
      | 'id'
      | 'stationId'
      | 'currency'
      | 'pricePerKwh'
      | 'pricePerMin'
      | 'pricePerSession'
      | 'authorizationAmount'
      | 'paymentFee'
      | 'taxRate'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type TransactionEventListQueryVariables = Types.Exact<{
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
  order_by?: Types.InputMaybe<
    Array<Types.TransactionEvents_Order_By> | Types.TransactionEvents_Order_By
  >;
  where?: Types.InputMaybe<Types.TransactionEvents_Bool_Exp>;
}>;

export type TransactionEventListQuery = {
  TransactionEvents: Array<
    Pick<
      Types.TransactionEvents,
      | 'id'
      | 'offline'
      | 'eventType'
      | 'stationId'
      | 'triggerReason'
      | 'evseId'
      | 'idTokenId'
      | 'numberOfPhasesUsed'
      | 'reservationId'
      | 'seqNo'
      | 'transactionDatabaseId'
      | 'transactionInfo'
      | 'cableMaxCurrent'
      | 'createdAt'
      | 'timestamp'
      | 'updatedAt'
    >
  >;
  TransactionEvents_aggregate: {
    aggregate?: Types.Maybe<
      Pick<Types.TransactionEvents_Aggregate_Fields, 'count'>
    >;
  };
};

export type GetTransactionEventByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type GetTransactionEventByIdQuery = {
  TransactionEvents_by_pk?: Types.Maybe<
    Pick<
      Types.TransactionEvents,
      | 'id'
      | 'offline'
      | 'eventType'
      | 'stationId'
      | 'triggerReason'
      | 'evseId'
      | 'idTokenId'
      | 'numberOfPhasesUsed'
      | 'reservationId'
      | 'seqNo'
      | 'transactionDatabaseId'
      | 'transactionInfo'
      | 'cableMaxCurrent'
      | 'createdAt'
      | 'timestamp'
      | 'updatedAt'
    >
  >;
};

export type TransactionEventCreateMutationVariables = Types.Exact<{
  object: Types.TransactionEvents_Insert_Input;
}>;

export type TransactionEventCreateMutation = {
  insert_TransactionEvents_one?: Types.Maybe<
    Pick<
      Types.TransactionEvents,
      | 'id'
      | 'offline'
      | 'eventType'
      | 'stationId'
      | 'triggerReason'
      | 'evseId'
      | 'idTokenId'
      | 'numberOfPhasesUsed'
      | 'reservationId'
      | 'seqNo'
      | 'transactionDatabaseId'
      | 'transactionInfo'
      | 'cableMaxCurrent'
      | 'createdAt'
      | 'timestamp'
      | 'updatedAt'
    >
  >;
};

export type TransactionEventEditMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  object: Types.TransactionEvents_Set_Input;
}>;

export type TransactionEventEditMutation = {
  update_TransactionEvents_by_pk?: Types.Maybe<
    Pick<
      Types.TransactionEvents,
      | 'id'
      | 'offline'
      | 'eventType'
      | 'stationId'
      | 'triggerReason'
      | 'evseId'
      | 'idTokenId'
      | 'numberOfPhasesUsed'
      | 'reservationId'
      | 'seqNo'
      | 'transactionDatabaseId'
      | 'transactionInfo'
      | 'cableMaxCurrent'
      | 'createdAt'
      | 'timestamp'
      | 'updatedAt'
    >
  >;
};

export type TransactionEventDeleteMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type TransactionEventDeleteMutation = {
  delete_TransactionEvents_by_pk?: Types.Maybe<
    Pick<
      Types.TransactionEvents,
      | 'id'
      | 'offline'
      | 'eventType'
      | 'stationId'
      | 'triggerReason'
      | 'evseId'
      | 'idTokenId'
      | 'numberOfPhasesUsed'
      | 'reservationId'
      | 'seqNo'
      | 'transactionDatabaseId'
      | 'transactionInfo'
      | 'cableMaxCurrent'
      | 'createdAt'
      | 'timestamp'
      | 'updatedAt'
    >
  >;
};

export type TransactionListQueryVariables = Types.Exact<{
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
  order_by?: Types.InputMaybe<
    Array<Types.Transactions_Order_By> | Types.Transactions_Order_By
  >;
  where?: Types.InputMaybe<Types.Transactions_Bool_Exp>;
}>;

export type TransactionListQuery = {
  Transactions: Array<
    Pick<
      Types.Transactions,
      | 'id'
      | 'timeSpentCharging'
      | 'isActive'
      | 'chargingState'
      | 'stationId'
      | 'stoppedReason'
      | 'transactionId'
      | 'evseDatabaseId'
      | 'remoteStartId'
      | 'totalKwh'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
  Transactions_aggregate: {
    aggregate?: Types.Maybe<Pick<Types.Transactions_Aggregate_Fields, 'count'>>;
  };
};

export type GetTransactionByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type GetTransactionByIdQuery = {
  Transactions_by_pk?: Types.Maybe<
    Pick<
      Types.Transactions,
      | 'id'
      | 'timeSpentCharging'
      | 'isActive'
      | 'chargingState'
      | 'stationId'
      | 'stoppedReason'
      | 'transactionId'
      | 'evseDatabaseId'
      | 'remoteStartId'
      | 'totalKwh'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type TransactionCreateMutationVariables = Types.Exact<{
  object: Types.Transactions_Insert_Input;
}>;

export type TransactionCreateMutation = {
  insert_Transactions_one?: Types.Maybe<
    Pick<
      Types.Transactions,
      | 'id'
      | 'timeSpentCharging'
      | 'isActive'
      | 'chargingState'
      | 'stationId'
      | 'stoppedReason'
      | 'transactionId'
      | 'evseDatabaseId'
      | 'remoteStartId'
      | 'totalKwh'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type TransactionEditMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  object: Types.Transactions_Set_Input;
}>;

export type TransactionEditMutation = {
  update_Transactions_by_pk?: Types.Maybe<
    Pick<
      Types.Transactions,
      | 'id'
      | 'timeSpentCharging'
      | 'isActive'
      | 'chargingState'
      | 'stationId'
      | 'stoppedReason'
      | 'transactionId'
      | 'evseDatabaseId'
      | 'remoteStartId'
      | 'totalKwh'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type TransactionDeleteMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type TransactionDeleteMutation = {
  delete_Transactions_by_pk?: Types.Maybe<
    Pick<
      Types.Transactions,
      | 'id'
      | 'timeSpentCharging'
      | 'isActive'
      | 'chargingState'
      | 'stationId'
      | 'stoppedReason'
      | 'transactionId'
      | 'evseDatabaseId'
      | 'remoteStartId'
      | 'totalKwh'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type VariableMonitoringsListQueryVariables = Types.Exact<{
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
  order_by?: Types.InputMaybe<
    | Array<Types.VariableMonitorings_Order_By>
    | Types.VariableMonitorings_Order_By
  >;
  where?: Types.InputMaybe<Types.VariableMonitorings_Bool_Exp>;
}>;

export type VariableMonitoringsListQuery = {
  VariableMonitorings: Array<
    Pick<
      Types.VariableMonitorings,
      | 'databaseId'
      | 'id'
      | 'stationId'
      | 'transaction'
      | 'value'
      | 'type'
      | 'severity'
      | 'variableId'
      | 'componentId'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
  VariableMonitorings_aggregate: {
    aggregate?: Types.Maybe<
      Pick<Types.VariableMonitorings_Aggregate_Fields, 'count'>
    >;
  };
};

export type GetVariableMonitoringByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type GetVariableMonitoringByIdQuery = {
  VariableMonitorings_by_pk?: Types.Maybe<
    Pick<
      Types.VariableMonitorings,
      | 'databaseId'
      | 'id'
      | 'stationId'
      | 'transaction'
      | 'value'
      | 'type'
      | 'severity'
      | 'variableId'
      | 'componentId'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type VariableMonitoringsCreateMutationVariables = Types.Exact<{
  object: Types.VariableMonitorings_Insert_Input;
}>;

export type VariableMonitoringsCreateMutation = {
  insert_VariableMonitorings_one?: Types.Maybe<
    Pick<
      Types.VariableMonitorings,
      | 'databaseId'
      | 'id'
      | 'stationId'
      | 'transaction'
      | 'value'
      | 'type'
      | 'severity'
      | 'variableId'
      | 'componentId'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type VariableMonitoringsDeleteMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type VariableMonitoringsDeleteMutation = {
  delete_VariableMonitorings_by_pk?: Types.Maybe<
    Pick<
      Types.VariableMonitorings,
      | 'databaseId'
      | 'id'
      | 'stationId'
      | 'transaction'
      | 'value'
      | 'type'
      | 'severity'
      | 'variableId'
      | 'componentId'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type VariableMonitoringsEditMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  object: Types.VariableMonitorings_Set_Input;
}>;

export type VariableMonitoringsEditMutation = {
  update_VariableMonitorings_by_pk?: Types.Maybe<
    Pick<
      Types.VariableMonitorings,
      | 'databaseId'
      | 'id'
      | 'stationId'
      | 'transaction'
      | 'value'
      | 'type'
      | 'severity'
      | 'variableId'
      | 'componentId'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
};

export type GetTransactionIdByTransactionIdAndStationIdQueryVariables =
  Types.Exact<{
    transactionId: Types.Scalars['String']['input'];
    stationId: Types.Scalars['String']['input'];
  }>;

export type GetTransactionIdByTransactionIdAndStationIdQuery = {
  Transactions: Array<Pick<Types.Transactions, 'id'>>;
};
