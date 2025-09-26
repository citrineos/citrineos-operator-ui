// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Button, Descriptions, Flex, message, Tooltip, Typography } from 'antd';
import {
  Link,
  useDelete,
  useList,
  useNavigation,
  useOne,
  CanAccess,
} from '@refinedev/core';
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
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
import { OCPPMessageDto } from '../../../dtos/ocpp.message.dto';
import { ChargingStationStatusTag } from '../charging.station.status.tag';
import { ArrowLeftIcon } from '../../../components/icons/arrow.left.icon';
import { useLocation } from 'react-router-dom';
import {
  CHARGING_STATIONS_DELETE_MUTATION,
  CHARGING_STATIONS_GET_QUERY,
} from '../queries';
import { ActionType, CommandType } from '@util/auth';
import {
  ChargingStationDtoProps,
  IOCPPMessageDto,
  OCPPMessageDtoProps,
} from '@citrineos/base';
import { IChargingStationDto } from '@citrineos/base';
import { NOT_APPLICABLE } from '@util/consts';
import ProtocolTag from '../../../components/protocol-tag';

const { Text } = Typography;
const UNKNOWN_TEXT = 'Unknown';

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

  const { data, isLoading } = useOne<IChargingStationDto>({
    resource: ResourceType.CHARGING_STATIONS,
    id: stationId,
    meta: {
      gqlQuery: CHARGING_STATIONS_GET_QUERY,
    },
    queryOptions: getPlainToInstanceOptions(ChargingStationDto, true),
  });

  const station = data?.data;

  const { data: latestLogsData } = useList<IOCPPMessageDto>({
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
    (station: IChargingStationDto) => {
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
    (station: IChargingStationDto) => {
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
    (station: IChargingStationDto) => {
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

  let latestTimestamp = NOT_APPLICABLE;
  if (latestLog) {
    latestTimestamp = formatDate(latestLog.timestamp);
  }

  return (
    <Flex gap={16}>
      <Flex gap={16} vertical flex="1 1 auto">
        <Flex gap={16} align={'center'} key={`${station.isOnline}`}>
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
          <CanAccess
            resource={ResourceType.CHARGING_STATIONS}
            action={ActionType.EDIT}
            params={{ id: station.id }}
          >
            <Button
              className="secondary btn-md"
              icon={<EditOutlined />}
              iconPosition="end"
              onClick={() =>
                push(`/${MenuSection.CHARGING_STATIONS}/${station.id}/edit`)
              }
            >
              Edit
            </Button>
          </CanAccess>
          <CanAccess
            resource={ResourceType.CHARGING_STATIONS}
            action={ActionType.DELETE}
            params={{ id: station.id }}
          >
            <Button
              className="error btn-md"
              icon={<DeleteOutlined />}
              iconPosition="end"
              onClick={handleDeleteClick}
            >
              Delete
            </Button>
          </CanAccess>
        </Flex>
        <Descriptions
          layout="vertical"
          column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 5 }}
          colon={false}
          classNames={{
            label: 'description-label',
          }}
        >
          <Descriptions.Item label="Protocol">
            <ProtocolTag protocol={station[ChargingStationDtoProps.protocol]} />
          </Descriptions.Item>
          <Descriptions.Item label="Location ID">
            {station?.location?.name ? (
              <Link to={`/locations/${station.locationId}`}>
                <Tooltip title={station?.location?.name}>
                  <Text
                    ellipsis
                    style={{ maxWidth: 100, display: 'inline-block' }}
                  >
                    {station?.location?.name}
                  </Text>
                </Tooltip>
              </Link>
            ) : (
              NOT_APPLICABLE
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Latitude">
            {station.location?.coordinates
              ? station.location.coordinates.coordinates[1].toFixed(4)
              : NOT_APPLICABLE}
          </Descriptions.Item>
          <Descriptions.Item label="Longitude">
            {station.location?.coordinates
              ? station.location.coordinates.coordinates[0].toFixed(4)
              : NOT_APPLICABLE}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {(station.evses?.length ?? 0) > 0 ? (
              <ChargingStationStatusTag station={station} />
            ) : (
              NOT_APPLICABLE
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Last OCPP Message">
            {latestTimestamp}
          </Descriptions.Item>
          <Descriptions.Item label="Vendor & Model">
            {(station.chargePointModel ?? UNKNOWN_TEXT) +
              ' ' +
              (station.chargePointVendor ?? UNKNOWN_TEXT)}
          </Descriptions.Item>
          <Descriptions.Item label="Floor Level">
            {station.floorLevel ?? UNKNOWN_TEXT}
          </Descriptions.Item>
          <Descriptions.Item label="Parking Restrictions">
            {station.parkingRestrictions ?? UNKNOWN_TEXT}
          </Descriptions.Item>
          <Descriptions.Item label="Capabilities">
            {station.capabilities?.join(', ') ?? UNKNOWN_TEXT}
          </Descriptions.Item>
          <Descriptions.Item label="Firmware Version">
            {station.firmwareVersion ?? UNKNOWN_TEXT}
          </Descriptions.Item>
          <Descriptions.Item label="Connector Types">
            {(station.connectors?.length ?? 0) > 0
              ? station
                  .connectors!.map((c) => c.type)
                  .filter(Boolean)
                  .join(', ')
              : NOT_APPLICABLE}
          </Descriptions.Item>
          <Descriptions.Item label="Total EVSEs">
            {station.evses?.length ?? 0}
          </Descriptions.Item>
        </Descriptions>

        <Flex>
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
              <Flex vertical gap={8} flex="1 1 auto">
                {!station.isOnline && (
                  <Typography.Text type="secondary">
                    <InfoCircleOutlined style={{ marginRight: 8 }} />
                    Station offline - commands unavailable
                  </Typography.Text>
                )}
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
                      <Button
                        type="primary"
                        className="btn-md"
                        disabled={!station.isOnline}
                        onClick={() => showRemoteStartModal(station)}
                      >
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
                        className="error btn-md"
                        onClick={() => handleStopTransactionClick(station)}
                        disabled={!station.isOnline}
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
                    <Button
                      className="warning btn-md"
                      onClick={() => showResetStartModal(station)}
                      disabled={!station.isOnline}
                    >
                      Reset
                    </Button>
                  </CanAccess>
                  <Button
                    type="primary"
                    className="btn-md"
                    icon={<EllipsisOutlined />}
                    iconPosition="end"
                    onClick={showOtherCommandsModal}
                    disabled={!station.isOnline}
                  >
                    Other Commands
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </CanAccess>
        </Flex>
      </Flex>
    </Flex>
  );
};
