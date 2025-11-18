// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import {
  type ChargingStationDto,
  type ConnectorStatusEnumType,
  type EvseDto,
  ConnectorStatusEnum,
} from '@citrineos/base';
import { Loader } from '@lib/client/components/ui/loader';
import { Gauge } from '@lib/client/pages/overview/charger-activity/gauge';
import { ChargerRow } from '@lib/client/pages/overview/charger.row';
import { ChargingStationClass } from '@lib/cls/charging.station.dto';
import { LatestStatusNotificationClass } from '@lib/cls/latest.status.notification.dto';
import { GET_CHARGING_STATIONS_WITH_LOCATION_AND_LATEST_STATUS_NOTIFICATIONS_AND_TRANSACTIONS } from '@lib/queries/charging.stations';
import { ActionType, ResourceType } from '@lib/utils/access.types';
import { useGqlCustom } from '@lib/utils/use-gql-custom';
import { CanAccess } from '@refinedev/core';
import { plainToInstance } from 'class-transformer';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import React, { useState } from 'react';

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
  station: ChargingStationDto;
  evse: EvseDto;
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
  chargingStation: ChargingStationDto,
): OnlineStatusCounts => {
  chargingStation = plainToInstance(
    ChargingStationClass,
    chargingStation,
  ) as ChargingStationDto;
  const counts: OnlineStatusCounts = getNewCounts();

  chargingStation.evses?.forEach((evse: EvseDto) => {
    const latestStatusNotification: LatestStatusNotificationClass = (
      chargingStation as any
    ).latestStatusNotifications?.find(
      (latest: LatestStatusNotificationClass) =>
        latest.statusNotification &&
        (latest.statusNotification.evseId === null ||
          latest.statusNotification.evseId === evse.evseTypeId),
      //   &&
      // latest.statusNotification.connectorId === evse.connectorId,
    );

    // Use type guard to filter for LatestStatusNotificationDto, but do not cast
    // const statusNotifications = (
    //   chargingStation.statusNotifications || []
    // ).filter(sLatestStatusNotificationDto);
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
  connectorStatus: ConnectorStatusEnumType | string,
): ChargerStatusEnum {
  switch (connectorStatus) {
    case ConnectorStatusEnum.Available:
      return ChargerStatusEnum.AVAILABLE;

    case ConnectorStatusEnum.Preparing:
    case ConnectorStatusEnum.Charging:
    case ConnectorStatusEnum.Finishing:
    case ConnectorStatusEnum.SuspendedEV:
    case ConnectorStatusEnum.SuspendedEVSE:
    case 'Occupied': // To handle possible string enum from different OCPP versions
      // const activeTx = chargingStation.transactions?.find(
      //   (tx: TransactionDto) => tx.evseId === evse.id,
      // );
      // if (activeTx) {
      //   if (activeTx.chargingState === ChargingStateEnumType.Charging) {
      //     return ChargerStatusEnum.CHARGING;
      //   } else {
      //     return ChargerStatusEnum.CHARGING_SUSPENDED;
      //   }
      // }
      return ChargerStatusEnum.CHARGING;

    case ConnectorStatusEnum.Faulted:
      return ChargerStatusEnum.FAULTED;

    case ConnectorStatusEnum.Unavailable:
    default:
      return ChargerStatusEnum.UNAVAILABLE;
  }
}

export const ChargerActivityCard: React.FC = () => {
  const [selectedStatus, setSelectedStatus] =
    useState<ChargerStatusEnum | null>(null);
  const [selectedItems, setSelectedItems] = useState<Array<ChargerItem>>([]);

  const {
    query: { data, isLoading, error },
  } = useGqlCustom({
    gqlQuery:
      GET_CHARGING_STATIONS_WITH_LOCATION_AND_LATEST_STATUS_NOTIFICATIONS_AND_TRANSACTIONS,
  });

  const stations: ChargingStationDto[] = data?.data.ChargingStations || [];

  if (isLoading) return <Loader />;
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
      <div className="flex flex-col gap-8 h-full">
        <h4 className="text-lg font-semibold">Charger Activity</h4>
        <div className="flex gap-2 flex-1">
          {[
            ChargerStatusEnum.CHARGING,
            ChargerStatusEnum.AVAILABLE,
            ChargerStatusEnum.UNAVAILABLE,
            ChargerStatusEnum.FAULTED,
            ChargerStatusEnum.OFFLINE,
          ].map((status) => (
            <div
              key={status}
              className="flex flex-col items-center flex-1 cursor-pointer"
              onClick={() => handleGaugeClick(status)}
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
            </div>
          ))}
        </div>

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
              <div className="flex flex-col gap-4">
                <div
                  className="flex justify-between items-center border-b"
                  style={{ borderColor: 'var(--grayscale-color-0)' }}
                >
                  <h4 className="text-lg font-semibold">
                    {selectedStatus} chargers
                  </h4>
                  <X
                    onClick={handleClose}
                    size={20}
                    className="cursor-pointer"
                  />
                </div>

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
                  <div className="flex items-center justify-center py-4">
                    <span>
                      No chargers currently have {selectedStatus} status
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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
