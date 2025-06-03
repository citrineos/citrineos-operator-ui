// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Button, Flex, message, Tooltip, Typography } from 'antd';
import { ChargingStationIcon } from '../../../components/icons/charging.station.icon';
import {
  Link,
  useDelete,
  useList,
  useNavigation,
  useOne,
  CanAccess,
  useCan,
} from '@refinedev/core';
import { EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import React, { useCallback } from 'react';
import { ChargingStationDto } from '../../../dtos/charging.station.dto';
import { useDispatch } from 'react-redux';
import { openModal } from '../../../redux/modal.slice';
import { ModalComponentType } from '../../../AppModal';
import { instanceToPlain } from 'class-transformer';
import { formatDate } from '../../../components/timestamp-display';
import { TransactionDto } from '../../../dtos/transaction.dto';
import { ResourceType } from '@util/auth';
import { getPlainToInstanceOptions } from '@util/tables';
import { MenuSection } from '../../../components/main-menu/main.menu';
import {
  OCPPMessageDto,
  OCPPMessageDtoProps,
} from '../../../dtos/ocpp.message.dto';
import { ChargingStationStatusTag } from '../charging.station.status.tag';
import { ArrowLeftIcon } from '../../../components/icons/arrow.left.icon';
import { useLocation } from 'react-router-dom';
import {
  CHARGING_STATIONS_DELETE_MUTATION,
  CHARGING_STATIONS_GET_QUERY,
} from '../queries';
import { ActionType, ChargingStationAccessType, CommandType } from '@util/auth';

const { Text } = Typography;

export interface ChargingStationDetailCardContentProps {
  stationId: string;
  transaction?: TransactionDto;
}

export const ChargingStationDetailCardContent = ({
  stationId,
}: ChargingStationDetailCardContentProps) => {
  const { mutate } = useDelete();
  const { goBack, push } = useNavigation();
  const pageLocation = useLocation();
  const dispatch = useDispatch();

  const { data, isLoading } = useOne<ChargingStationDto>({
    resource: ResourceType.CHARGING_STATIONS,
    id: stationId,
    meta: {
      gqlQuery: CHARGING_STATIONS_GET_QUERY,
    },
    queryOptions: getPlainToInstanceOptions(ChargingStationDto, true),
  });

  const station = data?.data;

  const { data: latestLogsData } = useList<OCPPMessageDto>({
    resource: ResourceType.OCPP_MESSAGES,
    meta: {
      fields: [OCPPMessageDtoProps.id, OCPPMessageDtoProps.timestamp],
    },
    sorters: [{ field: OCPPMessageDtoProps.timestamp, order: 'desc' }],
    filters: [
      {
        field: OCPPMessageDtoProps.stationId,
        operator: 'eq',
        value: station?.id,
      },
    ],
    pagination: {
      pageSize: 1,
      current: 1,
    },
    queryOptions: getPlainToInstanceOptions(OCPPMessageDto),
  });

  const latestLog = latestLogsData?.data?.[0] || undefined;

  const handleDeleteClick = useCallback(() => {
    if (!station) return;

    mutate(
      {
        id: station.id.toString(),
        resource: ResourceType.CHARGING_STATIONS,
        meta: {
          gqlMutation: CHARGING_STATIONS_DELETE_MUTATION,
        },
      },
      {
        onSuccess: () => {
          push(`/${MenuSection.CHARGING_STATIONS}`);
        },
        onError: () => {
          message.error('Failed to delete charging station');
        },
      },
    );
  }, [station, mutate, push]);

  const showRemoteStartModal = useCallback(
    (station: ChargingStationDto) => {
      dispatch(
        openModal({
          title: 'Remote Start',
          modalComponentType: ModalComponentType.remoteStart,
          modalComponentProps: { station: instanceToPlain(station) },
        }),
      );
    },
    [dispatch],
  );

  const handleStopTransactionClick = useCallback(
    (station: ChargingStationDto) => {
      dispatch(
        openModal({
          title: 'Remote Stop',
          modalComponentType: ModalComponentType.remoteStop,
          modalComponentProps: {
            station: instanceToPlain(station),
          },
        }),
      );
    },
    [dispatch],
  );

  const showResetStartModal = useCallback(
    (station: ChargingStationDto) => {
      dispatch(
        openModal({
          title: 'Reset',
          modalComponentType: ModalComponentType.reset,
          modalComponentProps: { station: instanceToPlain(station) },
        }),
      );
    },
    [dispatch],
  );

  const showOtherCommandsModal = useCallback(() => {
    if (!station) return;

    dispatch(
      openModal({
        title: 'Other Commands',
        modalComponentType: ModalComponentType.otherCommands,
        modalComponentProps: { station: instanceToPlain(station) },
      }),
    );
  }, [dispatch, station]);

  if (isLoading) return <p>Loading...</p>;
  if (!station) return <p>No Data Found</p>;

  const hasActiveTransactions =
    station.transactions && station.transactions.length > 0;

  let latestTimestamp = 'N/A';
  if (latestLog) {
    latestTimestamp = formatDate(latestLog.updatedAt);
  }

  return (
    <Flex gap={16}>
      <Flex vertical>
        <div className="image-placeholder">
          <ChargingStationIcon width={108} height={108} />
        </div>
      </Flex>
      <Flex vertical flex="1 1 auto">
        <Flex
          gap={8}
          align={'center'}
          style={{ marginBottom: 16 }}
          key={`${station.isOnline}`}
        >
          <ArrowLeftIcon
            onClick={() => {
              if (pageLocation.key === 'default') {
                push(`/${MenuSection.CHARGING_STATIONS}`);
              } else {
                goBack();
              }
            }}
            style={{ cursor: 'pointer' }}
          />
          <h3>{station.id}</h3>
          <span className={station.isOnline ? 'online' : 'offline'}>
            {station.isOnline ? 'Online' : 'Offline'}
          </span>
        </Flex>
        <Flex justify="space-between" gap={16}>
          <Flex vertical>
            <Text className="nowrap">Station ID: {station.id}</Text>
            <Text className="nowrap">
              Location ID:{' '}
              <Link to={`/locations/${station.locationId}`}>
                <Tooltip title={station?.location?.name}>
                  <Typography.Text
                    ellipsis
                    style={{ maxWidth: 150, display: 'inline-block' }}
                  >
                    {station?.location?.name}
                  </Typography.Text>
                </Tooltip>
              </Link>
            </Text>
            <Text className="nowrap">
              Latitude: {station.location?.coordinates?.latitude}
            </Text>
            <Text className="nowrap">
              Longitude: {station.location?.coordinates?.longitude}
            </Text>
          </Flex>

          <Flex vertical className="border-left">
            <table>
              <tbody>
                <tr>
                  <td>
                    <h5>Status</h5>
                  </td>
                  <td>
                    <ChargingStationStatusTag station={station} />
                  </td>
                </tr>
                <tr>
                  <td>
                    <h5>TimeStamp</h5>
                  </td>
                  <td>{latestTimestamp}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Model</h5>
                  </td>
                  <td>
                    {station.chargePointModel ? (
                      station.chargePointModel
                    ) : (
                      <Text>Unknown</Text>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <h5>Vendor</h5>
                  </td>
                  <td>
                    {station.chargePointVendor ? (
                      station.chargePointVendor
                    ) : (
                      <Text>Unknown</Text>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </Flex>

          <Flex vertical className="border-left">
            <table>
              <tbody>
                <tr>
                  <td>
                    <h5>Firmware Version</h5>
                  </td>
                  <td>
                    {station.firmwareVersion ? (
                      station.firmwareVersion
                    ) : (
                      <Text>Unknown</Text>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <h5>Connector Type</h5>
                  </td>
                  <td>
                    <Text>
                      {station.connectorTypes &&
                      station.connectorTypes.length > 0
                        ? station.connectorTypes.join(', ')
                        : 'N/A'}
                    </Text>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h5>Number of EVSEs</h5>
                  </td>
                  <td>
                    <Text>{station.evses?.length || '0'}</Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Flex>

          <Flex vertical>
            <CanAccess
              resource={ResourceType.CHARGING_STATIONS}
              action={ActionType.EDIT}
              params={{ id: station.id }}
            >
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() =>
                  push(`/${MenuSection.CHARGING_STATIONS}/${station.id}/edit`)
                }
              />
            </CanAccess>
            <CanAccess
              resource={ResourceType.CHARGING_STATIONS}
              action={ActionType.DELETE}
              params={{ id: station.id }}
            >
              <Button className="secondary" onClick={handleDeleteClick}>
                Delete
              </Button>
            </CanAccess>
          </Flex>
        </Flex>
        <Flex style={{ marginTop: '32px' }}>
          <CanAccess
            resource={ResourceType.CHARGING_STATIONS}
            action={ActionType.COMMAND}
            params={{
              id: station.id,
            }}
          >
            <Flex
              gap={16}
              justify="space-between"
              align="center"
              flex="1 1 auto"
            >
              <Flex gap={16} flex="1 1 auto">
                {station.isOnline ? (
                  <Flex gap={16} flex="1 1 auto">
                    {!hasActiveTransactions && (
                      <CanAccess
                        resource={ResourceType.CHARGING_STATIONS}
                        action={ActionType.COMMAND}
                        params={{
                          id: station.id,
                          commandType: CommandType.START_TRANSACTION,
                        }}
                      >
                        <Button onClick={() => showRemoteStartModal(station)}>
                          Start Transaction
                        </Button>
                      </CanAccess>
                    )}
                    {hasActiveTransactions && (
                      <CanAccess
                        resource={ResourceType.CHARGING_STATIONS}
                        action={ActionType.COMMAND}
                        params={{
                          id: station.id,
                          commandType: CommandType.STOP_TRANSACTION,
                        }}
                      >
                        <Button
                          onClick={() => handleStopTransactionClick(station)}
                        >
                          Stop Transaction
                        </Button>
                      </CanAccess>
                    )}
                    <CanAccess
                      resource={ResourceType.CHARGING_STATIONS}
                      action={ActionType.COMMAND}
                      params={{
                        id: station.id,
                        commandType: CommandType.RESET,
                      }}
                    >
                      <Button onClick={() => showResetStartModal(station)}>
                        Reset
                      </Button>
                    </CanAccess>
                  </Flex>
                ) : (
                  <Flex gap={16} flex="1 1 auto" align="center">
                    <Typography.Text type="secondary">
                      <InfoCircleOutlined style={{ marginRight: 8 }} />
                      Station offline - commands unavailable
                    </Typography.Text>
                  </Flex>
                )}
              </Flex>

              <Flex>
                <Button type="link" onClick={showOtherCommandsModal}>
                  Other Commands →
                </Button>
              </Flex>
            </Flex>
          </CanAccess>
        </Flex>
      </Flex>
    </Flex>
  );
};
