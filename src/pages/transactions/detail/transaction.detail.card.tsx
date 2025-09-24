// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Descriptions, Flex, Typography } from 'antd';
import { ArrowLeftIcon } from '../../../components/icons/arrow.left.icon';
import { MenuSection } from '../../../components/main-menu/main.menu';
import { Link, useNavigation } from '@refinedev/core';
import { useLocation } from 'react-router-dom';
import { ITransactionDto } from '@citrineos/base';
import { TimestampDisplay } from '../../../components/timestamp-display';

const { Text } = Typography;
const emptyValue = '-';

export interface TransactionDetailCardProps {
  transaction: ITransactionDto;
}

export const TransactionDetailCard = ({
  transaction,
}: TransactionDetailCardProps) => {
  const { goBack, push } = useNavigation();
  const pageLocation = useLocation();

  return (
    <Flex gap={16}>
      <Flex gap={16} vertical flex="1 1 auto">
        <Flex gap={16} align={'center'}>
          <ArrowLeftIcon
            onClick={() => {
              if (pageLocation.key === 'default') {
                push(`/${MenuSection.TRANSACTIONS}`);
              } else {
                goBack();
              }
            }}
            style={{ cursor: 'pointer' }}
          />
          <h3>Transaction {transaction.transactionId}</h3>
          <Text type={transaction.isActive ? 'success' : 'danger'}>
            {transaction.isActive ? 'Active' : 'Inactive'}
          </Text>
        </Flex>
        <Descriptions
          layout="vertical"
          column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 5 }}
          colon={false}
          classNames={{
            label: 'description-label',
          }}
        >
          <Descriptions.Item label="Authorization">
            <Link to={`/authorizations/${transaction.authorizationId}`}>
              <Text className="hoverable-value" ellipsis>
                {transaction.authorization?.idToken}
              </Text>
            </Link>
          </Descriptions.Item>
          <Descriptions.Item label="Station ID">
            <Link to={`/charging-stations/${transaction.stationId}`}>
              <Text className="hoverable-value">{transaction.stationId}</Text>
            </Link>
          </Descriptions.Item>
          <Descriptions.Item label="Location">
            <Link to={`/locations/${transaction.locationId}`}>
              <Text className="hoverable-value">
                {transaction.location?.name ?? 'N/A'}
              </Text>
            </Link>
          </Descriptions.Item>
          <Descriptions.Item label="Total kWh">
            {transaction.totalKwh
              ? transaction.totalKwh.toFixed(2) + ' kWh'
              : emptyValue}
          </Descriptions.Item>
          <Descriptions.Item label="Charging State">
            {transaction.chargingState || emptyValue}
          </Descriptions.Item>
          <Descriptions.Item label="Start Time">
            <TimestampDisplay isoTimestamp={transaction.startTime ?? ''} />
          </Descriptions.Item>
          <Descriptions.Item label="End Time">
            <TimestampDisplay isoTimestamp={transaction.endTime ?? ''} />
          </Descriptions.Item>
        </Descriptions>
      </Flex>
    </Flex>
  );
};
