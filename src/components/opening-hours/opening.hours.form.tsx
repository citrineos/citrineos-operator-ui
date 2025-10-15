// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from 'react';
import {
  Card,
  Switch,
  Button,
  TimePicker,
  Select,
  DatePicker,
  Space,
  Row,
  Col,
  Typography,
  Divider,
  Popconfirm,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import {
  LocationHours,
  LocationRegularHours,
  LocationExceptionalPeriod,
} from '@citrineos/base';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface OpeningHoursFormProps {
  value?: LocationHours;
  onChange?: (value: LocationHours) => void;
}

const WEEKDAYS = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 7, label: 'Sunday' },
];

export const OpeningHoursForm: React.FC<OpeningHoursFormProps> = ({
  value,
  onChange,
}) => {
  const defaultValue: LocationHours = { twentyfourSeven: false };
  const [localValue, setLocalValue] = useState<LocationHours>(
    value || defaultValue,
  );

  useEffect(() => {
    setLocalValue(value || defaultValue);
  }, [value]);

  const handleChange = (newValue: LocationHours) => {
    setLocalValue(newValue);
    onChange?.(newValue);
  };

  const addRegularHours = () => {
    const newRegularHours: LocationRegularHours = {
      weekday: 1,
      periodBegin: '09:00',
      periodEnd: '17:00',
    };

    const updatedValue = {
      ...localValue,
      regularHours: [...(localValue.regularHours || []), newRegularHours],
    };
    handleChange(updatedValue);
  };

  const updateRegularHours = (
    index: number,
    field: keyof LocationRegularHours,
    value: any,
  ) => {
    const regularHours = [...(localValue.regularHours || [])];
    regularHours[index] = { ...regularHours[index], [field]: value };

    const updatedValue = {
      ...localValue,
      regularHours,
    };
    handleChange(updatedValue);
  };

  const removeRegularHours = (index: number) => {
    const regularHours = [...(localValue.regularHours || [])];
    regularHours.splice(index, 1);

    const updatedValue = {
      ...localValue,
      regularHours,
    };
    handleChange(updatedValue);
  };

  const addExceptionalPeriod = (
    type: 'exceptionalOpenings' | 'exceptionalClosings',
  ) => {
    const newPeriod: LocationExceptionalPeriod = {
      periodBegin: new Date(),
      periodEnd: new Date(),
    };

    const updatedValue = {
      ...localValue,
      [type]: [...(localValue[type] || []), newPeriod],
    };
    handleChange(updatedValue);
  };

  const updateExceptionalPeriod = (
    type: 'exceptionalOpenings' | 'exceptionalClosings',
    index: number,
    dates: [Dayjs | null, Dayjs | null] | null,
  ) => {
    if (!dates || !dates[0] || !dates[1]) return;

    const periods = [...(localValue[type] || [])];
    periods[index] = {
      periodBegin: dates[0].toDate(),
      periodEnd: dates[1].toDate(),
    };

    const updatedValue = {
      ...localValue,
      [type]: periods,
    };
    handleChange(updatedValue);
  };

  const removeExceptionalPeriod = (
    type: 'exceptionalOpenings' | 'exceptionalClosings',
    index: number,
  ) => {
    const periods = [...(localValue[type] || [])];
    periods.splice(index, 1);

    const updatedValue = {
      ...localValue,
      [type]: periods,
    };
    handleChange(updatedValue);
  };

  const toggle24Seven = (checked: boolean) => {
    const updatedValue = {
      ...localValue,
      twentyfourSeven: checked,
      // Clear regular hours if 24/7 is enabled
      regularHours: checked ? [] : localValue.regularHours,
    };
    handleChange(updatedValue);
  };

  return (
    <Card title="Opening Hours" size="small">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* 24/7 Toggle */}
        <Row>
          <Col span={24}>
            <Space>
              <Switch
                checked={localValue.twentyfourSeven}
                onChange={toggle24Seven}
              />
              <Text strong>24/7 Operation</Text>
            </Space>
          </Col>
        </Row>

        {/* Regular Hours */}
        {!localValue.twentyfourSeven && (
          <div>
            <Row justify="space-between" align="middle">
              <Col>
                <Title level={5}>Regular Hours</Title>
              </Col>
              <Col>
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={addRegularHours}
                  size="small"
                >
                  Add Hours
                </Button>
              </Col>
            </Row>

            {(localValue.regularHours || []).map((hours, index) => (
              <Card key={index} size="small" style={{ marginBottom: 8 }}>
                <Row gutter={16} align="middle">
                  <Col span={6}>
                    <Select
                      value={hours.weekday}
                      onChange={(value) =>
                        updateRegularHours(index, 'weekday', value)
                      }
                      style={{ width: '100%' }}
                      placeholder="Select day"
                    >
                      {WEEKDAYS.map((day) => (
                        <Select.Option key={day.value} value={day.value}>
                          {day.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={6}>
                    <TimePicker
                      value={
                        hours.periodBegin
                          ? dayjs(hours.periodBegin, 'HH:mm')
                          : null
                      }
                      onChange={(time) =>
                        updateRegularHours(
                          index,
                          'periodBegin',
                          time?.format('HH:mm') || '09:00',
                        )
                      }
                      format="HH:mm"
                      placeholder="Start time"
                      style={{ width: '100%' }}
                    />
                  </Col>
                  <Col span={6}>
                    <TimePicker
                      value={
                        hours.periodEnd ? dayjs(hours.periodEnd, 'HH:mm') : null
                      }
                      onChange={(time) =>
                        updateRegularHours(
                          index,
                          'periodEnd',
                          time?.format('HH:mm') || '17:00',
                        )
                      }
                      format="HH:mm"
                      placeholder="End time"
                      style={{ width: '100%' }}
                    />
                  </Col>
                  <Col span={6}>
                    <Popconfirm
                      title="Remove this time slot?"
                      onConfirm={() => removeRegularHours(index)}
                    >
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                      />
                    </Popconfirm>
                  </Col>
                </Row>
              </Card>
            ))}
          </div>
        )}

        <Divider />

        {/* Exceptional Openings */}
        <div>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={5}>Exceptional Openings</Title>
              <Text type="secondary">
                Special dates when the location is open
              </Text>
            </Col>
            <Col>
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => addExceptionalPeriod('exceptionalOpenings')}
                size="small"
              >
                Add Opening
              </Button>
            </Col>
          </Row>

          {(localValue.exceptionalOpenings || []).map((period, index) => (
            <Card key={index} size="small" style={{ marginBottom: 8 }}>
              <Row gutter={16} align="middle">
                <Col span={18}>
                  <RangePicker
                    value={[
                      period.periodBegin ? dayjs(period.periodBegin) : null,
                      period.periodEnd ? dayjs(period.periodEnd) : null,
                    ]}
                    onChange={(dates) =>
                      updateExceptionalPeriod(
                        'exceptionalOpenings',
                        index,
                        dates,
                      )
                    }
                    style={{ width: '100%' }}
                    placeholder={['Start date', 'End date']}
                  />
                </Col>
                <Col span={6}>
                  <Popconfirm
                    title="Remove this exceptional opening?"
                    onConfirm={() =>
                      removeExceptionalPeriod('exceptionalOpenings', index)
                    }
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                    />
                  </Popconfirm>
                </Col>
              </Row>
            </Card>
          ))}
        </div>

        <Divider />

        {/* Exceptional Closings */}
        <div>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={5}>Exceptional Closings</Title>
              <Text type="secondary">
                Special dates when the location is closed
              </Text>
            </Col>
            <Col>
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => addExceptionalPeriod('exceptionalClosings')}
                size="small"
              >
                Add Closing
              </Button>
            </Col>
          </Row>

          {(localValue.exceptionalClosings || []).map((period, index) => (
            <Card key={index} size="small" style={{ marginBottom: 8 }}>
              <Row gutter={16} align="middle">
                <Col span={18}>
                  <RangePicker
                    value={[
                      period.periodBegin ? dayjs(period.periodBegin) : null,
                      period.periodEnd ? dayjs(period.periodEnd) : null,
                    ]}
                    onChange={(dates) =>
                      updateExceptionalPeriod(
                        'exceptionalClosings',
                        index,
                        dates,
                      )
                    }
                    style={{ width: '100%' }}
                    placeholder={['Start date', 'End date']}
                  />
                </Col>
                <Col span={6}>
                  <Popconfirm
                    title="Remove this exceptional closing?"
                    onConfirm={() =>
                      removeExceptionalPeriod('exceptionalClosings', index)
                    }
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                    />
                  </Popconfirm>
                </Col>
              </Row>
            </Card>
          ))}
        </div>
      </Space>
    </Card>
  );
};
