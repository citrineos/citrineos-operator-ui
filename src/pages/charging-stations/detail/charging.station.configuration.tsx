// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect, useMemo } from 'react';
import {
  Select,
  Table,
  Row,
  Col,
  Typography,
  message,
  Input,
  Button,
} from 'antd';
import { useList, type CrudFilter } from '@refinedev/core';
import {
  VARIABLE_ATTRIBUTE_DOWNLOAD_QUERY,
  VARIABLE_ATTRIBUTE_LIST_QUERY,
} from '../../variable-attributes/queries';
import {
  CHANGE_CONFIGURATION_DOWNLOAD_QUERY,
  CHANGE_CONFIGURATION_LIST_QUERY,
} from './queries';
import { downloadCSV } from '@util/download';

const { Text } = Typography;
const { Search } = Input;

interface VariableAttribute {
  id: string;
  type: string;
  value: string;
  Variable: {
    name: string;
    instance: string;
  };
  Component: {
    name: string;
    instance: string;
  };
  evseDatabaseId: number | null;
  Evse: {
    id: string;
    connectorId: string;
  };
}

interface ChangeConfiguration {
  stationId: string;
  key: string;
  value?: string | null;
  readonly?: boolean | null;
}

interface ChargingStationConfigurationProps {
  stationId: string;
}

const CONFIG_1_6_COLUMNS = [
  {
    title: 'Key',
    dataIndex: 'key',
    render: (text: any) => (
      <div style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
        {text}
      </div>
    ),
  },
  {
    title: 'Value',
    dataIndex: 'value',
    render: (text: any) => (
      <div style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
        {text}
      </div>
    ),
  },
];

const CONFIG_2_0_1_COLUMNS = [
  {
    title: 'Type',
    dataIndex: 'type',
    render: (text: any) => (
      <div style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
        {text}
      </div>
    ),
  },
  {
    title: 'Value',
    dataIndex: 'value',
    render: (text: any) => (
      <div style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
        {text}
      </div>
    ),
  },
  {
    title: 'Component Name:Instance',
    dataIndex: 'component',
    render: (text: any) => (
      <div style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
        {text}
      </div>
    ),
  },
  {
    title: 'Variable Name:Instance',
    dataIndex: 'variable',
    render: (text: any) => (
      <div style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
        {text}
      </div>
    ),
  },
  {
    title: 'EVSE ID:Connector ID',
    dataIndex: 'evse',
    render: (text: any) => (
      <div style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
        {text}
      </div>
    ),
  },
];

export const ChargingStationConfiguration: React.FC<
  ChargingStationConfigurationProps
