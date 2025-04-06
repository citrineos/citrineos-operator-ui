import { Route, Routes } from 'react-router-dom';
import React from 'react';
import { TransactionsList } from './list/transactions.list';
import { TransactionDetail } from './detail/transaction.detail';
import { ResourceType } from '../../resource-type';
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
    create: '/transactions/new',
    show: '/transactions/:id',
    edit: '/transactions/:id/edit',
    meta: {
      canDelete: true,
    },
    icon: <IoReceiptOutline />,
  },
];
