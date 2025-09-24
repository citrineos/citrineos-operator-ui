// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';
import { Button, Descriptions, Flex, message, Tag, Typography } from 'antd';
import { ArrowLeftIcon } from '../../../components/icons/arrow.left.icon';
import { MenuSection } from '../../../components/main-menu/main.menu';
import { useDelete, useNavigation } from '@refinedev/core';
import { useLocation } from 'react-router-dom';
import { AUTHORIZATIONS_DELETE_MUTATION } from '../queries';
import { ResourceType } from '@util/auth';
import {
  IAuthorizationDto,
  AuthorizationStatusType,
  IdTokenType,
} from '@citrineos/base';
import GenericTag from '../../../components/tag';
import { NOT_APPLICABLE } from '@util/consts';
import { DeleteOutlined } from '@ant-design/icons';

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
          push(`/${MenuSection.AUTHORIZATIONS}`);
        },
        onError: () => {
          message.error('Failed to delete authorization.');
        },
      },
    );
  }, [authorization, mutate, goBack]);

  return (
    <Flex gap={16}>
      <Flex gap={16} vertical flex="1 1 auto">
        <Flex gap={16} align="center">
          <ArrowLeftIcon
            onClick={() => {
              if (loc.key === 'default') {
                push(`/${MenuSection.AUTHORIZATIONS}`);
              } else {
                goBack();
              }
            }}
            style={{ cursor: 'pointer' }}
          />
          <h3>Authorization {authorization.id}</h3>
          <Text
            type={
              authorization.status === AuthorizationStatusType.Accepted
                ? 'success'
                : 'danger'
            }
          >
            {authorization.status}
          </Text>
          <Button
            className="error btn-md"
            icon={<DeleteOutlined />}
            iconPosition="end"
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
        </Flex>
        <Descriptions
          layout="vertical"
          column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 5 }}
          colon={false}
          classNames={{
            label: 'description-label',
          }}
        >
          <Descriptions.Item label="ID Token">
            {authorization.idToken}
          </Descriptions.Item>
          <Descriptions.Item label="Type">
            <GenericTag
              enumValue={authorization.idTokenType ?? undefined}
              enumType={IdTokenType}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <GenericTag
              enumValue={authorization.status}
              enumType={AuthorizationStatusType}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Partner">
            {!authorization.tenantPartner?.partnerProfileOCPI?.roles?.[0]
              ?.businessDetails?.name ? (
              NOT_APPLICABLE
            ) : (
              <a
                onClick={() =>
                  push(
                    `/${MenuSection.PARTNERS}/${authorization.tenantPartner?.id}`,
                  )
                }
              >
                {
                  authorization.tenantPartner?.partnerProfileOCPI?.roles?.[0]
                    ?.businessDetails?.name
                }
              </a>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Allowed Types">
            {authorization.allowedConnectorTypes
              ? authorization.allowedConnectorTypes.map((connectorType) => (
                  <Tag key={connectorType}>{connectorType}</Tag>
                ))
              : NOT_APPLICABLE}
          </Descriptions.Item>
          <Descriptions.Item label="Disallowed Prefixes">
            {authorization.disallowedEvseIdPrefixes
              ? authorization.disallowedEvseIdPrefixes.map((prefix) => (
                  <Tag key={prefix}>{prefix}</Tag>
                ))
              : NOT_APPLICABLE}
          </Descriptions.Item>
          <Descriptions.Item label="Concurrent Transactions">
            <Text
              type={authorization.concurrentTransaction ? 'success' : 'danger'}
            >
              {authorization.concurrentTransaction ? 'Allowed' : 'Not Allowed'}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Real-Time Authentication">
            {authorization.realTimeAuth || NOT_APPLICABLE}
          </Descriptions.Item>
          <Descriptions.Item label="Real-Time Authentication URL">
            {authorization.realTimeAuthUrl || NOT_APPLICABLE}
          </Descriptions.Item>
        </Descriptions>
      </Flex>
    </Flex>
  );
};
