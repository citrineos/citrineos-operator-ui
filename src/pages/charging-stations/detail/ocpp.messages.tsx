import React, { useCallback, useEffect, useState } from 'react';
import { useTable } from '@refinedev/antd';
import { ResourceType } from '../../../resource-type';
import { GET_OCPP_MESSAGES_LIST_FOR_STATION } from '../queries';
import { getPlainToInstanceOptions } from '@util/tables';
import {
  OCPPMessageDto,
  OCPPMessageDtoProps,
  OCPPMessageOriginEnumType,
} from '../../../dtos/ocpp.message.dto';
import {
  Button,
  DatePicker,
  Flex,
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
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [highlightedCorrelationId, setHighlightedCorrelationId] = useState<
    string | null
  >(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const { tableProps, setFilters } = useTable<OCPPMessageDto>({
    resource: ResourceType.OCPP_MESSAGES,
    sorters: {
      permanent: [{ field: OCPPMessageDtoProps.timestamp, order: 'desc' }],
    },
    metaData: {
      gqlQuery: GET_OCPP_MESSAGES_LIST_FOR_STATION,
      gqlVariables: {
        stationId,
      },
    },
    queryOptions: getPlainToInstanceOptions(OCPPMessageDto),
  });

  const handleStartDateChange = (date: Dayjs | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Dayjs | null) => {
    setEndDate(date);
  };

  const handleLiveClick = () => {
    setStartDate(null);
    setEndDate(null);
  };

  useEffect(() => {
    updateFilters();
  }, [startDate, endDate]);

  const updateFilters = () => {
    const filters: CrudFilter[] = [];
    if (startDate) {
      filters.push({
        field: OCPPMessageDtoProps.timestamp,
        operator: 'gte',
        value: startDate.toISOString(),
      });
    } else {
      filters.push({
        field: OCPPMessageDtoProps.timestamp,
        operator: 'gte',
        value: undefined,
      });
    }
    if (endDate) {
      filters.push({
        field: OCPPMessageDtoProps.timestamp,
        operator: 'lte',
        value: endDate.toISOString(),
      });
    } else {
      filters.push({
        field: OCPPMessageDtoProps.timestamp,
        operator: 'lte',
        value: undefined,
      });
    }
    setFilters(
      filters.length > 1 ? [{ operator: 'and', value: filters }] : filters,
    );
  };

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
        setSelectedRowKeys([relatedMessage.id]);

        // Scroll to the related message
        const element = document.getElementById(
          `ocpp-row-${relatedMessage.id}`,
        );
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    },
    [tableProps.dataSource],
  );

  // This function now applies the class directly to the row element
  const getRowClassName = (record: OCPPMessageDto) => {
    return record.origin === OCPPMessageOriginEnumType.CS
      ? 'row-origin-cs'
      : 'row-origin-csms';
  };

  // Add row ID for scrolling to related messages
  const onRow = (record: OCPPMessageDto) => {
    return {
      id: `ocpp-row-${record.id}`,
    };
  };

  return (
    <Flex vertical gap={16}>
      <Flex gap={16}>
        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="Select Start Date"
          onChange={handleStartDateChange}
          value={startDate}
        />
        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="Select End Date"
          onChange={handleEndDateChange}
          value={endDate}
        />
        <Button onClick={handleLiveClick} className="secondary">
          Live
        </Button>
      </Flex>

      <div
        className="ocpp-table-container"
        style={{ width: '100%', overflowX: 'auto' }}
      >
        <Table
          rowKey="id"
          rowClassName={getRowClassName}
          onRow={onRow}
          scroll={{ x: 'max-content' }}
          {...tableProps}
        >
          <Table.Column
            key="correlationId"
            dataIndex="correlationId"
            title="Correlation ID"
            onCell={() => ({
              className: 'nowrap',
            })}
            render={(correlationId, record: OCPPMessageDto) => (
              <div
                className={`${correlationId === highlightedCorrelationId ? 'highlighted-correlation-cell' : ''}`}
              >
                <Space>
                  <Text code copyable={{ text: correlationId }}>
                    {correlationId.substring(0, 8)}...
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
              </div>
            )}
            width={200}
          />
          <Table.Column
            key={OCPPMessageDtoProps.action}
            dataIndex={OCPPMessageDtoProps.action}
            title="Action-Origin"
            onCell={() => ({
              className: 'column-action',
            })}
            render={(action: any, record: OCPPMessageDto) => {
              return `${action}-${record.origin}`;
            }}
            width={150}
          />
          <Table.Column
            key={OCPPMessageDtoProps.message}
            dataIndex={OCPPMessageDtoProps.message}
            title="Content"
            onCell={() => ({
              className: 'column-message',
            })}
            render={(message: any, record: OCPPMessageDto) => (
<<<<<<< Updated upstream
              <CollapsibleOCPPMessageViewer
                ocppMessage={message}
                unparsed={!record.action}
              />
=======
              <CollapsibleOCPPMessageViewer ocppMessage={message} unparsed={typeof message === 'string'} />
>>>>>>> Stashed changes
            )}
          />
        </Table>
      </div>
    </Flex>
  );
};
