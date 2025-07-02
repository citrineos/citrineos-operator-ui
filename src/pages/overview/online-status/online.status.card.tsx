// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Flex, Spin } from 'antd';
import React from 'react';
import { CanAccess, useCustom, useNavigation } from '@refinedev/core';
import './style.scss';
import { ArrowRightIcon } from '../../../components/icons/arrow.right.icon';
import { Circle, CircleStatusEnum } from '../circle/circle';
import { CHARGING_STATIONS_STATUS_COUNT_QUERY } from '../../charging-stations/queries';
import { MenuSection } from '../../../components/main-menu/main.menu';
import { ActionType, AccessDeniedFallback, ResourceType } from '@util/auth';

export const OnlineStatusCard = () => {
  const { push } = useNavigation();

  const { data, isLoading, error } = useCustom({
    meta: {
      gqlQuery: CHARGING_STATIONS_STATUS_COUNT_QUERY,
    },
  } as any);

  const onlineCount = data?.data?.online?.aggregate?.count || 0;
  const offlineCount = data?.data?.offline?.aggregate?.count || 0;

  if (isLoading) return <Spin />;
  if (error) return <p>Error loading counts</p>;

  return (
    <CanAccess
      resource={ResourceType.CHARGING_STATIONS}
      action={ActionType.LIST}
      fallback={<AccessDeniedFallback />}
    >
      <Flex vertical gap={32}>
        <Flex>
          <h4>Charger Online Status</h4>
        </Flex>
        <Flex gap={32}>
          <Flex vertical>
            <div className="online-status-number">{onlineCount}</div>
            <Flex align={'center'} gap={8}>
              <Circle />
              Online
            </Flex>
          </Flex>
          <Flex vertical>
            <div className="online-status-number">{offlineCount}</div>
            <Flex align={'center'} gap={8}>
              <Circle status={CircleStatusEnum.ERROR} />
              Offline
            </Flex>
          </Flex>
        </Flex>
        <Flex
          onClick={() => push(`/${MenuSection.CHARGING_STATIONS}`)}
          className="link"
        >
          View all chargers <ArrowRightIcon />
        </Flex>
      </Flex>
    </CanAccess>
  );
};
