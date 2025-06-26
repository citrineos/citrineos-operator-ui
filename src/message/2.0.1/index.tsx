// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import { RemoteStop, RemoteStopProps } from './remote-stop';
import { CustomAction } from '../../components/custom-actions';
import { SetVariables, SetVariablesProps } from './set-variables';
import { TriggerMessage, TriggerMessageProps } from './trigger-message';
import { GetBaseReport, GetBaseReportProps } from './get-base-report';
import { ClearCache, ClearCacheProps } from './clear-cache';
import { ChangeAvailability } from './change-availability';
import { GetLog, GetLogProps } from './get-log';
import { UpdateFirmware, UpdateFirmwareProps } from './update-firmware';
import { UnlockConnector, UnlockConnectorProps } from './unlock-connector';
import React from 'react';
import { GetVariables, GetVariablesProps } from './get-variables';
import { CustomerInformation } from './customer-information';
import { ResetChargingStation, ResetChargingStationProps } from './reset';
import { RemoteStart, RemoteStartProps } from './remote-start';
import {
  InstallCertificate,
  InstallCertificateProps,
} from './install-certificate';
import {
  GetInstalledCertificateIds,
  GetInstalledCertificateIdsProps,
} from './get-installed-certificate-ids';
import {
  SetNetworkProfile,
  SetNetworkProfileProps,
} from './set-network-profile';
import {
  CertificateSigned,
  CertificateSignedProps,
} from './certificate-signed';
import {
  GetTransactionStatus,
  GetTransactionStatusProps,
} from './get-transaction-status';
import { setSelectedChargingStation } from '../../redux/selected.charging.station.slice';
import { instanceToPlain } from 'class-transformer';
import { GetCustomerProps } from '../../model/CustomerInformation';
import {
  UpdateAuthPassword,
  UpdateAuthPasswordProps,
} from './update-auth-password';
import {
  DeleteStationNetworkProfiles,
  DeleteStationNetworkProfilesProps,
} from './delete-station-network-profiles';
import { DeleteCertificate } from './delete-certificate';
import { ChangeAvailabilityProps } from './change-availability';

export const chargingStationActionMap: {
  [label: string]: React.FC<any>;
} = {
  'Certificate Signed': CertificateSigned as React.FC<CertificateSignedProps>,
  'Change Availability':
    ChangeAvailability as React.FC<ChangeAvailabilityProps>,
  'Clear Cache': ClearCache as React.FC<ClearCacheProps>,
  'Customer Information': CustomerInformation as React.FC<GetCustomerProps>,
  'Delete Certificate': DeleteCertificate as React.FC<InstallCertificateProps>,
  'Delete Station Network Profiles':
    DeleteStationNetworkProfiles as React.FC<DeleteStationNetworkProfilesProps>,
  'Get Base Report': GetBaseReport as React.FC<GetBaseReportProps>,
  'Get Installed Certificate IDs':
    GetInstalledCertificateIds as React.FC<GetInstalledCertificateIdsProps>,
  'Get Log': GetLog as React.FC<GetLogProps>,
  'Get Transaction Status':
    GetTransactionStatus as React.FC<GetTransactionStatusProps>,
  'Get Variables': GetVariables as React.FC<GetVariablesProps>,
  'Install Certificate':
    InstallCertificate as React.FC<InstallCertificateProps>,
  'Remote Start': RemoteStart as React.FC<RemoteStartProps>,
  'Remote Stop': RemoteStop as React.FC<RemoteStopProps>,
  Reset: ResetChargingStation as React.FC<ResetChargingStationProps>,
  'Set Network Profile': SetNetworkProfile as React.FC<SetNetworkProfileProps>,
  'Set Variables': SetVariables as React.FC<SetVariablesProps>,
  'Trigger Message': TriggerMessage as React.FC<TriggerMessageProps>,
  'Unlock Connector': UnlockConnector as React.FC<UnlockConnectorProps>,
  'Update Firmware': UpdateFirmware as React.FC<UpdateFirmwareProps>,
  'Update Auth Password':
    UpdateAuthPassword as React.FC<UpdateAuthPasswordProps>,
};

export const CUSTOM_CHARGING_STATION_ACTIONS: CustomAction<ChargingStation>[] =
  Object.entries(chargingStationActionMap)
    .map(
      ([label, Component]) =>
        ({
          label,
          execOrRender: (station: ChargingStation, _setLoading, dispatch) => {
            dispatch(
              setSelectedChargingStation({
                selectedChargingStation: JSON.stringify(
                  instanceToPlain(station),
                ),
              }),
            );
            return <Component station={station} />;
          },
        }) as CustomAction<ChargingStation>,
    )
    .sort((a, b) => a.label.localeCompare(b.label));

export const ADMIN_CHARGING_STATION_ACTIONS: string[] = [
  'Update Auth Password',
];