> = ({ stationId }) => {
  const [version, setVersion] = useState<'1.6' | '2.0.1'>('1.6');
  const [searchTerm, setSearchTerm] = useState('');
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [currentVariableAttributes, setCurrentVariableAttributes] = useState(1);
  const [pageSizeVariableAttributes, setPageSizeVariableAttributes] =
    useState(20);
  const [currentChangeConfigurations, setCurrentChangeConfigurations] =
    useState(1);
  const [pageSizeChangeConfigurations, setPageSizeChangeConfigurations] =
    useState(20);

  const attributeFilters = useMemo<CrudFilter[]>(
    () => [{ field: 'stationId', operator: 'eq', value: stationId }],
    [stationId],
  );

  const configFilters = useMemo<CrudFilter[]>(
    () => [{ field: 'stationId', operator: 'eq', value: stationId }],
    [stationId],
  );

  const {
    data: variableAttributesResult,
    isLoading: isAttributesLoading,
    error: attributesError,
  } = useList<VariableAttribute>({
    resource: 'VariableAttributes',
    meta: { gqlQuery: VARIABLE_ATTRIBUTE_LIST_QUERY },
    filters: attributeFilters,
    sorters: [{ field: 'createdAt', order: 'desc' }],
    pagination: {
      current: currentVariableAttributes,
      pageSize: pageSizeVariableAttributes,
    },
  });

  const {
    data: changeConfigurationsResult,
    isLoading: isConfigurationsLoading,
    error: configurationsError,
  } = useList<ChangeConfiguration>({
    resource: 'ChangeConfigurations',
    meta: { gqlQuery: CHANGE_CONFIGURATION_LIST_QUERY },
    filters: configFilters,
    sorters: [{ field: 'key', order: 'asc' }],
    pagination: {
      current: currentChangeConfigurations,
      pageSize: pageSizeChangeConfigurations,
    },
  });

  const {
    data: variableAttributesForDownload,
    isLoading: isAttributesDownloadLoading,
  } = useList<VariableAttribute>({
    resource: 'VariableAttributes',
    meta: {
      gqlQuery: VARIABLE_ATTRIBUTE_DOWNLOAD_QUERY,
      gqlVariables: { stationId },
    },
    pagination: {
      mode: 'off',
    },
  });

  const {
    data: changeConfigurationsForDownload,
    isLoading: isDownloadChangeConfigurationsLoading,
  } = useList<ChangeConfiguration>({
    resource: 'ChangeConfigurations',
    meta: {
      gqlQuery: CHANGE_CONFIGURATION_DOWNLOAD_QUERY,
      gqlVariables: { stationId },
    },
    pagination: {
      mode: 'off',
    },
  });

  useEffect(() => {
    if (version === '2.0.1' && variableAttributesResult?.data) {
      setDataSource(
        variableAttributesResult.data.map((attribute) => ({
          key: attribute.id,
          type: attribute.type,
          value: attribute.value,
          component: `${attribute.Component?.name ?? '-'}:${attribute.Component?.instance ?? '-'}`,
          variable: `${attribute.Variable?.name ?? '-'}:${attribute.Variable?.instance ?? '-'}`,
          evse: `${attribute.Evse?.id ?? '-'}:${attribute.Evse?.connectorId ?? '-'}`,
        })),
      );
    } else if (version === '1.6' && changeConfigurationsResult?.data) {
      setDataSource(
        changeConfigurationsResult.data.map((config) => ({
          key: config.key,
          value: config.value,
        })),
      );
    }

    if (attributesError) {
      message.error('Failed to load variable attributes');
    }
    if (configurationsError) {
      message.error('Failed to load change configurations');
    }
  }, [
    version,
    variableAttributesResult,
    changeConfigurationsResult,
    attributesError,
    configurationsError,
  ]);

  const filteredDataSource = useMemo(() => {
    if (!searchTerm) return dataSource;
    const term = searchTerm.toLowerCase();
    return dataSource.filter((item) => {
      const valuesToCheck =
        version === '1.6'
          ? [item.key, item.value]
          : [item.type, item.value, item.component, item.variable, item.evse];
      return valuesToCheck.some((val) =>
        val?.toString().toLowerCase().includes(term),
      );
    });
  }, [dataSource, searchTerm, version]);

  const handleDownloadConfigurations = () => {
    if (version === '1.6') {
      if (!changeConfigurationsForDownload?.data) {
        message.error('No data available for download');
        return;
      }
      downloadCSV(
        `configurations_${stationId}_${version}_${new Date().toISOString()}`,
        ['Station Id', ...CONFIG_1_6_COLUMNS.map((col) => col.title)],
        changeConfigurationsForDownload.data,
        (item) => [item.stationId, item.key, item.value ?? ''],
      );
    } else {
      if (!variableAttributesForDownload?.data) {
        message.error('No data available for download');
        return;
      }
      downloadCSV(
        `configurations_${stationId}_${version}_${new Date().toISOString()}`,
        ['Station Id', ...CONFIG_2_0_1_COLUMNS.map((col) => col.title)],
        variableAttributesForDownload.data,
        (item) => [
          stationId,
          item.type,
          item.value,
          `${item.Component?.name ?? '-'}:${item.Component?.instance ?? '-'}`,
          `${item.Variable?.name ?? '-'}:${item.Variable?.instance ?? '-'}`,
          `${item.Evse?.id ?? '-'}:${item.Evse?.connectorId ?? '-'}`,
        ],
      );
    }
  };

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Text>Select OCPP Version</Text>
          <Row gutter={8} align="middle">
            <Col flex="auto">
              <Select
                value={version}
                onChange={(v) => setVersion(v)}
                style={{ width: '100%' }}
              >
                <Select.Option value="1.6">OCPP 1.6</Select.Option>
                <Select.Option value="2.0.1">OCPP 2.0.1</Select.Option>
              </Select>
            </Col>
            <Col>
              <Button
                type="default"
                onClick={handleDownloadConfigurations}
                loading={
                  isDownloadChangeConfigurationsLoading &&
                  isAttributesDownloadLoading
                }
              >
                Download CSV
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Text>Search</Text>
          <Search
            placeholder="Search..."
            allowClear
            onSearch={(val) => setSearchTerm(val)}
            style={{ width: '100%' }}
          />
        </Col>
      </Row>
      <Table
        bordered
        dataSource={filteredDataSource}
        columns={version === '1.6' ? CONFIG_1_6_COLUMNS : CONFIG_2_0_1_COLUMNS}
        pagination={
          version === '2.0.1'
            ? {
                current: currentVariableAttributes,
                pageSize: pageSizeVariableAttributes,
                total: variableAttributesResult?.total || 0,
                onChange: (page, pageSize) => {
                  setCurrentVariableAttributes(page);
                  setPageSizeVariableAttributes(pageSize);
                },
              }
            : {
                current: currentChangeConfigurations,
                pageSize: pageSizeChangeConfigurations,
                total: changeConfigurationsResult?.total || 0,
                onChange: (page, pageSize) => {
                  setCurrentChangeConfigurations(page);
                  setPageSizeChangeConfigurations(pageSize);
                },
              }
        }
        loading={
          version === '2.0.1' ? isAttributesLoading : isConfigurationsLoading
        }
      />
    </div>
  );
};

export default ChargingStationConfiguration;
