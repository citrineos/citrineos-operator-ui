import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Row } from 'antd';
import { OnlinePercentage } from './online-percentage';
import { OnlineStatus } from './online-status';
import { HomeLocations } from './locations';

export const Home = () => {
  return (
    <>
      <h2>Dashboard</h2>
      <Row
        style={{
          height: '40vh',
          paddingBottom: '50px',
        }}
      >
        <HomeLocations />
      </Row>
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
      <Route index element={<Home />} />
    </Routes>
  );
};
