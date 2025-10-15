// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import './style.scss';
import { Flex, Spin } from 'antd';
import { Gauge } from './gauge';
import React, { useState } from 'react';
import { useGqlCustom } from '@util/use-gql-custom';
import { GET_CHARGING_STATIONS_WITH_LOCATION_AND_LATEST_STATUS_NOTIFICATIONS_AND_TRANSACTIONS } from '../queries';
import { ChargingStationDto } from '../../../dtos/charging.station.dto';
import { ChargerRow } from '../charger.row';
import { AnimatePresence, motion } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { plainToInstance } from 'class-transformer';
import { CanAccess } from '@refinedev/core';
import { ResourceType, ActionType } from '@util/auth';
import { ChargingStateEnumType, ConnectorStatusEnumType } from '@OCPP2_0_1';
import {
  IChargingStationDto,
  ILatestStatusNotificationDto,
  ITransactionDto,
  IEvseDto,
} from '@citrineos/base';
import { LatestStatusNotificationDto } from '../../../dtos/latest.status.notification.dto';

export enum ChargerStatusEnum {
  CHARGING = 'Charging',
  CHARGING_SUSPENDED = 'Charging Suspended',
  AVAILABLE = 'Available',
  UNAVAILABLE = 'Unavailable',
  FAULTED = 'Faulted',
  OFFLINE = 'Offline',
  ONLINE = 'Online',
}

interface ChargerItem {
  station: IChargingStationDto;
  evse: IEvseDto;
  lastStatus?: ChargerStatusEnum;
}

const statusPriority: Record<ChargerStatusEnum, number> = {
  [ChargerStatusEnum.AVAILABLE]: 1,
  [ChargerStatusEnum.CHARGING]: 2,
  [ChargerStatusEnum.CHARGING_SUSPENDED]: 3,
  [ChargerStatusEnum.UNAVAILABLE]: 4,
  [ChargerStatusEnum.FAULTED]: 5,
  [ChargerStatusEnum.OFFLINE]: 6,
  [ChargerStatusEnum.ONLINE]: 7,
};

interface OnlineStatusCounts {
  [ChargerStatusEnum.CHARGING]: { count: number; items: Array<ChargerItem> };
  [ChargerStatusEnum.CHARGING_SUSPENDED]: {
    count: number;
    items: Array<ChargerItem>;
  };
  [ChargerStatusEnum.AVAILABLE]: { count: number; items: Array<ChargerItem> };
  [ChargerStatusEnum.UNAVAILABLE]: { count: number; items: Array<ChargerItem> };
  [ChargerStatusEnum.FAULTED]: { count: number; items: Array<ChargerItem> };
  [ChargerStatusEnum.OFFLINE]: { count: number; items: Array<ChargerItem> };
  [ChargerStatusEnum.ONLINE]: { count: number; items: Array<ChargerItem> };
}

const aggregateOnlineStatusCounts = (
  finalCounts: OnlineStatusCounts,
  stationCounts: OnlineStatusCounts,
): void => {
  Object.values(ChargerStatusEnum).forEach((status) => {
    finalCounts[status].count += stationCounts[status].count;
    stationCounts[status].items.forEach((item) =>
      finalCounts[status].items.push(item),
    );
  });
};

const getNewCounts = (): OnlineStatusCounts => ({
  [ChargerStatusEnum.CHARGING]: { count: 0, items: [] },
  [ChargerStatusEnum.CHARGING_SUSPENDED]: { count: 0, items: [] },
  [ChargerStatusEnum.AVAILABLE]: { count: 0, items: [] },
  [ChargerStatusEnum.UNAVAILABLE]: { count: 0, items: [] },
  [ChargerStatusEnum.FAULTED]: { count: 0, items: [] },
  [ChargerStatusEnum.OFFLINE]: { count: 0, items: [] },
  [ChargerStatusEnum.ONLINE]: { count: 0, items: [] },
});

