// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

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
    <div className="gauge flex items-center justify-center relative">
      <div className="before" />
      <div
        className="after"
        style={{
          backgroundImage: `conic-gradient(${color} ${percentage}%, gray ${percentage}%)`,
        }}
      />
      <span>{percentage}%</span>
    </div>
  );
};
