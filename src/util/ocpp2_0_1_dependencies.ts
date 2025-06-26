// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { OCPP1_6, OCPP2_0_1 } from '@citrineos/base';

export const MonitorEnumType = OCPP2_0_1.MonitorEnumType;
export type MonitorEnumType = OCPP2_0_1.MonitorEnumType;
export const ConnectorStatusEnumType = {
  ...OCPP2_0_1.ConnectorStatusEnumType,
  ...OCPP1_6.StatusNotificationRequestStatus,
};
export type ConnectorStatusEnumType =
  | OCPP2_0_1.ConnectorStatusEnumType
  | OCPP1_6.StatusNotificationRequestStatus;
export const ErrorCodes = OCPP1_6.StatusNotificationRequestErrorCode;
export type ErrorCodes = OCPP1_6.StatusNotificationRequestErrorCode;
export const MeasurandEnumType = OCPP2_0_1.MeasurandEnumType;
export type MeasurandEnumType = OCPP2_0_1.MeasurandEnumType;
export const LocationEnumType = OCPP2_0_1.LocationEnumType;
export type LocationEnumType = OCPP2_0_1.LocationEnumType;
export const PhaseEnumType = OCPP2_0_1.PhaseEnumType;
export type PhaseEnumType = OCPP2_0_1.PhaseEnumType;
export const ReadingContextEnumType = OCPP2_0_1.ReadingContextEnumType;
export type ReadingContextEnumType = OCPP2_0_1.ReadingContextEnumType;
export const IdTokenEnumType = OCPP2_0_1.IdTokenEnumType;
export type IdTokenEnumType = OCPP2_0_1.IdTokenEnumType;
export const TransactionEventEnumType = OCPP2_0_1.TransactionEventEnumType;
export type TransactionEventEnumType = OCPP2_0_1.TransactionEventEnumType;
export const TriggerReasonEnumType = OCPP2_0_1.TriggerReasonEnumType;
export type TriggerReasonEnumType = OCPP2_0_1.TriggerReasonEnumType;
export const ChargingStateEnumType = OCPP2_0_1.ChargingStateEnumType;
export type ChargingStateEnumType = OCPP2_0_1.ChargingStateEnumType;
export const ReasonEnumType = OCPP2_0_1.ReasonEnumType;
export type ReasonEnumType = OCPP2_0_1.ReasonEnumType;
export const ResetEnumType = OCPP2_0_1.ResetEnumType;
export type ResetEnumType = OCPP2_0_1.ResetEnumType;
export const AuthorizationStatusEnumType = {
  ...OCPP2_0_1.AuthorizationStatusEnumType,
};
export type AuthorizationStatusEnumType = OCPP2_0_1.AuthorizationStatusEnumType;
export const AttributeEnumType = OCPP2_0_1.AttributeEnumType;
export type AttributeEnumType = OCPP2_0_1.AttributeEnumType;
export const DataEnumType = OCPP2_0_1.DataEnumType;
export type DataEnumType = OCPP2_0_1.DataEnumType;
export const MutabilityEnumType = OCPP2_0_1.MutabilityEnumType;
export type MutabilityEnumType = OCPP2_0_1.MutabilityEnumType;
export const ReserveNowStatusEnumType = OCPP2_0_1.ReserveNowStatusEnumType;
export type ReserveNowStatusEnumType = OCPP2_0_1.ReserveNowStatusEnumType;
export const ConnectorEnumType = OCPP2_0_1.ConnectorEnumType;
export type ConnectorEnumType = OCPP2_0_1.ConnectorEnumType;
export const MessageStateEnumType = OCPP2_0_1.MessageStateEnumType;
export type MessageStateEnumType = OCPP2_0_1.MessageStateEnumType;
export const MessagePriorityEnumType = OCPP2_0_1.MessagePriorityEnumType;
export type MessagePriorityEnumType = OCPP2_0_1.MessagePriorityEnumType;
export const MessageFormatEnumType = OCPP2_0_1.MessageFormatEnumType;
export type MessageFormatEnumType = OCPP2_0_1.MessageFormatEnumType;
export const RecurrencyKindEnumType = OCPP2_0_1.RecurrencyKindEnumType;
export type RecurrencyKindEnumType = OCPP2_0_1.RecurrencyKindEnumType;
export const ChargingProfilePurposeEnumType =
  OCPP2_0_1.ChargingProfilePurposeEnumType;
