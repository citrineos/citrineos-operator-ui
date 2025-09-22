// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import type { RemoteStopProps } from './remote-stop';
import { RemoteStop } from './remote-stop';
import type { CustomAction } from '../../components/custom-actions';
import type { SetVariablesProps } from './set-variables';
import { SetVariables } from './set-variables';
import type { TriggerMessageProps } from './trigger-message';
import { TriggerMessage } from './trigger-message';
import type { GetBaseReportProps } from './get-base-report';
import { GetBaseReport } from './get-base-report';
import type { ClearCacheProps } from './clear-cache';
import { ClearCache } from './clear-cache';
import type { ChangeAvailabilityProps } from './change-availability';
import { ChangeAvailability } from './change-availability';
import type { GetLogProps } from './get-log';
import { GetLog } from './get-log';
import type { UpdateFirmwareProps } from './update-firmware';
import { UpdateFirmware } from './update-firmware';
import type { UnlockConnectorProps } from './unlock-connector';
import { UnlockConnector } from './unlock-connector';
import React from 'react';
import type { GetVariablesProps } from './get-variables';
import { GetVariables } from './get-variables';
import { CustomerInformation } from './customer-information';
import type { InstallCertificateProps } from './install-certificate';
import { InstallCertificate } from './install-certificate';
import type { GetInstalledCertificateIdsProps } from './get-installed-certificate-ids';
import { GetInstalledCertificateIds } from './get-installed-certificate-ids';
import type { SetNetworkProfileProps } from './set-network-profile';
import { SetNetworkProfile } from './set-network-profile';
import type { CertificateSignedProps } from './certificate-signed';
import { CertificateSigned } from './certificate-signed';
import type { GetTransactionStatusProps } from './get-transaction-status';
import { GetTransactionStatus } from './get-transaction-status';
import { setSelectedChargingStation } from '../../redux/selected.charging.station.slice';
import { instanceToPlain } from 'class-transformer';
import type { GetCustomerProps } from './customer-information/CustomerInformation';
import type { UpdateAuthPasswordProps } from './update-auth-password';
import { UpdateAuthPassword } from './update-auth-password';
import type { DeleteStationNetworkProfilesProps } from './delete-station-network-profiles';
import { DeleteStationNetworkProfiles } from './delete-station-network-profiles';
import { DeleteCertificate } from './delete-certificate';

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
  'Remote Stop': RemoteStop as React.FC<RemoteStopProps>,
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
