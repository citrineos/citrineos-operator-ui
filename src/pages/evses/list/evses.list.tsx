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
import { ConnectorsUpsert } from '../../connectors/upsert/connectors.upsert';
import { setSelectedChargingStation } from '../../../redux/selected.charging.station.slice';
import { useOne } from '@refinedev/core';
import { CHARGING_STATIONS_GET_QUERY } from '../../charging-stations/queries';
import { ResourceType } from '@util/auth';
import { getPlainToInstanceOptions } from '@util/tables';
import { IChargingStationDto } from '@citrineos/base';
import { IEvseDto } from '@citrineos/base';
import { IConnectorDto } from '@citrineos/base';

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
  const [evseId, setEvseId] = useState<number | null>(null);

  const { data, isLoading } = useOne<IChargingStationDto>({
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
      evseId: number | null = null,
    ) => {
      setModalType(type);
      setSelectedItem(item);
      setEvseId(evseId);
      setIsModalVisible(true);
    },
    [],
  );

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
    setModalType(null);
    setSelectedItem(null);
    setEvseId(null);
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
        title: 'Evse Type ID',
        dataIndex: 'evseTypeId',
        key: 'evseTypeId',
      },
      {
        title: 'Evse ID',
        dataIndex: 'evseId',
        key: 'evseId',
      },
      {
        title: 'Physical Reference',
        dataIndex: 'physicalReference',
        key: 'physicalReference',
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_: any, record: EvseDto) => (
          <div>
            <Button
              className="Secondary"
              onClick={() => openModal('evse', record)}
            >
              Edit
            </Button>
            <Button
              className="Secondary"
              onClick={() => openModal('connector', null, record.id || null)}
            >
              Add Connector
            </Button>
          </div>
        ),
      },
    ],
    [openModal],
  );

  const renderModalContent = () => {
    if (modalType === 'evse') {
      return (
        <EvseUpsert
          onSubmit={handleFormSubmit}
          evse={selectedItem as IEvseDto | null}
        />
      );
    }
    if (modalType === 'connector') {
      return (
        <ConnectorsUpsert
          onSubmit={handleFormSubmit}
          connector={selectedItem as IConnectorDto | null}
          evseId={evseId}
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
        <Button type="primary" onClick={() => openModal('evse')}>
          Add New Evse
        </Button>
      </Row>
      <Table
        rowKey="id"
        columns={columns}
        pagination={false}
        dataSource={station.evses || []}
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
