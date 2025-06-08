// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTable } from '@refinedev/antd';
import { ResourceType } from '@util/auth';
import { GET_OCPP_MESSAGES_LIST_FOR_STATION } from '../queries';
import { getPlainToInstanceOptions } from '@util/tables';
import {
  OCPPMessageDto,
  OCPPMessageDtoProps,
  OCPPMessageOriginEnumType,
  OCPPMessageActionEnumType,
} from '../../../dtos/ocpp.message.dto';
import {
  Button,
  DatePicker,
  Flex,
  Input,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd';
import { Dayjs } from 'dayjs';
import { CrudFilter } from '@refinedev/core';
import { CollapsibleOCPPMessageViewer } from './collapsible.ocpp.message.viewer';
import { LinkOutlined } from '@ant-design/icons';
const { Text } = Typography;

export interface OCPPMessagesProps {
  stationId: string;
}

export const OCPPMessages: React.FC<OCPPMessagesProps> = ({ stationId }) => {
  const [highlightedCorrelationId, setHighlightedCorrelationId] = useState<
    string | null
  >(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [searchCid, setSearchCid] = useState<string>('');
  const [searchContent, setSearchContent] = useState<string>('');
  const [selectedActions, setSelectedActions] = useState<string[]>(['all']);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>(['all']);

  const { tableProps, setFilters } = useTable<OCPPMessageDto>({
    resource: ResourceType.OCPP_MESSAGES,
    sorters: {
      permanent: [{ field: OCPPMessageDtoProps.timestamp, order: 'desc' }],
    },
    metaData: {
      gqlQuery: GET_OCPP_MESSAGES_LIST_FOR_STATION,
      gqlVariables: { stationId },
    },
    queryOptions: getPlainToInstanceOptions(OCPPMessageDto),
  });

  const actionOptions = useMemo(
    () => [
      { label: 'All', value: 'all' },
      ...Object.values(OCPPMessageActionEnumType).map((a) => ({
        label: a,
        value: a,
      })),
    ],
    [],
  );
  const originOptions = useMemo(
    () => [
      { label: 'All', value: 'all' },
      ...Object.values(OCPPMessageOriginEnumType).map((o) => ({
        label: o.toUpperCase(),
        value: o,
      })),
    ],
    [],
  );

  const updateFilters = () => {
    const filters: CrudFilter[] = [];
    filters.push({
      field: OCPPMessageDtoProps.timestamp,
      operator: 'gte',
      value: startDate?.toISOString(),
    });
    filters.push({
      field: OCPPMessageDtoProps.timestamp,
      operator: 'lte',
      value: endDate?.toISOString(),
    });
    if (searchCid.trim()) {
      filters.push({
        field: OCPPMessageDtoProps.correlationId,
        operator: 'contains',
        value: searchCid,
      });
    }
    if (!selectedActions.includes('all')) {
      filters.push({
        field: OCPPMessageDtoProps.action,
        operator: 'in',
        value: selectedActions,
      });
    }
    if (!selectedOrigins.includes('all')) {
      filters.push({
        field: OCPPMessageDtoProps.origin,
        operator: 'in',
        value: selectedOrigins,
      });
    }
    setFilters(
      filters.length > 1 ? [{ operator: 'and', value: filters }] : filters,
    );
  };

  useEffect(() => {
    updateFilters();
  }, [startDate, endDate, searchCid, selectedActions, selectedOrigins]);

  const filteredData: OCPPMessageDto[] = (tableProps.dataSource ?? []).filter(
    (item) =>
      searchContent.trim()
        ? JSON.stringify(item.message)
            .toLowerCase()
            .includes(searchContent.toLowerCase())
        : true,
  );

  const findRelatedMessages = useCallback(
    (record: OCPPMessageDto) => {
      setHighlightedCorrelationId(record.correlationId);
      // Find and select the row with the same correlationId but different origin
      const relatedMessage = tableProps.dataSource?.find(
        (msg) =>
          msg.correlationId === record.correlationId &&
          msg.origin !== record.origin,
      );
      if (relatedMessage) {
        setHighlightedCorrelationId(relatedMessage.correlationId);
        // Scroll to the related message
        const element = document.getElementById(
          `ocpp-row-${relatedMessage.id}`,
        );
        if (element)
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    },
    [tableProps.dataSource],
  );

  // This function now applies the class directly to the row element
  const getRowClassName = (record: OCPPMessageDto) =>
    record.origin === OCPPMessageOriginEnumType.CS
      ? 'row-origin-cs'
      : 'row-origin-csms';

  // Add row ID for scrolling to related messages
  const onRow = (record: OCPPMessageDto) => ({
    id: `ocpp-row-${record.id}`,
  });

  return (
    <Flex vertical gap={16}>
      <Flex gap={16}>
        <Input.Search
          placeholder="Search correlation ID"
          allowClear
          value={searchCid}
          onChange={(e) => setSearchCid(e.target.value)}
          style={{ width: 250 }}
        />
        <Select
          mode="multiple"
          placeholder="Filter Actions"
          value={selectedActions}
          onChange={(vals) =>
            vals.includes('all')
              ? setSelectedActions(['all'])
              : setSelectedActions(vals)
          }
          options={actionOptions}
          style={{ minWidth: 200 }}
        />
        <Select
          mode="multiple"
          placeholder="Filter Origins"
          value={selectedOrigins}
          onChange={(vals) =>
            vals.includes('all')
              ? setSelectedOrigins(['all'])
              : setSelectedOrigins(vals)
          }
          options={originOptions}
          style={{ minWidth: 200 }}
        />
        <Input.Search
          placeholder="Search content"
          allowClear
          value={searchContent}
          onChange={(e) => setSearchContent(e.target.value)}
          style={{ width: 250 }}
        />
        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="Select Start Date"
          onChange={setStartDate}
          value={startDate}
        />
        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="Select End Date"
          onChange={setEndDate}
          value={endDate}
        />
        <Button
          onClick={() => {
            setStartDate(null);
            setEndDate(null);
          }}
          className="secondary"
        >
          Live
        </Button>
      </Flex>

      <div
        className="ocpp-table-container"
        style={{ width: '100%', overflowX: 'auto' }}
      >
        <Table<OCPPMessageDto>
          {...tableProps}
          dataSource={filteredData}
          rowKey="id"
          rowClassName={getRowClassName}
          onRow={onRow}
          scroll={{ x: 'max-content' }}
        >
          <Table.Column<OCPPMessageDto>
            key="correlationId"
            dataIndex="correlationId"
            title="Correlation ID"
            onCell={() => ({ className: 'nowrap' })}
            render={(correlationId, record) => (
              <Space>
                <Text code copyable={{ text: correlationId }}>
                  {correlationId.substring(0, 8)}…
                </Text>
                <Tooltip title="Find related message">
                  <Button
                    type="text"
                    size="small"
                    icon={<LinkOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      findRelatedMessages(record);
                    }}
                  />
                </Tooltip>
              </Space>
            )}
            width={200}
          />
          <Table.Column<OCPPMessageDto>
            key="action-origin"
            title="Action-Origin"
            render={(_, record) => `${record.action}-${record.origin}`}
            width={180}
          />
          <Table.Column<OCPPMessageDto>
            key="message"
            dataIndex="message"
            title="Content"
            onCell={() => ({ className: 'column-message' })}
            render={(message) => (
              <CollapsibleOCPPMessageViewer
                ocppMessage={message}
                unparsed={typeof message === 'string'}
              />
            )}
          />
        </Table>
      </div>
    </Flex>
  );
};
