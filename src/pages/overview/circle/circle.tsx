// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Tooltip } from 'antd';
import './style.scss';
import {
  ChargerStatusEnum,
  getStatusColor,
} from '../charger-activity/charger.activity.card';

export interface CircleProps {
  status?: ChargerStatusEnum;
  color?: string;
}

export const Circle = ({
  status = ChargerStatusEnum.OFFLINE,
  color,
}: CircleProps) => {
  return (
    <Tooltip title={status}>
      <div
        className={`status-circle`}
        style={
          color
            ? { backgroundColor: color }
            : { backgroundColor: getStatusColor(status) }
        }
      ></div>
    </Tooltip>
  );
};
