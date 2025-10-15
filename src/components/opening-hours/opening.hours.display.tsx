// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Card, Tag, Typography, Space, Divider, List } from 'antd';
import { ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { LocationHours } from '@citrineos/base';
import { NOT_APPLICABLE } from '@util/consts';

const { Title, Text } = Typography;

interface OpeningHoursDisplayProps {
  openingHours?: LocationHours | null;
}

const WEEKDAY_NAMES = [
  '', // 0 index unused
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const OpeningHoursDisplay: React.FC<OpeningHoursDisplayProps> = ({
  openingHours,
}) => {
  if (!openingHours) {
    return (
      <Card title="Opening Hours" size="small">
        <Text type="secondary">{NOT_APPLICABLE}</Text>
      </Card>
    );
  }

  const {
    twentyfourSeven,
    regularHours,
    exceptionalOpenings,
    exceptionalClosings,
  } = openingHours;

  const formatTime = (time: string) => {
    return dayjs(time, 'HH:mm').format('h:mm A');
  };

  const formatDateRange = (start: Date, end: Date) => {
    const startDate = dayjs(start);
    const endDate = dayjs(end);

    if (startDate.isSame(endDate, 'day')) {
      return startDate.format('MMM D, YYYY');
    }

    return `${startDate.format('MMM D, YYYY')} - ${endDate.format('MMM D, YYYY')}`;
  };

  // Group regular hours by weekday and sort
  const sortedRegularHours = (regularHours || [])
    .slice()
    .sort((a, b) => a.weekday - b.weekday);

  return (
    <Card
      title={
        <Space>
          <ClockCircleOutlined />
          Opening Hours
        </Space>
      }
      size="small"
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* 24/7 Status */}
        {twentyfourSeven ? (
          <div>
            <Tag
              color="green"
              style={{ fontSize: '14px', padding: '4px 12px' }}
            >
              24/7 Operation
            </Tag>
            <br />
            <Text type="secondary">
              This location is open 24 hours a day, 7 days a week
            </Text>
          </div>
        ) : (
          <div>
            {/* Regular Hours */}
            {sortedRegularHours.length > 0 ? (
              <div>
                <Title level={5} style={{ marginBottom: 12 }}>
                  Regular Hours
                </Title>
                <List
                  size="small"
                  dataSource={sortedRegularHours}
                  renderItem={(hours) => (
                    <List.Item style={{ padding: '4px 0', border: 'none' }}>
                      <Space
                        style={{
                          width: '100%',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Text strong>{WEEKDAY_NAMES[hours.weekday]}</Text>
                        <Text>
                          {formatTime(hours.periodBegin)} -{' '}
                          {formatTime(hours.periodEnd)}
                        </Text>
                      </Space>
                    </List.Item>
                  )}
                />
              </div>
            ) : (
              <div>
                <Title level={5} style={{ marginBottom: 12 }}>
                  Regular Hours
                </Title>
                <Text type="secondary">No regular hours specified</Text>
              </div>
            )}
          </div>
        )}

        {/* Exceptional Openings */}
        {(exceptionalOpenings?.length || 0) > 0 && (
          <>
            <Divider style={{ margin: '12px 0' }} />
            <div>
              <Title level={5} style={{ marginBottom: 12 }}>
                <Space>
                  <CalendarOutlined />
                  Exceptional Openings
                </Space>
              </Title>
              <List
                size="small"
                dataSource={exceptionalOpenings || []}
                renderItem={(period) => (
                  <List.Item style={{ padding: '4px 0', border: 'none' }}>
                    <Space>
                      <Tag color="blue">Special Opening</Tag>
                      <Text>
                        {formatDateRange(period.periodBegin, period.periodEnd)}
                      </Text>
                    </Space>
                  </List.Item>
                )}
              />
            </div>
          </>
        )}

        {/* Exceptional Closings */}
        {(exceptionalClosings?.length || 0) > 0 && (
          <>
            <Divider style={{ margin: '12px 0' }} />
            <div>
              <Title level={5} style={{ marginBottom: 12 }}>
                <Space>
                  <CalendarOutlined />
                  Exceptional Closings
                </Space>
              </Title>
              <List
                size="small"
                dataSource={exceptionalClosings || []}
                renderItem={(period) => (
                  <List.Item style={{ padding: '4px 0', border: 'none' }}>
                    <Space>
                      <Tag color="red">Closed</Tag>
                      <Text>
                        {formatDateRange(period.periodBegin, period.periodEnd)}
                      </Text>
                    </Space>
                  </List.Item>
                )}
              />
            </div>
          </>
        )}
      </Space>
    </Card>
  );
};
