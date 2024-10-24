import { Col } from 'antd';
import { ResponsiveContainer } from 'recharts';
import React, { JSXElementConstructor, ReactElement } from 'react';

export interface ChartWrapperProps {
  title?: string;
  children: ReactElement<any, string | JSXElementConstructor<any>>;
  onResize?: (width: number, height: number) => void;
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
