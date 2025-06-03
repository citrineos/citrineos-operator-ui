// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { TableColumnsType } from 'antd';
import { ActionsColumn } from '../../components/data-model-table/actions-column';
import { VARIABLE_MONITORINGS_DELETE_MUTATION } from './queries';
import { ResourceType } from '@util/auth';
import { VariableMonitorings } from '../../graphql/schema.types';
import { ExpandableColumn } from '../../components/data-model-table/expandable-column';
import { MonitorEnumType } from '@OCPP2_0_1';
import { StatusIcon } from '../../components/status-icon';
import React from 'react';
import SeverityTag from '../../components/severity-tag';
import GenericTag from '../../components/tag';

export const VARIABLE_MONITORINGS_COLUMNS = (
  withActions: boolean,
  parentView?: ResourceType,
): TableColumnsType<VariableMonitorings> => {
  const baseColumns: TableColumnsType<VariableMonitorings> = [
    {
      dataIndex: 'databaseId',
      title: 'Database ID',
      sorter: true,
    },
    {
      dataIndex: 'id',
      title: 'ID',
    },
    {
      dataIndex: 'stationId',
      title: 'Station ID',
      // render: renderAssociatedStationId as any,
    },
    {
      dataIndex: 'transaction',
      title: 'Transaction',
      align: 'center',
      render: (_: any, record: any) => (
        <StatusIcon value={record?.transaction} />
      ),
    },
    {
      dataIndex: 'value',
      title: 'Value',
    },
    {
      dataIndex: 'type',
      title: 'Type',
      render: (_: any, record: any) => {
        return (
          <GenericTag
            enumValue={record.type as MonitorEnumType}
            enumType={MonitorEnumType}
          />
        );
      },
    },
    {
      dataIndex: 'severity',
      title: 'Severity',
      align: 'center',
      render: (_: any, record: any) => {
        return <SeverityTag value={record.severity as number} />;
      },
    },
    {
      dataIndex: 'variableId',
      title: 'Variable Id',
      render: (_: any, record: any) => {
        if (!record?.variableId) {
          return '';
        }

        const variableId = record.variableId;
        if (parentView === ResourceType.VARIABLES) {
          return variableId;
        }

        return (
          <ExpandableColumn
            initialContent={variableId}
            expandedContent={<>{'TODO'}</>}
            viewTitle={`Variable linked to Variable Monitoring with ID ${record.databaseId}`}
          />
        );
      },
    },
    {
      dataIndex: 'componentId',
      title: 'Component Id',
      render: (_: any, record: any) => {
        if (!record?.componentId) {
          return '';
        }

        const componentId = record.componentId;
        if (parentView === ResourceType.COMPONENTS) {
          return componentId;
        }

        return (
          <ExpandableColumn
            initialContent={componentId}
            expandedContent={<>{'TODO'}</>}
            viewTitle={`Component linked to Variable Monitoring with ID ${record.databaseId}`}
          />
        );
      },
    },
  ] as any;

  if (withActions) {
    baseColumns.push({
      dataIndex: 'actions',
      title: 'Actions',
      render: (_: any, record: any) => (
        <ActionsColumn
          record={record}
          idField={'databaseId'}
          gqlDeleteMutation={VARIABLE_MONITORINGS_DELETE_MUTATION}
        />
      ),
    } as any);
  }

  return baseColumns;
};