export type ChargingProfilePurposeEnumType =
  OCPP2_0_1.ChargingProfilePurposeEnumType;
export const ChargingProfileKindEnumType =
  OCPP2_0_1.ChargingProfileKindEnumType;
export type ChargingProfileKindEnumType = OCPP2_0_1.ChargingProfileKindEnumType;
export const ChargingLimitSourceEnumType =
  OCPP2_0_1.ChargingLimitSourceEnumType;
export type ChargingLimitSourceEnumType = OCPP2_0_1.ChargingLimitSourceEnumType;
export type SetVariableResultType = OCPP2_0_1.SetVariableResultType;
export const MessageTriggerEnumType = OCPP2_0_1.MessageTriggerEnumType;
export type MessageTriggerEnumType = OCPP2_0_1.MessageTriggerEnumType;
export const SetNetworkProfileStatusEnumType =
  OCPP2_0_1.SetNetworkProfileStatusEnumType;
export type SetNetworkProfileStatusEnumType =
  OCPP2_0_1.SetNetworkProfileStatusEnumType;
export const RegistrationStatusEnumType = OCPP2_0_1.RegistrationStatusEnumType;
export type RegistrationStatusEnumType = OCPP2_0_1.RegistrationStatusEnumType;
export const ChargingRateUnitEnumType = OCPP2_0_1.ChargingRateUnitEnumType;
export type ChargingRateUnitEnumType = OCPP2_0_1.ChargingRateUnitEnumType;
export const VPNEnumType = OCPP2_0_1.VPNEnumType;
export type VPNEnumType = OCPP2_0_1.VPNEnumType;
export const OCPPVersionEnumType = OCPP2_0_1.OCPPVersionEnumType;
export type OCPPVersionEnumType = OCPP2_0_1.OCPPVersionEnumType;
export const OCPPTransportEnumType = OCPP2_0_1.OCPPTransportEnumType;
export type OCPPTransportEnumType = OCPP2_0_1.OCPPTransportEnumType;
export const OCPPInterfaceEnumType = OCPP2_0_1.OCPPInterfaceEnumType;
export type OCPPInterfaceEnumType = OCPP2_0_1.OCPPInterfaceEnumType;
export const APNAuthenticationEnumType = OCPP2_0_1.APNAuthenticationEnumType;
export type APNAuthenticationEnumType = OCPP2_0_1.APNAuthenticationEnumType;
export const InstallCertificateUseEnumType =
  OCPP2_0_1.InstallCertificateUseEnumType;
export type InstallCertificateUseEnumType =
  OCPP2_0_1.InstallCertificateUseEnumType;
export const InstallCertificateStatusEnumType =
  OCPP2_0_1.InstallCertificateStatusEnumType;
export type InstallCertificateStatusEnumType =
  OCPP2_0_1.InstallCertificateStatusEnumType;
export const GetVariableStatusEnumType = OCPP2_0_1.GetVariableStatusEnumType;
export type GetVariableStatusEnumType = OCPP2_0_1.GetVariableStatusEnumType;
export const LogEnumType = OCPP2_0_1.LogEnumType;
export type LogEnumType = OCPP2_0_1.LogEnumType;
export const GetCertificateIdUseEnumType =
  OCPP2_0_1.GetCertificateIdUseEnumType;
export type GetCertificateIdUseEnumType = OCPP2_0_1.GetCertificateIdUseEnumType;
export const ReportBaseEnumType = OCPP2_0_1.ReportBaseEnumType;
export type ReportBaseEnumType = OCPP2_0_1.ReportBaseEnumType;
export const DeleteCertificateStatusEnumType =
  OCPP2_0_1.DeleteCertificateStatusEnumType;
export type DeleteCertificateStatusEnumType =
  OCPP2_0_1.DeleteCertificateStatusEnumType;
export const OperationalStatusEnumType = OCPP2_0_1.OperationalStatusEnumType;
export type OperationalStatusEnumType = OCPP2_0_1.OperationalStatusEnumType;
export const CertificateSigningUseEnumType =
  OCPP2_0_1.CertificateSigningUseEnumType;
export type CertificateSigningUseEnumType =
  OCPP2_0_1.CertificateSigningUseEnumType;
export const CertificateSignedStatusEnumType =
  OCPP2_0_1.CertificateSignedStatusEnumType;
export type CertificateSignedStatusEnumType =
  OCPP2_0_1.CertificateSignedStatusEnumType;