const getOnlineStatusCountsForStation = (
  chargingStation: IChargingStationDto,
): OnlineStatusCounts => {
  chargingStation = plainToInstance(
    ChargingStationDto,
    chargingStation,
  ) as IChargingStationDto;
  const counts: OnlineStatusCounts = getNewCounts();

  chargingStation.evses?.forEach((evse: IEvseDto) => {
    const latestStatusNotification: LatestStatusNotificationDto = (
      chargingStation as any
    ).latestStatusNotifications?.find(
      (latest: LatestStatusNotificationDto) =>
        latest.statusNotification &&
        (latest.statusNotification.evseId === null ||
          latest.statusNotification.evseId === evse.evseTypeId),
      //   &&
      // latest.statusNotification.connectorId === evse.connectorId,
    );

    // Use type guard to filter for ILatestStatusNotificationDto, but do not cast
    // const statusNotifications = (
    //   chargingStation.statusNotifications || []
    // ).filter(isLatestStatusNotificationDto);
    // Find the latest status notification for this EVSE and its first connector
    // const latestStatus = statusNotifications.find(
    //   (status) =>
    //     status &&
    //     (status.evseId === undefined || status.evseId === evse.id) &&
    //     status.connectorId === evse.connectors?.[0]?.id,
    // );

    if (latestStatusNotification) {
      const status =
        latestStatusNotification.statusNotification!.connectorStatus;

      const chargerStatus = connectorStatusToChargerStatus(status);

      if (chargingStation.isOnline !== true) {
        counts[ChargerStatusEnum.OFFLINE].count++;
        counts[ChargerStatusEnum.OFFLINE].items.push({
          station: chargingStation,
          evse,
          lastStatus: chargerStatus,
        });
      } else {
        counts[chargerStatus].count++;
        counts[chargerStatus].items.push({
          station: chargingStation,
          evse,
          lastStatus: chargerStatus,
        });
      }
    } else {
      if (chargingStation.isOnline !== true) {
        counts[ChargerStatusEnum.OFFLINE].count++;
        counts[ChargerStatusEnum.OFFLINE].items.push({
          station: chargingStation,
          evse,
        });
      } else {
        counts[ChargerStatusEnum.UNAVAILABLE].count++;
        counts[ChargerStatusEnum.UNAVAILABLE].items.push({
          station: chargingStation,
          evse,
        });
      }
    }
  });

  return counts;
};

function connectorStatusToChargerStatus(
  connectorStatus: ConnectorStatusEnumType,
): ChargerStatusEnum {
  switch (connectorStatus) {
    case ConnectorStatusEnumType.Available:
      return ChargerStatusEnum.AVAILABLE;

    case ConnectorStatusEnumType.Preparing:
    case ConnectorStatusEnumType.Charging:
    case ConnectorStatusEnumType.Finishing:
    case ConnectorStatusEnumType.SuspendedEV:
    case ConnectorStatusEnumType.SuspendedEVSE:
    case ConnectorStatusEnumType.Occupied:
      // const activeTx = chargingStation.transactions?.find(
      //   (tx: ITransactionDto) => tx.evseId === evse.id,
      // );
      // if (activeTx) {
      //   if (activeTx.chargingState === ChargingStateEnumType.Charging) {
      //     return ChargerStatusEnum.CHARGING;
      //   } else {
      //     return ChargerStatusEnum.CHARGING_SUSPENDED;
      //   }
      // }
      return ChargerStatusEnum.CHARGING;

    case ConnectorStatusEnumType.Faulted:
      return ChargerStatusEnum.FAULTED;

    case ConnectorStatusEnumType.Unavailable:
    default:
      return ChargerStatusEnum.UNAVAILABLE;
  }
}

