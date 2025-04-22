import './style.scss';
import { Flex, Spin } from 'antd';
import { Gauge } from './gauge';
import React, { useState } from 'react';
import { useGqlCustom } from '@util/use-gql-custom';
import { GET_CHARGING_STATIONS_WITH_LOCATION_AND_LATEST_STATUS_NOTIFICATIONS_AND_TRANSACTIONS } from '../queries';
import { Evse } from '../../evses/Evse';
import { ChargingStateEnumType, ConnectorStatusEnumType } from '@OCPP2_0_1';
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

export enum ChargerStatusEnum {
  CHARGING = 'Charging',
  CHARGING_SUSPENDED = 'Charging Suspended',
  AVAILABLE = 'Available',
  UNAVAILABLE = 'Unavailable',
  FAULTED = 'Faulted',
}

interface OnlineStatusCounts {
  [ChargerStatusEnum.CHARGING]: {
    count: number;
    chargingStations: Set<ChargingStationDto>;
  };
  [ChargerStatusEnum.CHARGING_SUSPENDED]: {
    count: number;
    chargingStations: Set<ChargingStationDto>;
  };
  [ChargerStatusEnum.AVAILABLE]: {
    count: number;
    chargingStations: Set<ChargingStationDto>;
  };
  [ChargerStatusEnum.UNAVAILABLE]: {
    count: number;
    chargingStations: Set<ChargingStationDto>;
  };
  [ChargerStatusEnum.FAULTED]: {
    count: number;
    chargingStations: Set<ChargingStationDto>;
  };
}

const aggregateOnlineStatusCounts = (
  finalCounts: OnlineStatusCounts,
  stationCounts: OnlineStatusCounts,
): void => {
  for (const status of Object.values(ChargerStatusEnum)) {
    finalCounts[status].count += stationCounts[status].count;
    finalCounts[status].chargingStations = new Set([
      ...finalCounts[status].chargingStations,
      ...stationCounts[status].chargingStations,
    ]);
  }
};

const getNewCounts = (): OnlineStatusCounts => ({
  [ChargerStatusEnum.CHARGING]: {
    count: 0,
    chargingStations: new Set(),
  },
  [ChargerStatusEnum.CHARGING_SUSPENDED]: {
    count: 0,
    chargingStations: new Set(),
  },
  [ChargerStatusEnum.AVAILABLE]: {
    count: 0,
    chargingStations: new Set(),
  },
  [ChargerStatusEnum.UNAVAILABLE]: {
    count: 0,
    chargingStations: new Set(),
  },
  [ChargerStatusEnum.FAULTED]: {
    count: 0,
    chargingStations: new Set(),
  },
});

const getOnlineStatusCountsForStation = (
  chargingStation: ChargingStationDto,
) => {
  chargingStation = plainToInstance(ChargingStationDto, chargingStation);
  const counts: OnlineStatusCounts = getNewCounts();
  const evses = chargingStation.evses;
  if (evses && evses.length > 0) {
    for (const evse of evses) {
      const latestStatusNotificationForEvse =
        chargingStation.latestStatusNotifications?.find(
          (latestStatusNotification: LatestStatusNotificationDto) =>
            latestStatusNotification.statusNotification &&
            (latestStatusNotification.statusNotification.evseId === undefined ||
              latestStatusNotification.statusNotification.evseId === evse.id) &&
            latestStatusNotification.statusNotification.connectorId ===
              evse.connectorId,
        );
      if (latestStatusNotificationForEvse) {
        const connectorStatus =
          latestStatusNotificationForEvse.statusNotification?.connectorStatus;
        switch (connectorStatus) {
          case ConnectorStatusEnumType.Available:
            counts[ChargerStatusEnum.AVAILABLE].count++;
            counts[ChargerStatusEnum.AVAILABLE].chargingStations.add(
              chargingStation,
            );
            break;
          case ConnectorStatusEnumType.Occupied: {
            const activeTransaction = chargingStation.transactions?.find(
              (transaction: TransactionDto) =>
                transaction.evseDatabaseId === evse.databaseId,
            );
            if (activeTransaction) {
              const chargingState = activeTransaction.chargingState;
              if (chargingState === ChargingStateEnumType.Charging) {
                counts[ChargerStatusEnum.CHARGING].count++;
                counts[ChargerStatusEnum.CHARGING].chargingStations.add(
                  chargingStation,
                );
              } else {
                counts[ChargerStatusEnum.CHARGING_SUSPENDED].count++;
                counts[
                  ChargerStatusEnum.CHARGING_SUSPENDED
                ].chargingStations.add(chargingStation);
              }
            }
            break;
          }
          case ConnectorStatusEnumType.Faulted:
            counts[ChargerStatusEnum.FAULTED].count++;
            counts[ChargerStatusEnum.FAULTED].chargingStations.add(
              chargingStation,
            );
            break;
          case ConnectorStatusEnumType.Unavailable:
            counts[ChargerStatusEnum.UNAVAILABLE].count++;
            counts[ChargerStatusEnum.UNAVAILABLE].chargingStations.add(
              chargingStation,
            );
            break;
          case ConnectorStatusEnumType.Reserved:
          default:
            // no handling
            break;
        }
      } else {
        counts[ChargerStatusEnum.UNAVAILABLE].count++;
        counts[ChargerStatusEnum.UNAVAILABLE].chargingStations.add(
          chargingStation,
        );
      }
    }
  }
  return counts;
};

export const ChargerActivityCard = () => {
  const [selectedStatus, setSelectedStatus] =
    useState<ChargerStatusEnum | null>(null);
  const [selectedChargingStations, setSelectedChargingStations] = useState<
    Set<ChargingStationDto>
  >(new Set());

  const { data, isLoading, error } = useGqlCustom({
    gqlQuery:
      GET_CHARGING_STATIONS_WITH_LOCATION_AND_LATEST_STATUS_NOTIFICATIONS_AND_TRANSACTIONS,
  });

  const chargingStations: ChargingStationDto[] =
    data?.data.ChargingStations || [];

  if (isLoading) return <Spin />;
  if (error) return <p>Error loading counts</p>;

  const final: OnlineStatusCounts = getNewCounts();

  for (const chargingStation of chargingStations) {
    aggregateOnlineStatusCounts(
      final,
      getOnlineStatusCountsForStation(chargingStation),
    );
  }

  const total =
    final[ChargerStatusEnum.AVAILABLE].count +
    final[ChargerStatusEnum.UNAVAILABLE].count +
    final[ChargerStatusEnum.CHARGING].count +
    final[ChargerStatusEnum.CHARGING_SUSPENDED].count +
    final[ChargerStatusEnum.FAULTED].count;

  const handleGaugeClick = (status: ChargerStatusEnum) => {
    setSelectedStatus(status);
    setSelectedChargingStations(new Set(final[status].chargingStations));
  };

  const handleClose = () => {
    setSelectedStatus(null);
    setSelectedChargingStations(new Set());
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
          ].map((status, index) => (
            <Flex
              key={index}
              vertical
              align="center"
              flex={1}
              onClick={() => handleGaugeClick(status)}
              style={{ cursor: 'pointer' }}
            >
              <Gauge
                percentage={Math.round((final[status].count / total) * 100)}
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
                {Array.from(selectedChargingStations).length > 0 ? (
                  Array.from(selectedChargingStations).map(
                    (chargingStation) => (
                      <ChargerRow
                        key={chargingStation.id}
                        chargingStation={chargingStation}
                        circleColor={getGaugeColor(selectedStatus)}
                      />
                    ),
                  )
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

// todo should be scss vars
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
