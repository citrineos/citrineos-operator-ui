// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Table, Button, Space } from 'antd';
import React, { useMemo, useState } from 'react';
import { IConnectorDto } from '@citrineos/base';
import { ConnectorPublishModal } from './connector.publish.modal';

interface ConnectorsTableProps {
  connectors: IConnectorDto[];
  onEdit: (connector: IConnectorDto) => void;
}

export const ConnectorsTable: React.FC<ConnectorsTableProps> = ({
  connectors,
  onEdit,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedConnector, setSelectedConnector] = useState<IConnectorDto | null>(null);

  const showModal = (connector: IConnectorDto) => {
    setSelectedConnector(connector);
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setSelectedConnector(null);
  };

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
          <Space>
            <Button className="Secondary" onClick={() => onEdit(record)}>
              Edit
            </Button>
            <Button className="Primary" onClick={() => showModal(record)}>
              Publish
            </Button>
          </Space>
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
      {selectedConnector && (
        <ConnectorPublishModal
          connector={selectedConnector}
          visible={isModalVisible}
          onClose={handleClose}
        />
      )}
    </div>
  );
};