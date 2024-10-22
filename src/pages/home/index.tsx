import React, { JSXElementConstructor, ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Col, Row } from 'antd';
import { OnlinePercentage } from './online-percentage';

interface ChartWrapperProps {
  title?: string;
  children: ReactElement<any, string | JSXElementConstructor<any>>;
  onResize: (width: number, height: number) => void;
}

export const ChartWrapper = ({
  title,
  children,
  onResize,
}: ChartWrapperProps) => {
  return (
    <Col className={'chart-wrapper'}>
      <h3>{title}</h3>
      <ResponsiveContainer onResize={onResize}>{children}</ResponsiveContainer>
    </Col>
  );
};

export const OnlineStatusBreakdown = () => {
  return (
    <ChartWrapper title={'Online Status Breakdown'}>
      <PieChart>
        <Pie
          data={[
            {
              name: 'Group A',
              value: 400,
            },
            {
              name: 'Group B',
              value: 300,
            },
            {
              name: 'Group C',
              value: 300,
            },
            {
              name: 'Group D',
              value: 200,
            },
            {
              name: 'Group E',
              value: 278,
            },
            {
              name: 'Group F',
              value: 189,
            },
          ]}
          dataKey="value"
          nameKey="date"
          cx="50%"
          cy="40%"
          outerRadius={150}
          fill="#82ca9d"
          label
        />
      </PieChart>
    </ChartWrapper>
  );
};

export const Home = () => {
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
        <OnlineStatusBreakdown />
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
