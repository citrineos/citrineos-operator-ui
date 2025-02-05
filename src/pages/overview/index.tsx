import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Row } from 'antd';
import { OnlinePercentage } from './online-percentage';
import { OnlineStatus } from './online-status';

export const Overview = () => {
  return (
    <>
      <h2>Dashboard</h2>
      <Row
        style={{
          flexGrow: 1,
          flexFlow: 'row nowrap',
          gap: 'var(--ant-margin-sm)',
        }}
      >
        <OnlinePercentage />
        <OnlineStatus />
      </Row>
    </>
  );
};

export const routes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<Overview />} />
    </Routes>
  );
};
