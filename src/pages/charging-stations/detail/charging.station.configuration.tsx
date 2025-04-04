import React, { useState, useEffect } from 'react';
import { Select, Table, Row, Col, Typography, message, Form } from 'antd';
import { useList } from '@refinedev/core';
import { VARIABLE_ATTRIBUTE_LIST_QUERY } from '../../../pages/variable-attributes/queries';
import { CHANGE_CONFIGURATION_LIST_QUERY } from './queries';

const { Text } = Typography;

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

export const ChargingStationConfiguration: React.FC<
  ChargingStationConfigurationProps
> = ({ stationId }) => {
  const [version, setVersion] = useState<'1.6' | '2.0.1'>('1.6');
  const [dataSource, setDataSource] = useState<any[]>([]);

  const [currentVariableAttributes, setCurrentVariableAttributes] = useState(1);
  const [pageSizeVariableAttributes, setPageSizeVariableAttributes] =
    useState(20);

  const [currentChangeConfigurations, setCurrentChangeConfigurations] =
    useState(1);
  const [pageSizeChangeConfigurations, setPageSizeChangeConfigurations] =
    useState(20);

  const {
    data: variableAttributesResult,
    isLoading: isAttributesLoading,
    error: attributesError,
  } = useList<VariableAttribute>({
    resource: 'VariableAttributes',
    meta: {
      gqlQuery: VARIABLE_ATTRIBUTE_LIST_QUERY,
    },
    filters: [{ field: 'stationId', operator: 'eq', value: stationId }],
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
    meta: {
      gqlQuery: CHANGE_CONFIGURATION_LIST_QUERY,
    },
    filters: [{ field: 'stationId', operator: 'eq', value: stationId }],
    sorters: [{ field: 'key', order: 'asc' }],
    pagination: {
      current: currentChangeConfigurations,
      pageSize: pageSizeChangeConfigurations,
    },
  });

  useEffect(() => {
    if (version === '2.0.1' && variableAttributesResult?.data) {
      const formattedData = variableAttributesResult.data.map(
        (attribute: VariableAttribute) => ({
          key: attribute.id,
          type: attribute.type,
          value: attribute.value,
          component: `${attribute.Component.name}:${attribute.Component.instance}`,
          variable: `${attribute.Variable.name}:${attribute.Variable.instance}`,
          evse: attribute.evseDatabaseId
            ? attribute.evseDatabaseId.toString()
            : '',
        }),
      );
      setDataSource(formattedData);
    } else if (version === '1.6' && changeConfigurationsResult?.data) {
      const formattedData = changeConfigurationsResult.data.map(
        (config: ChangeConfiguration) => ({
          key: config.key,
          keyField: config.key,
          value: config.value,
        }),
      );
      setDataSource(formattedData);
    }
    if (version === '2.0.1' && attributesError) {
      message.error('Failed to load variable attributes');
    }
    if (version === '1.6' && configurationsError) {
      message.error('Failed to load change configurations');
    }
  }, [
    version,
    variableAttributesResult,
    attributesError,
    changeConfigurationsResult,
    configurationsError,
    stationId,
  ]);

  const handleVersionChange = (value: '1.6' | '2.0.1') => {
    setVersion(value);
  };

  return (
    <div>
      <Row style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Text>Select OCPP Version</Text>
          <Select
            value={version}
            onChange={handleVersionChange}
            style={{ width: '100%' }}
          >
            <Select.Option value="1.6">OCPP 1.6</Select.Option>
            <Select.Option value="2.0.1">OCPP 2.0.1</Select.Option>
          </Select>
        </Col>
      </Row>
      <Table
        bordered
        dataSource={dataSource}
        columns={version === '1.6' ? CONFIG_1_6_COLUMNS : CONFIG_2_0_1_COLUMNS}
        rowClassName="editable-row"
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
