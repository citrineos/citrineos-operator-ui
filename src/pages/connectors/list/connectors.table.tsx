// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Table, Button } from 'antd';
import React, { useMemo } from 'react';
import { IConnectorDto } from '@citrineos/base';

interface ConnectorsTableProps {
  connectors: IConnectorDto[];
  onEdit: (connector: IConnectorDto) => void;
  onAdd: () => void;
}

export const ConnectorsTable: React.FC<ConnectorsTableProps> = ({
  connectors,
  onEdit,
}) => {
  const columns = useMemo(
    () => [
      {
        title: 'Connector ID',
        dataIndex: 'connectorId',
        key: 'connectorId',
      },
      {
        title: 'EVSE Type Connector ID',
        dataIndex: 'evseTypeConnectorId',
        key: 'evseTypeConnectorId',
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: 'Max Power',
        dataIndex: 'maximumPowerWatts',
        key: 'maximumPowerWatts',
        render: (value: number) =>
          value > 10000 ? `${(value / 1000).toFixed(1)} kW` : `${value} W`,
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: IConnectorDto) => (
          <Button className="Secondary" onClick={() => onEdit(record)}>
            Edit
          </Button>
        ),
      },
    ],
    [onEdit],
  );

  return (
    <div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={connectors}
        pagination={false}
        size="small"
      />
    </div>
  );
};
