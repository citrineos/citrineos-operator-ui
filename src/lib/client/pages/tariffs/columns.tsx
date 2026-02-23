// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { TariffProps } from '@citrineos/base';
import { MenuSection } from '@lib/client/components/main-menu/main.menu';
import { Table } from '@lib/client/components/table';
import type { TariffClass } from '@lib/cls/tariff.dto';
import { clickableLinkStyle } from '@lib/client/styles/page';
import type { RouterPush } from '@lib/utils/types';
import type { CrudFilters } from '@refinedev/core';
import React from 'react';

export const getTariffColumns = (push: RouterPush) => {
  return [
    <Table.Column
      id={TariffProps.id}
      key={TariffProps.id}
      accessorKey={TariffProps.id}
      header="ID"
      enableSorting
      cell={({ row }) => (
        <div
          className={clickableLinkStyle}
          onClick={(event: React.MouseEvent) => {
            const path = `/${MenuSection.TARIFFS}/${row.original.id}`;
            if (event.ctrlKey || event.metaKey) {
              window.open(path, '_blank');
            } else {
              push(path);
            }
          }}
        >
          {row.original.id}
        </div>
      )}
    />,
    <Table.Column
      id={TariffProps.currency}
      key={TariffProps.currency}
      accessorKey={TariffProps.currency}
      header="Currency"
      enableSorting
      cell={({ row }) => <span>{(row.original as TariffClass).currency}</span>}
    />,
    <Table.Column
      id={TariffProps.pricePerKwh}
      key={TariffProps.pricePerKwh}
      accessorKey={TariffProps.pricePerKwh}
      header="Price / kWh"
      enableSorting
      cell={({ row }) => (
        <span>{(row.original as TariffClass).pricePerKwh?.toFixed(2)}</span>
      )}
    />,
    <Table.Column
      id={TariffProps.pricePerMin}
      key={TariffProps.pricePerMin}
      accessorKey={TariffProps.pricePerMin}
      header="Price / min"
      cell={({ row }) => (
        <span>
          {(row.original as TariffClass).pricePerMin != null
            ? (row.original as TariffClass).pricePerMin!.toFixed(2)
            : '—'}
        </span>
      )}
    />,
    <Table.Column
      id={TariffProps.pricePerSession}
      key={TariffProps.pricePerSession}
      accessorKey={TariffProps.pricePerSession}
      header="Price / session"
      cell={({ row }) => (
        <span>
          {(row.original as TariffClass).pricePerSession != null
            ? (row.original as TariffClass).pricePerSession!.toFixed(2)
            : '—'}
        </span>
      )}
    />,
  ];
};

export const getTariffsFilters = (value: string): CrudFilters => {
  return [
    {
      field: TariffProps.currency,
      operator: 'contains',
      value,
    },
  ];
};
