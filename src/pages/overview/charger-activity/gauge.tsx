// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

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
