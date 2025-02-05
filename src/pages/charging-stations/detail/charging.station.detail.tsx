import { ChargingStationDto } from '../../../dtos/charging.station';
import React from 'react';
import { useOne } from '@refinedev/core';
import { Button, Card, Col, Row, Tabs, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import { CHARGING_STATIONS_GET_QUERY } from '../queries';
import { ResourceType } from '../../../resource-type';
import './style.scss';
import { EditOutlined } from '@ant-design/icons';
import { getPlainToInstanceOptions } from '@util/tables';

const { Title, Text } = Typography;

export const ChargingStationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useOne<ChargingStationDto>({
    resource: ResourceType.CHARGING_STATIONS,
    id,
    meta: {
      gqlQuery: CHARGING_STATIONS_GET_QUERY,
    },
    queryOptions: getPlainToInstanceOptions(ChargingStationDto, true),
  });

  if (isLoading) return <p>Loading...</p>;
  if (!data?.data) return <p>No Data Found</p>;

  const station = data.data;

  console.log('station', station);

  return (
    <div style={{ padding: '16px' }}>
      <Card>
        <Row gutter={16} align="middle" justify="space-between">
          <Col span={2}>
            <div
              style={{
                width: '100px',
                height: '100px',
                background: '#e0e0e0',
                borderRadius: '50%',
              }}
            />
          </Col>

          <Col span={4}>
            <Title level={3}>{station.id || 'Station Name'}</Title>
            <Text>Station ID: {station.id}</Text>
            <br />
            <Text>Latitude: {station.location?.coordinates?.latitude}</Text>
            <br />
            <Text>Longitude: {station.location?.coordinates?.longitude}</Text>
          </Col>

          <Col span={4}>
            <Row>
              <Text strong>Status</Text>
              <br />
              <Text>
                {station.latestStatusNotifications?.[0]?.statusNotification
                  ?.connectorStatus || 'Unknown'}
              </Text>
            </Row>
            <Row>
              <Text strong>TimeStamp</Text>
              <br />
              <Text>TimeStamp</Text>
            </Row>
            <Row>
              <Text strong>Model</Text>
              <br />
              <Text>AX32</Text>
            </Row>
            <Row>
              <Text strong>Vendor</Text>
              <br />
              <Text>Zerova</Text>
            </Row>
          </Col>

          <Col span={4}>
            <Row>
              <Text strong>Firmware Version</Text>
              <br />
              <Text>v2.0.12-pr</Text>
            </Row>
            <Row>
              <Text strong>Connector Type</Text>
              <br />
              <Text>Connector Type</Text>
            </Row>
            <Row>
              <Text strong>Number of EVSEs</Text>
              <br />
              <Text>{station.evses?.length || '0'}</Text>
            </Row>
          </Col>

          <Col span={2} style={{ textAlign: 'right' }}>
            <Button type="text" icon={<EditOutlined />} />
          </Col>
        </Row>

        <Row gutter={16} justify="space-between" style={{ marginTop: '16px' }}>
          <Col>
            <Button type="primary">Start Transaction</Button>
            <Button type="primary" danger style={{ marginLeft: '8px' }}>
              Stop Transaction
            </Button>
            <Button style={{ marginLeft: '8px' }}>Reset</Button>
          </Col>
          <Col>
            <Text style={{ color: '#5469d4', cursor: 'pointer' }}>
              Other Commands →
            </Text>
          </Col>
        </Row>
      </Card>

      <Card style={{ marginTop: '16px' }}>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane
            tab={
              <Text strong style={{ color: '#f5a623' }}>
                EVSEs
              </Text>
            }
            key="1"
          ></Tabs.TabPane>
          <Tabs.TabPane tab="OCPP Logs" key="2">
            Placeholder content
          </Tabs.TabPane>
          <Tabs.TabPane tab="Configuration" key="3">
            Placeholder content
          </Tabs.TabPane>
          <Tabs.TabPane tab="Sessions" key="4">
            Placeholder content
          </Tabs.TabPane>
          <Tabs.TabPane tab="Data" key="5">
            Placeholder content
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
};
