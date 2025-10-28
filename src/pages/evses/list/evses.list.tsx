// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Table, Button, Col, Row, Modal } from 'antd';
import { ArrowDownIcon } from '../../../components/icons/arrow.down.icon';
import { ConnectorsTable } from '../../connectors/list/connectors.table';
import { useDispatch } from 'react-redux';
import { EvseDto } from '../../../dtos/evse.dto';
import { EvseUpsert } from '../upsert/evses.upsert';
import { ConnectorDto } from '../../../dtos/connector.dto';
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

  const { data, isLoading, refetch } = useOne<IChargingStationDto>({
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

  const handleFormSubmit = useCallback(async () => {
    await refetch();
    closeModal();
  }, [closeModal, refetch]);

  useEffect(() => {
    dispatch(
      setSelectedChargingStation({
        selectedChargingStation: JSON.stringify(station),
      }),
    );
  }, [dispatch, station]);

  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

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
        render: (_: any, record: EvseDto) => {
          const evseId = record.id;
          if (evseId === undefined) return null;
          return (
            <Row
              className="view-connectors"
              justify="end"
              align="middle"
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                handleExpandToggle(record);
              }}
            >
              View Connectors
              <ArrowDownIcon
                className={
                  expandedRowKeys.includes(evseId) ? 'arrow rotate' : 'arrow'
                }
              />
              <Button
                className="Secondary"
                style={{ marginLeft: 8 }}
                onClick={(e) => {
                  e.stopPropagation();
                  openModal('evse', record);
                }}
              >
                Edit
              </Button>
              <Button
                className="Secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal('connector', null, evseId);
                }}
              >
                Add Connector
              </Button>
            </Row>
          );
        },
      },
    ],
    [openModal, expandedRowKeys],
  );

  const getCurrentEvse = useCallback(
    (item: EvseDto | ConnectorDto | null): IEvseDto | null => {
      if (!item || !station?.evses || modalType !== 'evse')
        return item as IEvseDto | null;

      const currentEvse = station.evses.find((evse) => evse.id === item.id);
      return currentEvse || (item as IEvseDto);
    },
    [station?.evses, modalType],
  );

  const getCurrentConnector = useCallback(
    (item: EvseDto | ConnectorDto | null): IConnectorDto | null => {
      if (!item || !station?.evses || modalType !== 'connector')
        return item as IConnectorDto | null;

      for (const evse of station.evses) {
        const currentConnector = evse.connectors?.find(
          (connector) => connector.id === item.id,
        );
        if (currentConnector) {
          return currentConnector;
        }
      }
      return item as IConnectorDto;
    },
    [station?.evses, modalType],
  );

  const renderModalContent = () => {
    if (modalType === 'evse') {
      const currentEvse = getCurrentEvse(selectedItem);
      return (
        <EvseUpsert
          onSubmit={handleFormSubmit}
          stationId={stationId}
          evse={currentEvse}
        />
      );
    }
    if (modalType === 'connector') {
      const currentConnector = getCurrentConnector(selectedItem);
      return (
        <ConnectorsUpsert
          onSubmit={handleFormSubmit}
          connector={currentConnector}
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

  const handleExpandToggle = (record: EvseDto) => {
    const evseId = record.id;
    if (evseId === undefined) return;
    const isExpanded = expandedRowKeys.includes(evseId);
    if (isExpanded) {
      setExpandedRowKeys((prev) => prev.filter((key) => key !== evseId));
    } else {
      setExpandedRowKeys((prev) => [...prev, evseId]);
    }
  };

  const handleConnectorEdit = (
    connector: IConnectorDto,
    evseId: number | undefined,
  ) => {
    if (evseId === undefined) return;
    openModal('connector', connector, evseId);
  };

  const handleConnectorAdd = (evseId: number | undefined) => {
    if (evseId === undefined) return;
    openModal('connector', null, evseId);
  };

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
        expandable={{
          expandIconColumnIndex: -1,
          expandedRowRender: (record: EvseDto) => {
            const evseId = record.id;
            if (evseId === undefined) return null;
            return (
              <ConnectorsTable
                connectors={record.connectors || []}
                onEdit={(connector) => handleConnectorEdit(connector, evseId)}
                onAdd={() => handleConnectorAdd(evseId)}
              />
            );
          },
          expandedRowKeys: expandedRowKeys.filter((key) => key !== undefined),
          onExpandedRowsChange: (expandedRows) => {
            setExpandedRowKeys(
              (expandedRows as React.Key[]).filter((key) => key !== undefined),
            );
          },
        }}
      />
      <Modal
        centered
        footer={null}
        open={isModalVisible}
        onCancel={closeModal}
        title={modalTitle}
        key={`${modalType}-${selectedItem?.id || 'new'}`}
      >
        {renderModalContent()}
      </Modal>
    </Col>
  );
};
