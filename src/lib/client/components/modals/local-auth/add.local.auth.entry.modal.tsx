// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { Button } from '@lib/client/components/ui/button';
import { Input } from '@lib/client/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@lib/client/components/ui/table';
import { SEARCH_AUTHORIZATIONS_FOR_LOCAL_LIST } from '@lib/queries/local.auth.list';
import { ResourceType } from '@lib/utils/access.types';
import { closeModal } from '@lib/utils/store/modal.slice';
import { useList } from '@refinedev/core';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

export interface AddLocalAuthEntryPickedRow {
  idToken: string;
  idTokenType?: string | null;
  status: string;
  cacheExpiryDateTime?: string | null;
  parentIdTag?: string | null;
}

export const ADD_LOCAL_AUTH_ENTRY_EVENT = 'add-local-auth-entry-picked';

export interface AddLocalAuthEntryModalProps {
  alreadyStagedIdTokens?: string[];
}

export const AddLocalAuthEntryModal = ({
  alreadyStagedIdTokens = [],
}: AddLocalAuthEntryModalProps) => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Record<string, any>>({});

  const {
    query: { data, isLoading },
  } = useList<any>({
    resource: ResourceType.AUTHORIZATIONS,
    pagination: { pageSize: 50, currentPage: 1 },
    meta: {
      gqlQuery: SEARCH_AUTHORIZATIONS_FOR_LOCAL_LIST,
      gqlVariables: {
        search: search ? `%${search}%` : '%%',
        searchText: search ? `%${search}%` : '%%',
      },
    },
  });

  const rows: any[] = data?.data ?? [];
  const stagedSet = useMemo(
    () => new Set(alreadyStagedIdTokens),
    [alreadyStagedIdTokens],
  );

  const toggle = (row: any) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[row.id]) delete next[row.id];
      else next[row.id] = row;
      return next;
    });
  };

  const handleConfirm = () => {
    const rows: AddLocalAuthEntryPickedRow[] = Object.values(selected).map(
      (r: any) => ({
        idToken: r.idToken,
        idTokenType: r.idTokenType,
        status: r.status,
        cacheExpiryDateTime: r.cacheExpiryDateTime,
        parentIdTag: r.groupAuthorization?.idToken ?? null,
      }),
    );
    window.dispatchEvent(
      new CustomEvent<AddLocalAuthEntryPickedRow[]>(ADD_LOCAL_AUTH_ENTRY_EVENT, {
        detail: rows,
      }),
    );
    dispatch(closeModal());
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search idToken..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="max-h-96 overflow-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>idToken</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4}>Loading...</TableCell>
              </TableRow>
            )}
            {!isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>No authorizations found.</TableCell>
              </TableRow>
            )}
            {!isLoading &&
              rows.map((row) => {
                const isStaged = stagedSet.has(row.idToken);
                return (
                  <TableRow
                    key={row.id}
                    className={isStaged ? 'opacity-50' : ''}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        disabled={isStaged}
                        checked={Boolean(selected[row.id])}
                        onChange={() => toggle(row)}
                      />
                    </TableCell>
                    <TableCell>{row.idToken}</TableCell>
                    <TableCell>{row.idTokenType ?? '—'}</TableCell>
                    <TableCell>{row.status}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => dispatch(closeModal())}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={Object.keys(selected).length === 0}
        >
          Add Selected
        </Button>
      </div>
    </div>
  );
};
