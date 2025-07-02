// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Table, Button, Col, Row, Modal, Dropdown } from 'antd';
import { useDispatch } from 'react-redux';
import { EvseDto } from '../../../dtos/evse.dto';
import { EvseUpsert } from '../upsert/evses.upsert';
import { ConnectorDto } from '../../../dtos/connector.dto';
import { PlusIcon } from '../../../components/icons/plus.icon';
import { ChargingStationDto } from '../../../dtos/charging.station.dto';
import { ConnectorsUpsert } from '../../../pages/connectors/upsert/connectors.upsert';
import { setSelectedChargingStation } from '../../../redux/selected.charging.station.slice';
import { useOne } from '@refinedev/core';
import { CHARGING_STATIONS_GET_QUERY } from '../../../pages/charging-stations/queries';
import { ResourceType } from '@util/auth';
import { getPlainToInstanceOptions } from '@util/tables';

interface EVSESListProps {
  stationId: string;
}

export const EVSESList: React.FC<EVSESListProps> = ({ stationId }) => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'evse' | 'connector' | null>(null);
  const [selectedItem, setSelectedItem] = useState<
    EvseDto | ConnectorDto | null
  >(null);

  const { data, isLoading } = useOne<ChargingStationDto>({
    resource: ResourceType.CHARGING_STATIONS,
    id: stationId,
    meta: {
      gqlQuery: CHARGING_STATIONS_GET_QUERY,
    },
    queryOptions: getPlainToInstanceOptions(ChargingStationDto, true),
  });

  const station = data?.data;

  const openModal = useCallback(
    (
      type: 'evse' | 'connector',
      item: EvseDto | ConnectorDto | null = null,
    ) => {
      setModalType(type);
      setSelectedItem(item);
      setIsModalVisible(true);
    },
    [],
  );

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
    setModalType(null);
    setSelectedItem(null);
  }, []);

  const handleFormSubmit = useCallback(() => {
    closeModal();
  }, [closeModal]);

  // Dispatch the selected charging station to Redux
  useEffect(() => {
    dispatch(
      setSelectedChargingStation({
        selectedChargingStation: JSON.stringify(station),
      }),
    );
  }, [dispatch, station]);

  const columns = useMemo(
    () => [
      {
        title: 'Evse ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Connector ID',
        dataIndex: 'connectorId',
        key: 'connectorId',
      },
      {
        title: 'Database ID',
        dataIndex: 'databaseId',
        key: 'databaseId',
      },
      {
        title: 'Evse Status',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: EvseDto) => (
          <Button
            className="Secondary"
            onClick={() => openModal('evse', record)}
          >
            Edit
          </Button>
        ),
      },
    ],
    [openModal],
  );

  const menuItems = [
    {
      key: 'add-evse',
      label: 'Add New Evse',
      onClick: () => openModal('evse'),
    },
    {
      key: 'add-connector',
      label: 'Add New Connector',
      onClick: () => openModal('connector'),
    },
  ];

  const renderModalContent = () => {
    if (modalType === 'evse') {
      return (
        <EvseUpsert
          onSubmit={handleFormSubmit}
          evse={selectedItem as EvseDto | null}
        />
      );
    }
    if (modalType === 'connector') {
      return (
        <ConnectorsUpsert
          onSubmit={handleFormSubmit}
          connector={selectedItem as ConnectorDto | null}
        />
      );
    }
    return null;
  };

  const modalTitle = useMemo(() => {
    if (modalType === 'evse') {
      return selectedItem ? 'Edit Evse' : 'Add New Evse';
    }
    if (modalType === 'connector') {
      return selectedItem ? 'Edit Connector' : 'Add New Connector';
    }
    return '';
  }, [modalType, selectedItem]);

  if (isLoading) return <p>Loading...</p>;
  if (!station) return <p>No Data Found</p>;

  return (
    <Col>
      <Row justify="end" style={{ marginBottom: '16px' }}>
        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
          <Button type="primary">
            Actions <PlusIcon />
          </Button>
        </Dropdown>
      </Row>
      <Table
        rowKey="id"
        columns={columns}
        pagination={false}
        dataSource={station.evses}
      />
      <Modal
        centered
        footer={null}
        open={isModalVisible}
        onCancel={closeModal}
        title={modalTitle}
      >
        {renderModalContent()}
      </Modal>
    </Col>
  );
};
