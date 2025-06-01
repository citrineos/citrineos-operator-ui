// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';
import { Button, Flex, message, Typography } from 'antd';
import { ArrowLeftIcon } from '../../../components/icons/arrow.left.icon';
import { MenuSection } from '../../../components/main-menu/main.menu';
import { useDelete, useNavigation } from '@refinedev/core';
import { AuthorizationDto } from '../../../dtos/authoriation.dto';
import { ClipboardIcon } from '../../../components/icons/clipboard.icon';
import GenericTag from '../../../components/tag';
import { IdTokenEnumType, AuthorizationStatusEnumType } from '@OCPP2_0_1';
import { useLocation, Link } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';
import { AUTHORIZATIONS_DELETE_MUTATION } from '../queries';
import { ID_TOKEN_INFOS_DELETE_MUTATION } from '../../../pages/id-tokens-infos/queries';
import { ID_TOKENS_DELETE_MUTATION } from '../../../pages/id-tokens/queries';
import { ResourceType } from '@util/auth';

const { Text } = Typography;

export interface AuthorizationDetailCardProps {
  authorization: AuthorizationDto;
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
        id: authorization.id.toString(),
        resource: ResourceType.AUTHORIZATIONS,
        meta: {
          gqlMutation: AUTHORIZATIONS_DELETE_MUTATION,
        },
      },
      {
        onSuccess: () => {
          mutate(
            {
              id: authorization.idTokenId.toString(),
              resource: ResourceType.ID_TOKENS,
              meta: {
                gqlMutation: ID_TOKENS_DELETE_MUTATION,
              },
            },
            {
              onError: () => {
                message.error('Failed to delete id token.');
              },
            },
          );
          mutate(
            {
              id: authorization.idTokenInfoId.toString(),
              resource: ResourceType.ID_TOKEN_INFOS,
              meta: {
                gqlMutation: ID_TOKEN_INFOS_DELETE_MUTATION,
              },
            },
            {
              onError: () => {
                message.error('Failed to delete id token info.');
              },
            },
          );
          push(`/${MenuSection.AUTHORIZATIONS}`);
        },
        onError: () => {
          message.error('Failed to delete authorization.');
        },
      },
    );
  }, [authorization, mutate, push]);

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
          <Text
            style={{ marginLeft: 8 }}
            type={
              authorization.idTokenInfo?.status ===
              AuthorizationStatusEnumType.Accepted
                ? 'success'
                : 'danger'
            }
          >
            {authorization.idTokenInfo?.status}
          </Text>
        </Flex>

        <Flex justify="space-between" gap={32}>
          <Flex vertical gap={16}>
            <Text className="nowrap">
              <strong>ID:</strong> {authorization.id}
            </Text>
            <Text className="nowrap">
              <strong>Type:</strong>{' '}
              <GenericTag
                enumValue={authorization.idToken?.type}
                enumType={IdTokenEnumType}
              />
            </Text>
            <Text className="nowrap">
              <strong>Status:</strong>{' '}
              <GenericTag
                enumValue={authorization.idTokenInfo?.status}
                enumType={AuthorizationStatusEnumType}
                colorMap={{ [AuthorizationStatusEnumType.Accepted]: 'green' }}
              />
            </Text>
          </Flex>

          <Flex vertical gap={16} className="border-left">
            <Text className="nowrap">
              <strong>ID Token:</strong>{' '}
              <Link to={`/id-tokens/${authorization.idTokenId}`}>
                {authorization.idTokenId}
              </Link>
            </Text>
            <Text className="nowrap">
              <strong>Token Info ID:</strong> {authorization.idTokenInfoId}
            </Text>
          </Flex>

          <Flex vertical gap={16} className="border-left column-right">
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
