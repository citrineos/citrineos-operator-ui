// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';
import { Button, Flex, message, Typography } from 'antd';
import { ArrowLeftIcon } from '../../../components/icons/arrow.left.icon';
import { MenuSection } from '../../../components/main-menu/main.menu';
import { useDelete, useNavigation } from '@refinedev/core';
import { ClipboardIcon } from '../../../components/icons/clipboard.icon';
import { useLocation, Link } from 'react-router-dom';
import { AUTHORIZATIONS_DELETE_MUTATION } from '../queries';
import { ResourceType } from '@util/auth';
import { IAuthorizationDto } from '@citrineos/base';

const { Text } = Typography;

export interface AuthorizationDetailCardProps {
  authorization: IAuthorizationDto;
}

export const AuthorizationDetailCard: React.FC<
  AuthorizationDetailCardProps
> = ({ authorization }) => {
  const { goBack, push } = useNavigation();
  const loc = useLocation();
  const { mutate } = useDelete();

  const handleDeleteClick = useCallback(() => {
    if (!authorization) return;

    mutate(
      {
        id: authorization.id?.toString() || '',
        resource: ResourceType.AUTHORIZATIONS,
        meta: {
          gqlMutation: AUTHORIZATIONS_DELETE_MUTATION,
        },
      },
      {
        onSuccess: () => {
          // Remove deletion of idTokenId and idTokenInfo, as these do not exist
          goBack();
        },
        onError: () => {
          message.error('Failed to delete authorization.');
        },
      },
    );
  }, [authorization, mutate, goBack]);

  return (
    <Flex gap={24}>
      <Flex vertical>
        <div className="image-placeholder">
          <ClipboardIcon />
        </div>
      </Flex>

      <Flex vertical flex="1 1 auto">
        <Flex gap={8} align="center" style={{ marginBottom: 24 }}>
          <ArrowLeftIcon
            onClick={() => {
              if (loc.key === 'default') push(`/${MenuSection.AUTHORIZATIONS}`);
              else goBack();
            }}
            style={{ cursor: 'pointer' }}
          />
          <h3>Authorization {authorization.id}</h3>
        </Flex>

        <Flex justify="space-between" gap={32}>
          <Flex vertical gap={16}>
            <Text className="nowrap">
              <strong>ID:</strong> {authorization.id}
            </Text>
            <Text className="nowrap">
              <strong>ID Token:</strong> {authorization.idToken}
            </Text>
          </Flex>

          <Flex vertical gap={16} className="border-left">
            <Text className="nowrap">
              <strong>Allowed Types:</strong>{' '}
              {authorization.allowedConnectorTypes?.length
                ? authorization.allowedConnectorTypes.join(', ')
                : '—'}
            </Text>
            <Text className="nowrap">
              <strong>Disallowed Prefixes:</strong>{' '}
              {authorization.disallowedEvseIdPrefixes?.length
                ? authorization.disallowedEvseIdPrefixes.join(', ')
                : '—'}
            </Text>
            <Text className="nowrap">
              <strong>Allowing Concurrent Transactions:</strong>{' '}
              {authorization.concurrentTransaction ? 'True' : 'False'}
            </Text>
          </Flex>

          <Flex vertical>
            {/* <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() =>
                push(`/${MenuSection.AUTHORIZATIONS}/${authorization.id}/edit`)
              }
            /> */}
            <Button className="secondary" onClick={handleDeleteClick}>
              Delete
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
