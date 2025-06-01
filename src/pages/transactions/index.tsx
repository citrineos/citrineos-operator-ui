// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Route, Routes } from 'react-router-dom';
import React from 'react';
import { TransactionsList } from './list/transactions.list';
import { TransactionDetail } from './detail/transaction.detail';
import { ResourceType } from '@util/auth';
import { IoReceiptOutline } from 'react-icons/io5';

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<TransactionsList />} />
      <Route path="/:id" element={<TransactionDetail />} />
    </Routes>
  );
};

export const resources = [
  {
    name: ResourceType.TRANSACTIONS,
    list: '/transactions',
    show: '/transactions/:id',
    meta: {
      canDelete: true,
    },
    icon: <IoReceiptOutline />,
  },
];
