// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import type { ChargingStationDto, OCPPMessageDto } from '@citrineos/base';
import { ChargingStationProps, OCPPMessageProps } from '@citrineos/base';
import { MenuSection } from '@lib/client/components/main-menu/main.menu';
import { ModalComponentType } from '@lib/client/components/modals/modal.types';
import ProtocolTag from '@lib/client/components/protocol-tag';
import { formatDate } from '@lib/client/components/timestamp-display';
import { Button } from '@lib/client/components/ui/button';
import { ChargingStationStatusTag } from '@lib/client/pages/charging-stations/charging.station.status.tag';
import {
  ChargingStationClass,
  type ChargingStationDetailsDto,
} from '@lib/cls/charging.station.dto';
import { OCPPMessageClass } from '@lib/cls/ocpp.message.dto';
import type { TransactionClass } from '@lib/cls/transaction.dto';
import {
  CHARGING_STATIONS_DELETE_MUTATION,
  CHARGING_STATIONS_GET_QUERY,
} from '@lib/queries/charging.stations';
import { ActionType, CommandType, ResourceType } from '@lib/utils/access.types';
import { NOT_APPLICABLE } from '@lib/utils/consts';
import { openModal } from '@lib/utils/modal.slice';
import { getPlainToInstanceOptions } from '@lib/utils/tables';
import {
  CanAccess,
  Link,
  useDelete,
  useList,
  useOne,
  useTranslate,
} from '@refinedev/core';
import { instanceToPlain } from 'class-transformer';
import { ChevronLeft, Edit, Info, MoreHorizontal, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Card, CardContent, CardHeader } from '@lib/client/components/ui/card';
import { cardGridStyle, cardHeaderFlex } from '@lib/client/styles/card';
import {
  badgeListStyle,
  clickableLinkStyle,
  heading2Style,
} from '@lib/client/styles/page';
import { buttonIconSize } from '@lib/client/styles/icon';
import { KeyValueDisplay } from '@lib/client/components/key-value-display';
import { Badge } from '@lib/client/components/ui/badge';
import Image from 'next/image';
import { isGcp } from '@lib/server/clients/file/isGcp';

const UNKNOWN_TEXT = 'Unknown';

export interface ChargingStationDetailCardContentProps {
  stationId: string;
  transaction?: TransactionClass;
  imageUrl?: string | null;
}

