// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Flex, Typography } from 'antd';
import { ArrowLeftIcon } from '../../../components/icons/arrow.left.icon';
import { MenuSection } from '../../../components/main-menu/main.menu';
import { useNavigation } from '@refinedev/core';
import { TransactionDto } from '../../../dtos/transaction.dto';
import { BiDirectionsArrowsIcon } from '../../../components/icons/bi.directional.arrows.icon';
import { useLocation } from 'react-router-dom';

const { Text } = Typography;

export interface TransactionDetailCardProps {
  transaction: TransactionDto;
}

export const TransactionDetailCard = ({
  transaction,
}: TransactionDetailCardProps) => {
  const { goBack, push } = useNavigation();
  const pageLocation = useLocation();

  return (
    <Flex gap={16}>
      <Flex vertical>
        <div className="image-placeholder">
          <BiDirectionsArrowsIcon width={164} height={164} />
        </div>
      </Flex>

      <Flex vertical flex="1">
        <Flex gap={8} align="center" style={{ marginBottom: 16 }}>
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
          <Text
            style={{ marginLeft: 8 }}
            type={transaction.isActive ? 'success' : 'danger'}
          >
            {transaction.isActive ? 'Active' : 'Inactive'}
          </Text>
        </Flex>

        <Flex justify="space-between" gap={16} className="transaction-details">
          <Flex vertical>
            <table className="transaction-details-table">
              <tbody>
                <tr>
                  <td>
                    <h5>Transaction ID</h5>
                  </td>
                  <td>{transaction.transactionId}</td>
                </tr>
                <tr>
                  <td>
                    <h5>Station ID</h5>
                  </td>
                  <td>{transaction.stationId}</td>
                </tr>
              </tbody>
            </table>
          </Flex>

          <Flex vertical className="border-left">
            <table className="transaction-details-table">
              <tbody>
                <tr>
                  <td>
                    <h5>Total kWh</h5>
                  </td>
                  <td>
                    {transaction.totalKwh
                      ? transaction.totalKwh.toFixed(2) + ' kWh'
                      : '-'}
                  </td>
                </tr>
                <tr>
                  <td>
                    <h5>Charging State</h5>
                  </td>
                  <td>{transaction.chargingState || '-'}</td>
                </tr>
              </tbody>
            </table>
          </Flex>

          <Flex vertical className="border-left">
            <table className="transaction-details-table">
              <tbody>
                <tr>
                  <td>
                    <h5>Created At</h5>
                  </td>
                  <td>
                    {transaction.createdAt
                      ? new Date(transaction.createdAt).toLocaleString()
                      : '-'}
                  </td>
                </tr>
                <tr>
                  <td>
                    <h5>Updated At</h5>
                  </td>
                  <td>
                    {transaction.updatedAt
                      ? new Date(transaction.updatedAt).toLocaleString()
                      : '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
