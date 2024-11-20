import { ChargingStation } from '../pages/charging-stations/ChargingStation';
import { RemoteStop, RemoteStopProps } from './remote-stop';
import { SetVariables } from './set-variables';
import { TriggerMessage, TriggerMessageProps } from './trigger-message';
import { GetBaseReport } from './get-base-report';
import { ClearCache } from './clear-cache';
import { ChangeAvailability } from './change-availability';
import { GetLog } from './get-log';
import { UpdateFirmware } from './update-firmware';
import { UnlockConnector } from './unlock-connector';
import React from 'react';
import { GetVariables } from './get-variables';
import { CustomerInformation } from './customer-information';
import { ResetChargingStation } from './reset';
import { RemoteStart } from './remote-start';
import { InstallCertificate } from './install-certificate';
import { GetInstalledCertificateIds } from './get-installed-certificate-ids';
import { SetNetworkProfile } from './set-network-profile';
import {
  CertificateSigned,
  CertificateSignedProps,
} from './certificate-signed';
import {
  GetTransactionStatus,
  GetTransactionStatusProps,
} from './get-transaction-status';
import { UpdateAuthPassword } from './update-auth-password';
import { DeleteStationNetworkProfiles } from './delete-station-network-profiles';
import { CustomAction } from '@interfaces';
import { addSelectedChargingStation } from '@redux';
import {
  DeleteCertificate,
  DeleteCertificateProps,
} from './delete-certificate';

const chargingStationActionMap: {
  [label: string]: React.FC<any>;
} = {
  'Certificate Signed': CertificateSigned as React.FC<CertificateSignedProps>,
  'Change Availability': ChangeAvailability as React.FC,
  'Clear Cache': ClearCache as React.FC,
  'Customer Information': CustomerInformation as React.FC,
  'Delete Certificate': DeleteCertificate as React.FC<DeleteCertificateProps>,
  'Delete Station Network Profiles': DeleteStationNetworkProfiles as React.FC,
  'Get Base Report': GetBaseReport as React.FC,
  'Get Installed Certificate IDs': GetInstalledCertificateIds as React.FC,
  'Get Log': GetLog as React.FC,
  'Get Transaction Status':
    GetTransactionStatus as React.FC<GetTransactionStatusProps>,
  'Get Variables': GetVariables as React.FC,
  'Install Certificate': InstallCertificate as React.FC,
  'Remote Start': RemoteStart as React.FC,
  'Remote Stop': RemoteStop as React.FC<RemoteStopProps>,
  Reset: ResetChargingStation as React.FC,
  'Set Network Profile': SetNetworkProfile as React.FC,
  'Set Variables': SetVariables as React.FC,
  'Trigger Message': TriggerMessage as React.FC<TriggerMessageProps>,
  'Unlock Connector': UnlockConnector as React.FC,
  'Update Firmware': UpdateFirmware as React.FC,
  'Update Auth Password': UpdateAuthPassword as React.FC,
};

export const CUSTOM_CHARGING_STATION_ACTIONS: CustomAction<ChargingStation>[] =
  Object.entries(chargingStationActionMap)
    .map(
      ([label, Component]) =>
        ({
          label,
          execOrRender: (station: ChargingStation, _setLoading, dispatch) => {
            dispatch(addSelectedChargingStation([station]));
            return <Component station={station} />;
          },
        }) as CustomAction<ChargingStation>,
    )
    .sort((a, b) => a.label.localeCompare(b.label));

export const ADMIN_CHARGING_STATION_ACTIONS: string[] = [
  'Update Auth Password',
];

export const EXCLUDED_FROM_MULTI_SELECT: string[] = [
  'Remote Stop',
  'Certificate Signed',
  'Delete Certificate',
  'Get Transaction Status',
];
