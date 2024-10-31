import React from 'react';
import { RemoteStop, RemoteStopProps } from '../remote-stop';
import { SetVariables, SetVariablesProps } from '../set-variables';
import { TriggerMessage, TriggerMessageProps } from '../trigger-message';
import { GetBaseReport, GetBaseReportProps } from '../get-base-report';
import { ClearCache, ClearCacheProps } from '../clear-cache';
import { ChangeAvailability } from '../change-availability';
import { GetLog, GetLogProps } from '../get-log';
import { UnlockConnector, UnlockConnectorProps } from '../unlock-connector';
import { ResetChargingStation, ResetChargingStationProps } from '../reset';
import { RemoteStart, RemoteStartProps } from '../remote-start';
import { GetVariables, GetVariablesProps } from '../get-variables';
import {
  InstallCertificate,
  InstallCertificateProps,
} from '../install-certificate';
import {
  GetInstalledCertificateIds,
  GetInstalledCertificateIdsProps,
} from '../get-installed-certificate-ids';
import {
  SetNetworkProfile,
  SetNetworkProfileProps,
} from '../set-network-profile';
import {
  CertificateSigned,
  CertificateSignedProps,
} from '../certificate-signed';
import { CustomAction } from '../../components/custom-actions';
import { ChargingStations } from '../../graphql/schema.types';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import { ChangeAvailabilityProps } from '../change-availability/model';

const chargingStationActionMap: {
  [label: string]: React.FC<any>;
} = {
  'Remote Stop': RemoteStop as React.FC<RemoteStopProps>,
  'Set Variables': SetVariables as React.FC<SetVariablesProps>,
  'Trigger Message': TriggerMessage as React.FC<TriggerMessageProps>,
  'Get Base Report': GetBaseReport as React.FC<GetBaseReportProps>,
  'Clear Cache': ClearCache as React.FC<ClearCacheProps>,
  'Change Availability':
    ChangeAvailability as React.FC<ChangeAvailabilityProps>,
  'Get Log': GetLog as React.FC<GetLogProps>,
  'Unlock Connector': UnlockConnector as React.FC<UnlockConnectorProps>,
  Reset: ResetChargingStation as React.FC<ResetChargingStationProps>,
  'Remote Start': RemoteStart as React.FC<RemoteStartProps>,
  'Get Variables': GetVariables as React.FC<GetVariablesProps>,
  'Install Certificate':
    InstallCertificate as React.FC<InstallCertificateProps>,
  'Get Installed Certificate IDs':
    GetInstalledCertificateIds as React.FC<GetInstalledCertificateIdsProps>,
  'Set network profile': SetNetworkProfile as React.FC<SetNetworkProfileProps>,
  'Certificate Signed': CertificateSigned as React.FC<CertificateSignedProps>,
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