export const ChargingStationDetailCard = ({
  stationId,
  imageUrl,
}: ChargingStationDetailCardContentProps) => {
  const { mutate } = useDelete();
  const { back, push } = useRouter();
  const dispatch = useDispatch();
  const translate = useTranslate();

  const {
    query: { data, isLoading },
  } = useOne<ChargingStationDetailsDto>({
    resource: ResourceType.CHARGING_STATIONS,
    id: stationId,
    meta: {
      gqlQuery: CHARGING_STATIONS_GET_QUERY,
    },
    queryOptions: getPlainToInstanceOptions(ChargingStationClass, true),
  });

  const station = data?.data;

  const {
    query: { data: latestLogsData },
  } = useList<OCPPMessageDto>({
    resource: ResourceType.OCPP_MESSAGES,
    meta: {
      fields: [OCPPMessageProps.id, OCPPMessageProps.timestamp],
    },
    sorters: [{ field: OCPPMessageProps.timestamp, order: 'desc' }],
    filters: [
      {
        field: OCPPMessageProps.stationId,
        operator: 'eq',
        value: station?.id,
      },
    ],
    pagination: {
      pageSize: 1,
      currentPage: 1,
    },
    queryOptions: getPlainToInstanceOptions(OCPPMessageClass),
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
      },
    );
  }, [station, mutate, push]);

  const showRemoteStartModal = useCallback(
    (station: ChargingStationDto) => {
      dispatch(
        openModal({
          title: translate('ChargingStations.remoteStart'),
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
          title: translate('ChargingStations.remoteStop'),
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
          title: translate('ChargingStations.reset'),
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
        title: translate('ChargingStations.otherCommands'),
        modalComponentType: ModalComponentType.otherCommands,
        modalComponentProps: { station: instanceToPlain(station) },
      }),
    );
  }, [dispatch, station]);

  if (isLoading) return <p>{translate('loading')}</p>;
  if (!station) return <p>{translate('noDataFound')}</p>;

  const hasActiveTransactions =
    station.transactions && station.transactions.length > 0;

  let latestTimestamp = NOT_APPLICABLE;
  if (latestLog) {
    latestTimestamp = formatDate(latestLog.timestamp);
  }

  return (
    <Card>
      <CardHeader>
        <div className={cardHeaderFlex}>
          <ChevronLeft
            onClick={() => {
              if (window.history.state?.idx === 0) {
                push(`/${MenuSection.CHARGING_STATIONS}`);
              } else {
                back();
              }
            }}
            className="cursor-pointer"
          />
          <h2 className={heading2Style}>{station.id}</h2>
          <span
            className={station.isOnline ? 'text-success' : 'text-destructive'}
          >
            {station.isOnline ? 'Online' : 'Offline'}
          </span>
          <CanAccess
            resource={ResourceType.CHARGING_STATIONS}
            action={ActionType.EDIT}
            params={{ id: station.id }}
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                push(`/${MenuSection.CHARGING_STATIONS}/${station.id}/edit`)
              }
            >
              <Edit className={buttonIconSize} />
              {translate('buttons.edit')}
            </Button>
          </CanAccess>
          <CanAccess
            resource={ResourceType.CHARGING_STATIONS}
            action={ActionType.DELETE}
            params={{ id: station.id }}
          >
            <Button variant="destructive" size="sm" onClick={handleDeleteClick}>
              <Trash2 className={buttonIconSize} />
              {translate('buttons.delete')}
            </Button>
          </CanAccess>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: KeyValue details */}
          <div className="flex-1">
            <div className={cardGridStyle}>
              <KeyValueDisplay
                keyLabel="Protocol"
                value={station[ChargingStationProps.protocol]}
                valueRender={(protocol: any) => (
                  <ProtocolTag protocol={protocol} />
                )}
              />
              <KeyValueDisplay
                keyLabel="Location"
                value={station?.location?.name}
                valueRender={(locationName: any) =>
                  locationName ? (
                    <Link
                      to={`/locations/${station.locationId}`}
                      className={clickableLinkStyle}
                      title={locationName}
                    >
                      {locationName}
                    </Link>
                  ) : (
                    <span>{NOT_APPLICABLE}</span>
                  )
                }
              />
              <KeyValueDisplay
                keyLabel="Latitude"
                value={
                  station.location?.coordinates
                    ? station.location.coordinates.coordinates[1].toFixed(4)
                    : NOT_APPLICABLE
                }
              />

              <KeyValueDisplay
                keyLabel="Longitude"
                value={
                  station.location?.coordinates
                    ? station.location.coordinates.coordinates[0].toFixed(4)
                    : NOT_APPLICABLE
                }
              />

              <KeyValueDisplay
                keyLabel="Status"
                value={''}
                valueRender={() =>
                  (station.evses?.length ?? 0) > 0 ? (
                    <ChargingStationStatusTag station={station} />
                  ) : (
                    <span>{NOT_APPLICABLE}</span>
                  )
                }
              />

              <KeyValueDisplay
                keyLabel="Last OCPP Message"
                value={latestTimestamp}
              />

              <KeyValueDisplay
                keyLabel="Model / Vendor"
                value={`${station.chargePointVendor ?? UNKNOWN_TEXT} / ${station.chargePointModel ?? UNKNOWN_TEXT}`}
              />

              <KeyValueDisplay
                keyLabel="Floor Level"
                value={station.floorLevel}
              />

              <KeyValueDisplay
                keyLabel="Parking Restrictions"
                value={station.parkingRestrictions}
                valueRender={(parkingRestrictions) => (
                  <div className={badgeListStyle}>
                    {parkingRestrictions?.length > 0 ? (
                      parkingRestrictions.map((pr: any) => (
                        <Badge key={pr} variant="muted">
                          {pr}
                        </Badge>
                      ))
                    ) : (
                      <span>{NOT_APPLICABLE}</span>
                    )}
                  </div>
                )}
              />

              <KeyValueDisplay
                keyLabel="Capabilities"
                value={station.capabilities}
                valueRender={(capabilities) => (
                  <div className={badgeListStyle}>
                    {capabilities?.length > 0 ? (
                      capabilities.map((cap: any) => (
                        <Badge key={cap} variant="muted">
                          {cap}
                        </Badge>
                      ))
                    ) : (
                      <span>{NOT_APPLICABLE}</span>
                    )}
                  </div>
                )}
              />

              <KeyValueDisplay
                keyLabel="Firmware Version"
                value={station.firmwareVersion}
              />

              <KeyValueDisplay
                keyLabel="Connector Types"
                value={
                  (station.connectors?.length ?? 0) > 0
                    ? station
                        .connectors!.map((c) => c.type)
                        .filter(Boolean)
                        .join(', ')
                    : NOT_APPLICABLE
                }
              />

              <KeyValueDisplay
                keyLabel="Total EVSEs"
                value={station.evses?.length ?? 0}
              />
            </div>
          </div>

          {/* Right: Image */}
          {imageUrl && (
            <div className="flex-shrink-0 w-64 md:w-48 sm:w-32 h-64 md:h-48 sm:h-32 flex items-center justify-center bg-gray-100 rounded-md relative">
              <Image
                src={imageUrl}
                unoptimized={isGcp}
                fill={isGcp}
                alt={`${station.id} image`}
                className="w-full h-full object-contain rounded-md bg-gray-100"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Command Buttons */}
        <div className="mt-6">
          <CanAccess
            resource={ResourceType.CHARGING_STATIONS}
            action={ActionType.COMMAND}
            params={{ id: station.id }}
          >
            <div className="flex justify-between items-center flex-1">
              <div className="flex flex-col gap-2 flex-1">
                {!station.isOnline && (
                  <div className="flex items-center text-muted-foreground">
                    <Info className="mr-2 h-4 w-4" />
                    <span className="text-sm">
                      {translate('ChargingStations.commandsUnavailable')}
                    </span>
                  </div>
                )}
                <div className="flex gap-4 flex-1">
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
                        disabled={!station.isOnline}
                        onClick={() => showRemoteStartModal(station)}
                      >
                        {translate('ChargingStations.startTransaction')}
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
                        variant="destructive"
                        onClick={() => handleStopTransactionClick(station)}
                        disabled={!station.isOnline}
                      >
                        {translate('ChargingStations.stopTransaction')}
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
                      variant="outline"
                      onClick={() => showResetStartModal(station)}
                      disabled={!station.isOnline}
                    >
                      {translate('ChargingStations.reset')}
                    </Button>
                  </CanAccess>
                  <Button
                    onClick={showOtherCommandsModal}
                    disabled={!station.isOnline}
                  >
                    <MoreHorizontal className="mr-2 h-4 w-4" />
                    {translate('ChargingStations.otherCommands')}
                  </Button>
                </div>
              </div>
            </div>
          </CanAccess>
        </div>
      </CardContent>
    </Card>
  );
};
