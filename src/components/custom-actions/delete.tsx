// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { Button, Modal, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useDelete, useNotification } from '@refinedev/core';
import { ResourceType } from '@util/auth';

interface CustomDeleteButtonProps {
  recordItemId: string;
  resource: ResourceType;
  onDeleteSuccess?: () => void; // Optional callback after successful deletion
  onDeleteError?: (error: any) => void; // Optional callback on error
  gqlMutation?: any;
}

export const DeleteButton: React.FC<CustomDeleteButtonProps> = ({
  recordItemId,
  resource,
  gqlMutation,
  onDeleteSuccess,
  onDeleteError,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { mutate: deleteRecord, isLoading } = useDelete({
    resource: resource,
    id: recordItemId,
    meta: {
      gqlMutation: gqlMutation!,
    },
  } as any);
  const notification: any = useNotification();

  const showDeleteConfirm = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    deleteRecord({
      resource: resource,
      id: recordItemId,
      meta: {
        gqlMutation: gqlMutation,
      },
      mutationOptions: {
        onSuccess: () => {
          notification.show({
            type: 'success',
            message: 'Delete Successful',
            description: 'The record has been deleted successfully.',
          });
          setIsModalVisible(false);
          if (onDeleteSuccess) onDeleteSuccess();
        },
        onError: (error: any) => {
          notification.show({
            type: 'error',
            message: 'Delete Failed',
            description:
              error?.message || 'An error occurred while deleting the record.',
          });
          setIsModalVisible(false);
          if (onDeleteError) onDeleteError(error);
        },
      },
    } as any);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Tooltip title="Delete">
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={showDeleteConfirm}
          disabled={isLoading}
          loading={isLoading}
        />
      </Tooltip>
      <Modal
        title="Confirm Deletion"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Delete"
        okButtonProps={{ danger: true, loading: isLoading }}
      >
        <p>Are you sure you want to delete this record?</p>
      </Modal>
    </>
  );
};
