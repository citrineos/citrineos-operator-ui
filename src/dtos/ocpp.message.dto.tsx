// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { IsEnum, IsString } from 'class-validator';
import { BaseDto } from './base.dto';
import { Sortable } from '@util/decorators/Sortable';
import { TransformDate } from '@util/TransformDate';
import { OCPPVersion } from '@citrineos/base';

export enum OCPPMessageDtoProps {
  id = 'id',
  stationId = 'stationId',
  correlationId = 'correlationId',
  origin = 'origin',
  action = 'action',
  message = 'message',
  timestamp = 'timestamp',
}

export enum OCPPMessageOriginEnumType {
  CS = 'cs',
  CSMS = 'csms',
}

export enum OCPPMessageActionEnumType {
  Authorize = 'Authorize',
  BootNotification = 'BootNotification',
  CancelReservation = 'CancelReservation',
  CertificateSigned = 'CertificateSigned',
  ChangeAvailability = 'ChangeAvailability',
  ChangeConfiguration = 'ChangeConfiguration',
  ClearCache = 'ClearCache',
  ClearChargingProfile = 'ClearChargingProfile',
  ClearDisplayMessage = 'ClearDisplayMessage',
  ClearedChargingLimit = 'ClearedChargingLimit',
  ClearVariableMonitoring = 'ClearVariableMonitoring',
  CostUpdated = 'CostUpdated',
  CustomerInformation = 'CustomerInformation',
  DataTransfer = 'DataTransfer',
  DeleteCertificate = 'DeleteCertificate',
  DiagnosticsStatusNotification = 'DiagnosticsStatusNotification',
  FirmwareStatusNotification = 'FirmwareStatusNotification',
  Get15118EVCertificate = 'Get15118EVCertificate',
  GetBaseReport = 'GetBaseReport',
  GetCertificateStatus = 'GetCertificateStatus',
  GetChargingProfiles = 'GetChargingProfiles',
  GetCompositeSchedule = 'GetCompositeSchedule',
  GetConfiguration = 'GetConfiguration',
  GetDiagnostics = 'GetDiagnostics',
  GetDisplayMessages = 'GetDisplayMessages',
  GetInstalledCertificateIds = 'GetInstalledCertificateIds',
  GetLocalListVersion = 'GetLocalListVersion',
  GetLog = 'GetLog',
  GetMonitoringReport = 'GetMonitoringReport',
  GetReport = 'GetReport',
  GetTransactionStatus = 'GetTransactionStatus',
  GetVariables = 'GetVariables',
  Heartbeat = 'Heartbeat',
  InstallCertificate = 'InstallCertificate',
  LogStatusNotification = 'LogStatusNotification',
  MeterValues = 'MeterValues',
  NotifyChargingLimit = 'NotifyChargingLimit',
  NotifyCustomerInformation = 'NotifyCustomerInformation',
  NotifyDisplayMessages = 'NotifyDisplayMessages',
  NotifyEVChargingNeeds = 'NotifyEVChargingNeeds',
  NotifyEVChargingSchedule = 'NotifyEVChargingSchedule',
  NotifyEvent = 'NotifyEvent',
  NotifyMonitoringReport = 'NotifyMonitoringReport',
  NotifyReport = 'NotifyReport',
  PublishFirmware = 'PublishFirmware',
  PublishFirmwareStatusNotification = 'PublishFirmwareStatusNotification',
  RemoteStartTransaction = 'RemoteStartTransaction',
  RemoteStopTransaction = 'RemoteStopTransaction',
  ReportChargingProfiles = 'ReportChargingProfiles',
  RequestStartTransaction = 'RequestStartTransaction',
  RequestStopTransaction = 'RequestStopTransaction',
  ReservationStatusUpdate = 'ReservationStatusUpdate',
  ReserveNow = 'ReserveNow',
  Reset = 'Reset',
  SecurityEventNotification = 'SecurityEventNotification',
  SendLocalList = 'SendLocalList',
  SetChargingProfile = 'SetChargingProfile',
  SetDisplayMessage = 'SetDisplayMessage',
  SetMonitoringBase = 'SetMonitoringBase',
  SetMonitoringLevel = 'SetMonitoringLevel',
  SetNetworkProfile = 'SetNetworkProfile',
  SetVariableMonitoring = 'SetVariableMonitoring',
  SetVariables = 'SetVariables',
  SignCertificate = 'SignCertificate',
  StartTransaction = 'StartTransaction',
  StatusNotification = 'StatusNotification',
  StopTransaction = 'StopTransaction',
  TransactionEvent = 'TransactionEvent',
  TriggerMessage = 'TriggerMessage',
  UnlockConnector = 'UnlockConnector',
  UnpublishFirmware = 'UnpublishFirmware',
  UpdateFirmware = 'UpdateFirmware',
}

export class OCPPMessageDto extends BaseDto {
  @IsString()
  id!: string;

  @IsString()
  stationId!: string;

  @IsString()
  correlationId!: string;

  @IsEnum(OCPPMessageOriginEnumType)
  origin!: OCPPMessageOriginEnumType;

  @IsEnum(OCPPVersion)
  protocol!: OCPPVersion;

  @IsEnum(OCPPMessageActionEnumType)
  action?: OCPPMessageActionEnumType;

  @IsString()
  message!: any;

  @Sortable()
  @TransformDate()
  timestamp!: Date;
}
