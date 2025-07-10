// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import {
  ChangeAvailability,
  ChangeAvailabilityProps,
} from './change-availability';
import {
  ChangeConfiguration,
  ChangeConfigurationProps,
} from './change-configuration';
import { GetConfiguration, GetConfigurationProps } from './get-configuration';
import {
  RemoteStartTransaction,
  RemoteStartTransactionProps,
} from './remote-start-transaction';
import {
  RemoteStopTransaction,
  RemoteStopTransactionProps,
} from './remote-stop-transaction';
import { ResetChargingStation, ResetChargingStationProps } from './reset';
import { TriggerMessage, TriggerMessageProps } from './trigger-message';
import { UpdateFirmware, UpdateFirmwareProps } from './update-firmware';
import { CustomAction } from '../../components/custom-actions';
import { setSelectedChargingStation } from '../../redux/selected.charging.station.slice';
import { instanceToPlain } from 'class-transformer';

export const chargingStationActionMap: {
  [label: string]: React.FC<any>;
} = {
  'Change Availability':
    ChangeAvailability as React.FC<ChangeAvailabilityProps>,
  'Remote Start':
    RemoteStartTransaction as React.FC<RemoteStartTransactionProps>,
  'Remote Stop': RemoteStopTransaction as React.FC<RemoteStopTransactionProps>,
  Reset: ResetChargingStation as React.FC<ResetChargingStationProps>,
  'Change Configuration':
    ChangeConfiguration as React.FC<ChangeConfigurationProps>,
  'Get Configuration': GetConfiguration as React.FC<GetConfigurationProps>,
  'Trigger Message': TriggerMessage as React.FC<TriggerMessageProps>,
  'Update Firmware': UpdateFirmware as React.FC<UpdateFirmwareProps>,
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
