// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Tag } from 'antd';

const SEVERITY_LEVEL_TO_COLOR = {
  0: '#5c0011',
  1: '#a8071a',
  2: '#cf1322',
  3: '#f5222d',
  4: '#fa541c',
  5: '#fa8c16',
  6: '#faad14',
  7: '#ffec3d',
  8: '#5b8c00',
  9: '#13c2c2',
};

const FALLBACK_COLOR = '#eb2f96';

interface SeverityTagProps {
  value: number;
  min?: number;
  max?: number;
}

const SeverityTag: React.FC<SeverityTagProps> = ({ value }) => {
  const color = (SEVERITY_LEVEL_TO_COLOR as any)[value] ?? FALLBACK_COLOR;
  return <Tag color={color}>{value}</Tag>;
};

export default SeverityTag;
