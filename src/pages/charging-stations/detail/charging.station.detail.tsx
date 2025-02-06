import { ChargingStationDto } from '../../../dtos/charging.station';
import React from 'react';
import { useOne } from '@refinedev/core';
import { Button, Card, Flex, Tabs, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import { CHARGING_STATIONS_GET_QUERY } from '../queries';
import { ResourceType } from '../../../resource-type';
import './style.scss';
import { EditOutlined } from '@ant-design/icons';
import { getPlainToInstanceOptions } from '@util/tables';
import { ChargingStationIcon } from '../../../components/icons/charging.station';

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
      <Card className="station-details">
        <Flex gap={16}>
          <Flex vertical>
            <div className="image-placeholder">
              <ChargingStationIcon width={108} height={108} />
            </div>
          </Flex>

          <Flex vertical flex="1 1 auto">
            <Flex>
              <Title level={3}>{station.id || 'Station Name'}</Title>
            </Flex>
            <Flex justify="space-between" gap={16}>
              <Flex vertical>
                <Text className="nowrap">Station ID: {station.id}</Text>
                <br />
                <Text className="nowrap">
                  Latitude: {station.location?.coordinates?.latitude}
                </Text>
                <Text className="nowrap">
                  Longitude: {station.location?.coordinates?.longitude}
                </Text>
              </Flex>

              <Flex vertical className="border-left">
                <table>
                  <tr>
                    <td>
                      <h5>Status</h5>
                    </td>
                    <td>
                      <Text>
                        {station.latestStatusNotifications?.[0]
                          ?.statusNotification?.connectorStatus || 'Unknown'}
                      </Text>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h5>TimeStamp</h5>
                    </td>
                    <td>
                      <Text>TimeStamp</Text>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h5>Model</h5>
                    </td>
                    <td>
                      <Text>AX32</Text>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h5>Vendor</h5>
                    </td>
                    <td>
                      <Text>
                        <Text>Zerova</Text>
                      </Text>
                    </td>
                  </tr>
                </table>
              </Flex>

              <Flex vertical className="border-left">
                <table>
                  <tr>
                    <td>
                      <h5>Firmware Version</h5>
                    </td>
                    <td>
                      <Text>v2.0.12-pr</Text>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h5>Connector Type</h5>
                    </td>
                    <td>
                      <Text>Connector Type</Text>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h5>Number of EVSEs</h5>
                    </td>
                    <td>
                      <Text>{station.evses?.length || '0'}</Text>
                    </td>
                  </tr>
                </table>
              </Flex>

              <Flex vertical>
                <Button type="text" icon={<EditOutlined />} />
              </Flex>
            </Flex>
            <Flex>
              <Flex gap={16} justify="space-between" align="center">
                <Flex>
                  <Button type="primary">Start Transaction</Button>
                  <Button type="primary" danger style={{ marginLeft: '8px' }}>
                    Stop Transaction
                  </Button>
                  <Button style={{ marginLeft: '8px' }}>Reset</Button>
                </Flex>
                <Flex>
                  <Text style={{ color: '#5469d4', cursor: 'pointer' }}>
                    Other Commands →
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Card>

      <Card>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="EVSEs" key="1">
            EVSEs content
          </Tabs.TabPane>
          <Tabs.TabPane tab="OCPP Logs" key="2">
            OCPP Logs content
          </Tabs.TabPane>
          <Tabs.TabPane tab="Configuration" key="3">
            Configuration content
          </Tabs.TabPane>
          <Tabs.TabPane tab="Sessions" key="4">
            Sessions content
          </Tabs.TabPane>
          <Tabs.TabPane tab="Data" key="5">
            Data content
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
};
