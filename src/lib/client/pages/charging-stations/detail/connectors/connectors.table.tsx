// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import type { ConnectorDto } from '@citrineos/base';
import { Button } from '@lib/client/components/ui/button';
import React from 'react';

interface ConnectorsTableProps {
  connectors: ConnectorDto[];
  onEdit: (connector: ConnectorDto) => void;
  onAdd: () => void;
}

export const ConnectorsTable: React.FC<ConnectorsTableProps> = ({
  connectors,
  onEdit,
}) => {
  const formatPower = (value: number | undefined) =>
    value
      ? value > 10000
        ? `${(value / 1000).toFixed(1)} kW`
        : `${value} W`
      : '-';

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-2 text-left font-medium">Connector ID</th>
            <th className="px-4 py-2 text-left font-medium">
              EVSE Type Connector ID
            </th>
            <th className="px-4 py-2 text-left font-medium">Type</th>
            <th className="px-4 py-2 text-left font-medium">Status</th>
            <th className="px-4 py-2 text-left font-medium">Max Power</th>
            <th className="px-4 py-2 text-left font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {connectors.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-8 text-center text-muted-foreground"
              >
                No connectors
              </td>
            </tr>
          ) : (
            connectors.map((connector) => (
              <tr key={connector.id} className="border-t hover:bg-muted/50">
                <td className="px-4 py-2">{connector.connectorId}</td>
                <td className="px-4 py-2">{connector.evseTypeConnectorId}</td>
                <td className="px-4 py-2">{connector.type}</td>
                <td className="px-4 py-2">{connector.status}</td>
                <td className="px-4 py-2">
                  {formatPower(connector.maximumPowerWatts || undefined)}
                </td>
                <td className="px-4 py-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(connector)}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
