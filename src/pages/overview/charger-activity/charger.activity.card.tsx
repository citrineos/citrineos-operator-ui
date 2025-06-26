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
import { TransactionDto } from 'src/dtos/transaction.dto';
import { EvseDto } from 'src/dtos/evse.dto';
import { plainToInstance } from 'class-transformer';
import { LatestStatusNotificationDto } from 'src/dtos/latest.status.notification.dto';
import { CanAccess } from '@refinedev/core';
import { ResourceType, ActionType } from '@util/auth';
import { ChargingStateEnumType, ConnectorStatusEnumType } from '@OCPP2_0_1';

export enum ChargerStatusEnum {
  CHARGING = 'Charging',
  CHARGING_SUSPENDED = 'Charging Suspended',
  AVAILABLE = 'Available',
  UNAVAILABLE = 'Unavailable',
  FAULTED = 'Faulted',
}

interface ChargerItem {
  station: ChargingStationDto;
  evse: EvseDto;
}

interface OnlineStatusCounts {
  [ChargerStatusEnum.CHARGING]: { count: number; items: Set<ChargerItem> };
  [ChargerStatusEnum.CHARGING_SUSPENDED]: {
    count: number;
    items: Set<ChargerItem>;
  };
  [ChargerStatusEnum.AVAILABLE]: { count: number; items: Set<ChargerItem> };
  [ChargerStatusEnum.UNAVAILABLE]: { count: number; items: Set<ChargerItem> };
  [ChargerStatusEnum.FAULTED]: { count: number; items: Set<ChargerItem> };
}

const aggregateOnlineStatusCounts = (
  finalCounts: OnlineStatusCounts,
  stationCounts: OnlineStatusCounts,
): void => {
  Object.values(ChargerStatusEnum).forEach((status) => {
    finalCounts[status].count += stationCounts[status].count;
    stationCounts[status].items.forEach((item) =>
      finalCounts[status].items.add(item),
    );
  });
};

const getNewCounts = (): OnlineStatusCounts => ({
  [ChargerStatusEnum.CHARGING]: { count: 0, items: new Set() },
  [ChargerStatusEnum.CHARGING_SUSPENDED]: { count: 0, items: new Set() },
  [ChargerStatusEnum.AVAILABLE]: { count: 0, items: new Set() },
  [ChargerStatusEnum.UNAVAILABLE]: { count: 0, items: new Set() },
  [ChargerStatusEnum.FAULTED]: { count: 0, items: new Set() },
});

const getOnlineStatusCountsForStation = (
  chargingStation: ChargingStationDto,
): OnlineStatusCounts => {
  chargingStation = plainToInstance(ChargingStationDto, chargingStation);
  const counts: OnlineStatusCounts = getNewCounts();

  chargingStation.evses?.forEach((evse) => {
    const latestStatus = chargingStation.latestStatusNotifications?.find(
      (latest: LatestStatusNotificationDto) =>
        latest.statusNotification &&
        (latest.statusNotification.evseId === undefined ||
          latest.statusNotification.evseId === evse.id) &&
        latest.statusNotification.connectorId === evse.connectorId,
    );

    if (latestStatus) {
      const status = latestStatus.statusNotification!.connectorStatus;
      switch (status) {
        case ConnectorStatusEnumType.Available:
          counts[ChargerStatusEnum.AVAILABLE].count++;
          counts[ChargerStatusEnum.AVAILABLE].items.add({
            station: chargingStation,
            evse,
          });
          break;

        case ConnectorStatusEnumType.Occupied: {
          const activeTx = chargingStation.transactions?.find(
            (tx: TransactionDto) => tx.evseDatabaseId === evse.databaseId,
          );
          if (activeTx) {
            if (activeTx.chargingState === ChargingStateEnumType.Charging) {
              counts[ChargerStatusEnum.CHARGING].count++;
              counts[ChargerStatusEnum.CHARGING].items.add({
                station: chargingStation,
                evse,
              });
            } else {
              counts[ChargerStatusEnum.CHARGING_SUSPENDED].count++;
              counts[ChargerStatusEnum.CHARGING_SUSPENDED].items.add({
                station: chargingStation,
                evse,
              });
            }
          }
          break;
        }

        case ConnectorStatusEnumType.Faulted:
          counts[ChargerStatusEnum.FAULTED].count++;
          counts[ChargerStatusEnum.FAULTED].items.add({
            station: chargingStation,
            evse,
          });
          break;

        case ConnectorStatusEnumType.Unavailable:
          counts[ChargerStatusEnum.UNAVAILABLE].count++;
          counts[ChargerStatusEnum.UNAVAILABLE].items.add({
            station: chargingStation,
            evse,
          });
          break;

        default:
          break;
      }
    } else {
      counts[ChargerStatusEnum.UNAVAILABLE].count++;
      counts[ChargerStatusEnum.UNAVAILABLE].items.add({
        station: chargingStation,
        evse,
      });
    }
  });

  return counts;
};

export const ChargerActivityCard: React.FC = () => {
  const [selectedStatus, setSelectedStatus] =
    useState<ChargerStatusEnum | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<ChargerItem>>(
    new Set(),
  );

  const { data, isLoading, error } = useGqlCustom({
    gqlQuery:
      GET_CHARGING_STATIONS_WITH_LOCATION_AND_LATEST_STATUS_NOTIFICATIONS_AND_TRANSACTIONS,
  });

  const stations: ChargingStationDto[] = data?.data.ChargingStations || [];

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
    setSelectedItems(new Set(finalCounts[status].items));
  };

  const handleClose = () => {
    setSelectedStatus(null);
    setSelectedItems(new Set());
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
            ChargerStatusEnum.AVAILABLE,
            ChargerStatusEnum.UNAVAILABLE,
            ChargerStatusEnum.CHARGING,
            ChargerStatusEnum.FAULTED,
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
                color={getGaugeColor(status)}
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
                      key={`${item.station.id}-${item.evse.connectorId}`}
                      chargingStation={item.station}
                      evse={item.evse}
                      circleColor={getGaugeColor(selectedStatus!)}
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

const getGaugeColor = (status: ChargerStatusEnum): string => {
  const colors: Record<ChargerStatusEnum, string> = {
    [ChargerStatusEnum.AVAILABLE]: '#00C999',
    [ChargerStatusEnum.UNAVAILABLE]: '#F6962E',
    [ChargerStatusEnum.CHARGING]: '#008CC0',
    [ChargerStatusEnum.CHARGING_SUSPENDED]: '#FFC107',
    [ChargerStatusEnum.FAULTED]: '#F61631',
  };
  return colors[status] || '#000000';
};
