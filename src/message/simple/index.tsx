import React from 'react';
import { RemoteStop, RemoteStopProps } from '../remote-stop';
import { SetVariables } from '../set-variables';
import { TriggerMessage, TriggerMessageProps } from '../trigger-message';
import { GetBaseReport } from '../get-base-report';
import { ClearCache } from '../clear-cache';
import { ChangeAvailability } from '../change-availability';
import { GetLog } from '../get-log';
import { UnlockConnector } from '../unlock-connector';
import { ResetChargingStation } from '../reset';
import { RemoteStart } from '../remote-start';
import { GetVariables } from '../get-variables';
import { InstallCertificate } from '../install-certificate';
import { GetInstalledCertificateIds } from '../get-installed-certificate-ids';
import { SetNetworkProfile } from '../set-network-profile';
import {
  CertificateSigned,
  CertificateSignedProps,
} from '../certificate-signed';
import { ChargingStations } from '../../graphql/schema.types';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import { CustomAction } from '@interfaces';

const chargingStationActionMap: {
  [label: string]: React.FC<any>;
} = {
  'Remote Stop': RemoteStop as React.FC<RemoteStopProps>,
  'Set Variables': SetVariables as React.FC,
  'Trigger Message': TriggerMessage as React.FC<TriggerMessageProps>,
  'Get Base Report': GetBaseReport as React.FC,
  'Clear Cache': ClearCache as React.FC,
  'Change Availability': ChangeAvailability as React.FC,
  'Get Log': GetLog as React.FC,
  'Unlock Connector': UnlockConnector as React.FC,
  Reset: ResetChargingStation as React.FC,
  'Remote Start': RemoteStart as React.FC,
  'Get Variables': GetVariables as React.FC,
  'Install Certificate': InstallCertificate as React.FC,
  'Get Installed Certificate IDs': GetInstalledCertificateIds as React.FC,
  'Set network profile': SetNetworkProfile as React.FC,
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
