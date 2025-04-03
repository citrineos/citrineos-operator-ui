import { Flex } from 'antd';
import React from 'react';

export interface GaugeProps {
  percentage: number;
  color: string;
}

export const Gauge: React.FC<GaugeProps> = ({
  percentage,
  color,
}: GaugeProps) => {
  return (
    <Flex className="gauge" align={'center'} justify={'center'}>
      <div className="before" />
      <div
        className="after"
        style={{
          backgroundImage: `conic-gradient(${color} ${percentage}%, gray ${percentage}%)`,
        }}
      />
      <span>{percentage}%</span>
    </Flex>
  );
};
