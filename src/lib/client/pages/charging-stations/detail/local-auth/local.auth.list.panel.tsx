// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { type ChargingStationDto, OCPPVersion } from '@citrineos/base';
import {
  ADD_LOCAL_AUTH_ENTRY_EVENT,
  type AddLocalAuthEntryPickedRow,
} from '@lib/client/components/modals/local-auth/add.local.auth.entry.modal';
import { ModalComponentType } from '@lib/client/components/modals/modal.types';
import { Button } from '@lib/client/components/ui/button';
import { Skeleton } from '@lib/client/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@lib/client/components/ui/table';
import {
  ChargingStationClass,
  type ChargingStationDetailsDto,
} from '@lib/cls/charging.station.dto';
import {
  LocalListAuthorizationClass,
  LocalListVersionClass,
} from '@lib/cls/local.list.version.dto';
import { CHARGING_STATIONS_GET_QUERY } from '@lib/queries/charging.stations';
import { LOCAL_LIST_VERSION_BY_STATION } from '@lib/queries/local.auth.list';
import { ResourceType } from '@lib/utils/access.types';
import { openModal } from '@lib/utils/store/modal.slice';
import { getPlainToInstanceOptions } from '@lib/utils/tables';
import { useList, useOne } from '@refinedev/core';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

interface StagedEntry {
  idToken: string;
  type?: string | null;
  status: string;
  expiryDate?: string | null;
  parentIdTag?: string | null;
}

export interface LocalAuthListPanelProps {
  stationId: string;
}

