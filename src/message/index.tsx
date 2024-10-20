import { ChargingStation } from '../pages/charging-stations/ChargingStation';
import { RemoteStop, RemoteStopProps } from './remote-stop';
import { CustomAction } from '../components/custom-actions';
import { ChargingStations } from '../graphql/schema.types';
import { SetVariables, SetVariablesProps } from './set-variables';
import { TriggerMessage, TriggerMessageProps } from './trigger-message';
import { GetBaseReport, GetBaseReportProps } from './get-base-report';
import { ClearCache, ClearCacheProps } from './clear-cache';
import {
  ChangeAvailability,
  ChangeAvailabilityProps,
} from './change-availability';
import { GetLog, GetLogProps } from './get-log';
import { UpdateFirmware, UpdateFirmwareProps } from './update-firmware';
import { UnlockConnector, UnlockConnectorProps } from './unlock-connector';
import React from 'react';
import { GetVariables, GetVariablesProps } from './get-variables';
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

const chargingStationActionMap: {
  [label: string]: React.FC<any>;
} = {
  'Certificate Signed': CertificateSigned as React.FC<CertificateSignedProps>,
  'Change Availability':
    ChangeAvailability as React.FC<ChangeAvailabilityProps>,
  'Clear Cache': ClearCache as React.FC<ClearCacheProps>,
  'Get Base Report': GetBaseReport as React.FC<GetBaseReportProps>,
  'Get Installed Certificate IDs':
    GetInstalledCertificateIds as React.FC<GetInstalledCertificateIdsProps>,
  'Get Log': GetLog as React.FC<GetLogProps>,
  'Get Variables': GetVariables as React.FC<GetVariablesProps>,
  'Install Certificate':
    InstallCertificate as React.FC<InstallCertificateProps>,
  'Remote Start': RemoteStart as React.FC<RemoteStartProps>,
  'Remote Stop': RemoteStop as React.FC<RemoteStopProps>,
  'Reset': ResetChargingStation as React.FC<ResetChargingStationProps>,
  'Set Network profile': SetNetworkProfile as React.FC<SetNetworkProfileProps>,
  'Set Variables': SetVariables as React.FC<SetVariablesProps>,
  'Trigger Message': TriggerMessage as React.FC<TriggerMessageProps>,
  'Unlock Connector': UnlockConnector as React.FC<UnlockConnectorProps>,
  'Update Firmware': UpdateFirmware as React.FC<UpdateFirmwareProps>,
};

export const CUSTOM_CHARGING_STATION_ACTIONS: CustomAction<ChargingStations>[] =
  Object.entries(chargingStationActionMap)
    .map(
      ([label, Component]) =>
        ({
          label,
          execOrRender: (station: ChargingStation) => (
            <Component station={station} />
          ),
        }) as CustomAction<ChargingStations>,
    )
    .sort((a, b) => a.label.localeCompare(b.label));
