// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useCustomMutation } from '@refinedev/core';
import { PARTNER_UPDATE_MUTATION } from '../queries';
interface Endpoint {
  identifier: string;
  url: string;
}

interface PartnerEndpointsTableProps {
  partnerId: number | undefined;
  endpoints: Endpoint[];
  partnerProfileOCPI: any;
}

export const PartnerEndpointsTable: React.FC<PartnerEndpointsTableProps> = ({
  partnerId,
  endpoints,
  partnerProfileOCPI,
}) => {
  const [data, setData] = useState<Endpoint[]>(endpoints || []);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    setData(endpoints || []);
  }, [endpoints]);

  const [form] = Form.useForm();

  const { mutate, isLoading } = useCustomMutation();

  const edit = (record: Endpoint) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.identifier);
    setModalVisible(true);
  };

  const cancel = () => {
    setEditingKey(null);
    setModalVisible(false);
    form.resetFields();
  };

  const isValidPartnerId = typeof partnerId === 'number' && partnerId > 0;

  const save = async () => {
    if (!isValidPartnerId) return;
    try {
      const row = await form.validateFields();
      const newData = [...data];
      if (editingKey) {
        const index = newData.findIndex(
          (item) => item.identifier === editingKey,
        );
        if (index > -1) {
          newData[index] = row;
        }
      } else {
        newData.push(row);
      }
      setData(newData);
      setEditingKey(null);
      setModalVisible(false);
      form.resetFields();
      updateEndpoints(newData);
    } catch (err) {
      // Validation error
    }
  };

  const updateEndpoints = (newEndpoints: Endpoint[]) => {
    if (!isValidPartnerId) {
      return;
    }
    mutate({
      url: '', // Required by useCustomMutation, not used for GraphQL
      method: 'post', // Required by useCustomMutation
      values: {}, // Required by useCustomMutation
      meta: {
        gqlMutation: PARTNER_UPDATE_MUTATION,
        gqlVariables: {
          id: partnerId,
          object: {
            partnerProfileOCPI: {
              ...partnerProfileOCPI,
              endpoints: newEndpoints,
            },
          },
        },
      },
    });
  };

  const handleDelete = (identifier: string) => {
    if (!isValidPartnerId) return;
    const newData = data.filter((item) => item.identifier !== identifier);
    setData(newData);
    updateEndpoints(newData);
  };

  const columns = [
    {
      title: 'Identifier',
      dataIndex: 'identifier',
      key: 'identifier',
      editable: true,
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      editable: true,
      render: (url: string) => (
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Endpoint) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => edit(record)}
            disabled={!isValidPartnerId}
          />
          <Popconfirm
            title="Delete endpoint?"
            onConfirm={() => handleDelete(record.identifier)}
            disabled={!isValidPartnerId}
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              disabled={!isValidPartnerId}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => {
          setEditingKey(null);
          setModalVisible(true);
          form.resetFields();
        }}
        disabled={!isValidPartnerId}
      >
        Add Endpoint
      </Button>
      <Table
        rowKey="identifier"
        columns={columns}
        dataSource={data}
        pagination={false}
      />
      <Modal
        title={editingKey ? 'Edit Endpoint' : 'Add Endpoint'}
        open={modalVisible}
        onCancel={cancel}
        onOk={save}
        confirmLoading={isLoading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Identifier"
            name="identifier"
            rules={[{ required: true, message: 'Please input identifier' }]}
          >
            <Input disabled={!!editingKey} />
          </Form.Item>
          <Form.Item
            label="URL"
            name="url"
            rules={[{ required: true, message: 'Please input URL' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