export const LocalAuthListPanel = ({ stationId }: LocalAuthListPanelProps) => {
  const dispatch = useDispatch();
  const [stagedAdds, setStagedAdds] = useState<StagedEntry[]>([]);
  const [stagedDeletes, setStagedDeletes] = useState<StagedEntry[]>([]);

  const {
    query: { data: stationData, isLoading: isStationLoading },
  } = useOne<ChargingStationDetailsDto>({
    resource: ResourceType.CHARGING_STATIONS,
    id: stationId,
    meta: { gqlQuery: CHARGING_STATIONS_GET_QUERY },
    queryOptions: getPlainToInstanceOptions(ChargingStationClass, true),
  });

  const station = stationData?.data as ChargingStationDto | undefined;

  const {
    query: { data, refetch, isLoading },
  } = useList<LocalListVersionClass>({
    resource: ResourceType.LOCAL_LIST_VERSIONS,
    pagination: { pageSize: 1, currentPage: 1 },
    meta: {
      gqlQuery: LOCAL_LIST_VERSION_BY_STATION,
      gqlVariables: { stationId },
    },
  });

  const localListVersion: LocalListVersionClass | undefined = useMemo(() => {
    const row = data?.data?.[0];
    return row
      ? (plainToInstance(
          LocalListVersionClass,
          row,
        ) as LocalListVersionClass)
      : undefined;
  }, [data?.data]);

  const currentEntries: LocalListAuthorizationClass[] = useMemo(
    () => localListVersion?.LocalListAuthorizations ?? [],
    [localListVersion],
  );

  const stagedTokens = useMemo(
    () => [
      ...currentEntries.map((e) => e.idToken),
      ...stagedAdds.map((e) => e.idToken),
    ],
    [currentEntries, stagedAdds],
  );

  const openSendModal = (
    initialUpdateType: 'Full' | 'Differential',
    sendEmpty = false,
  ) => {
    dispatch(
      openModal({
        title:
          initialUpdateType === 'Full'
            ? sendEmpty
              ? 'Send Local List (Clear)'
              : 'Send Local List (Full)'
            : 'Send Local List (Differential)',
        modalComponentType: ModalComponentType.sendLocalList,
        modalComponentProps: {
          station: instanceToPlain(station),
          currentVersion: localListVersion?.versionNumber ?? 0,
          addUpdate: stagedAdds,
          deleteIdTokens: stagedDeletes.map((d) => ({
            idToken: d.idToken,
            type: d.type,
          })),
          initialUpdateType,
          sendEmpty,
        },
      }),
    );
  };

  const openGetVersion = () => {
    dispatch(
      openModal({
        title: 'Get Local List Version',
        modalComponentType: ModalComponentType.getLocalListVersion,
        modalComponentProps: { station: instanceToPlain(station) },
      }),
    );
  };

  const openAddPicker = () => {
    dispatch(
      openModal({
        title: 'Add Authorizations to Local List',
        modalComponentType: ModalComponentType.addLocalAuthEntry,
        modalComponentProps: {
          alreadyStagedIdTokens: stagedTokens,
        },
      }),
    );
  };

  useEffect(() => {
    const handler = (e: Event) => {
      const rows = (e as CustomEvent<AddLocalAuthEntryPickedRow[]>).detail ?? [];
      setStagedAdds((prev) => [
        ...prev,
        ...rows.map((r) => ({
          idToken: r.idToken,
          type: r.idTokenType,
          status: r.status,
          expiryDate: r.cacheExpiryDateTime,
          parentIdTag: r.parentIdTag,
        })),
      ]);
    };
    window.addEventListener(ADD_LOCAL_AUTH_ENTRY_EVENT, handler);
    return () => window.removeEventListener(ADD_LOCAL_AUTH_ENTRY_EVENT, handler);
  }, []);

  const stageDelete = (entry: LocalListAuthorizationClass) => {
    setStagedDeletes((prev) =>
      prev.find((p) => p.idToken === entry.idToken)
        ? prev
        : [
            ...prev,
            {
              idToken: entry.idToken,
              type: entry.idTokenType,
              status: String(entry.status),
            },
          ],
    );
  };

  const unstageDelete = (idToken: string) => {
    setStagedDeletes((prev) => prev.filter((p) => p.idToken !== idToken));
  };

  const unstageAdd = (idToken: string) => {
    setStagedAdds((prev) => prev.filter((p) => p.idToken !== idToken));
  };

  if (isStationLoading || !station) {
    return <Skeleton className="h-40 w-full" />;
  }

  const isOcpp16 = station.protocol === OCPPVersion.OCPP1_6;
  // OCPP 2.0.1 differential delete is not supported by Core yet (no tombstone path
  // in the 2.0.1 SendLocalList repo). Remove staging is hidden for 2.0.1 stations
  // until Core gains parity. Use "Send Full" to overwrite the list instead.
  const supportsDifferentialDelete = isOcpp16;
  const hasStagedDiff = stagedAdds.length > 0 || stagedDeletes.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="text-sm">
          <span className="font-semibold">Current version:</span>{' '}
          {localListVersion?.versionNumber ?? '—'}
        </div>
        <div className="text-sm text-muted-foreground">
          {currentEntries.length} entries · OCPP {station.protocol}
        </div>
        <div className="ml-auto flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => refetch()}>
            Refresh
          </Button>
          <Button variant="outline" onClick={openGetVersion}>
            Get Version from Charger
          </Button>
          <Button variant="outline" onClick={openAddPicker}>
            Add Entry
          </Button>
          <Button
            variant="secondary"
            onClick={() => openSendModal('Differential')}
            disabled={!hasStagedDiff}
            title={!hasStagedDiff ? 'Stage adds or deletes first' : undefined}
          >
            Send Differential
          </Button>
          <Button onClick={() => openSendModal('Full')}>Send Full</Button>
          <Button
            variant="destructive"
            onClick={() => openSendModal('Full', true)}
          >
            Clear on Charger
          </Button>
        </div>
      </div>

      {hasStagedDiff && (
        <div className="rounded-md border p-3">
          <div className="font-semibold mb-2">Staged changes</div>
          {stagedAdds.length > 0 && (
            <div className="mb-2">
              <div className="text-sm">Add / Update</div>
              <ul className="text-sm">
                {stagedAdds.map((s) => (
                  <li key={s.idToken} className="flex items-center gap-2">
                    <span>
                      {s.idToken}
                      {s.type ? ` (${s.type})` : ''} — {s.status}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => unstageAdd(s.idToken)}
                    >
                      remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {stagedDeletes.length > 0 && (
            <div>
              <div className="text-sm">Delete</div>
              <ul className="text-sm">
                {stagedDeletes.map((s) => (
                  <li key={s.idToken} className="flex items-center gap-2">
                    <span>
                      {s.idToken}
                      {s.type ? ` (${s.type})` : ''}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => unstageDelete(s.idToken)}
                    >
                      keep
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>idToken</TableHead>
              {!isOcpp16 && <TableHead>Type</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>{isOcpp16 ? 'parentIdTag' : 'groupIdToken'}</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={isOcpp16 ? 5 : 6}>Loading...</TableCell>
              </TableRow>
            )}
            {!isLoading && currentEntries.length === 0 && (
              <TableRow>
                <TableCell colSpan={isOcpp16 ? 5 : 6}>
                  No entries persisted for this station.
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              currentEntries.map((entry) => {
                const pendingDelete = stagedDeletes.some(
                  (d) => d.idToken === entry.idToken,
                );
                return (
                  <TableRow
                    key={entry.id}
                    className={pendingDelete ? 'opacity-50 line-through' : ''}
                  >
                    <TableCell>{entry.idToken}</TableCell>
                    {!isOcpp16 && (
                      <TableCell>{entry.idTokenType ?? '—'}</TableCell>
                    )}
                    <TableCell>{String(entry.status)}</TableCell>
                    <TableCell>
                      {entry.cacheExpiryDateTime
                        ? new Date(entry.cacheExpiryDateTime).toLocaleString()
                        : '—'}
                    </TableCell>
                    <TableCell>
                      {entry.groupAuthorization?.idToken ?? '—'}
                    </TableCell>
                    <TableCell>
                      {pendingDelete ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => unstageDelete(entry.idToken)}
                        >
                          Undo
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => stageDelete(entry)}
                          disabled={!supportsDifferentialDelete}
                          title={
                            supportsDifferentialDelete
                              ? undefined
                              : 'Differential delete not yet supported for OCPP 2.0.1. Use Send Full to overwrite the list.'
                          }
                        >
                          Remove
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