export const ChargerActivityCard: React.FC = () => {
  const [selectedStatus, setSelectedStatus] =
    useState<ChargerStatusEnum | null>(null);
  const [selectedItems, setSelectedItems] = useState<Array<ChargerItem>>([]);

  const { data, isLoading, error } = useGqlCustom({
    gqlQuery:
      GET_CHARGING_STATIONS_WITH_LOCATION_AND_LATEST_STATUS_NOTIFICATIONS_AND_TRANSACTIONS,
  });

  const stations: IChargingStationDto[] = data?.data.ChargingStations || [];

  if (isLoading) return <Spin />;
  if (error) return <p>Error loading counts</p>;

  const finalCounts = getNewCounts();
  stations.forEach((station) => {
    aggregateOnlineStatusCounts(
      finalCounts,
      getOnlineStatusCountsForStation(station),
    );
  });

  const total = Object.values(ChargerStatusEnum).reduce(
    (sum, status) => sum + finalCounts[status].count,
    0,
  );

  const handleGaugeClick = (status: ChargerStatusEnum) => {
    setSelectedStatus(status);

    const sortedItemArray = Array.from(finalCounts[status].items).sort(
      (a, b) => {
        if (!a.lastStatus && !b.lastStatus) return 0;
        if (!a.lastStatus) return 1; // undefined goes last
        if (!b.lastStatus) return -1;

        return statusPriority[a.lastStatus] - statusPriority[b.lastStatus];
      },
    );
    setSelectedItems(sortedItemArray);
  };

  const handleClose = () => {
    setSelectedStatus(null);
    setSelectedItems([]);
  };

  return (
    <CanAccess
      resource={ResourceType.CHARGING_STATIONS}
      action={ActionType.LIST}
    >
      <Flex vertical gap={32} style={{ height: '100%' }}>
        <h4>Charger Activity</h4>
        <Flex gap={8} flex={1}>
          {[
            ChargerStatusEnum.CHARGING,
            ChargerStatusEnum.AVAILABLE,
            ChargerStatusEnum.UNAVAILABLE,
            ChargerStatusEnum.FAULTED,
            ChargerStatusEnum.OFFLINE,
          ].map((status) => (
            <Flex
              key={status}
              vertical
              align="center"
              flex={1}
              onClick={() => handleGaugeClick(status)}
              style={{ cursor: 'pointer' }}
            >
              <Gauge
                percentage={Math.round(
                  (finalCounts[status].count / total) * 100,
                )}
                color={getStatusColor(status)}
              />
              <span className={selectedStatus === status ? 'link' : ''}>
                {status}
              </span>
            </Flex>
          ))}
        </Flex>

        <AnimatePresence mode="wait">
          {selectedStatus && (
            <motion.div
              key={selectedStatus}
              initial={{ opacity: 0, maxHeight: 0 }}
              animate={{ opacity: 1, maxHeight: 200 }}
              exit={{ opacity: 0, maxHeight: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{ overflowY: 'auto', minHeight: 25 }}
            >
              <Flex vertical gap={16}>
                <Flex
                  justify="space-between"
                  align="center"
                  style={{ borderBottom: '1px solid var(--grayscale-color-0)' }}
                >
                  <h4>{selectedStatus} chargers</h4>
                  <IoClose
                    onClick={handleClose}
                    size={20}
                    style={{ cursor: 'pointer' }}
                  />
                </Flex>

                {Array.from(selectedItems).length > 0 ? (
                  Array.from(selectedItems).map((item) => (
                    <ChargerRow
                      key={`${item.station.id}-${item.evse.connectors?.[0]?.id}`}
                      chargingStation={item.station}
                      evse={item.evse}
                      lastStatus={item.lastStatus}
                    />
                  ))
                ) : (
                  <Flex
                    align="center"
                    justify="center"
                    style={{ padding: '16px 0' }}
                  >
                    <span>
                      No chargers currently have {selectedStatus} status
                    </span>
                  </Flex>
                )}
              </Flex>
            </motion.div>
          )}
        </AnimatePresence>
      </Flex>
    </CanAccess>
  );
};

export const getStatusColor = (status: ChargerStatusEnum): string => {
  const colors: Record<ChargerStatusEnum, string> = {
    [ChargerStatusEnum.AVAILABLE]: '#00C999',
    [ChargerStatusEnum.UNAVAILABLE]: '#F6962E',
    [ChargerStatusEnum.CHARGING]: '#008CC0',
    [ChargerStatusEnum.CHARGING_SUSPENDED]: '#FFC107',
    [ChargerStatusEnum.FAULTED]: '#000000',
    [ChargerStatusEnum.OFFLINE]: '#F61631',
    [ChargerStatusEnum.ONLINE]: '#00C999',
  };
  return colors[status];
};
