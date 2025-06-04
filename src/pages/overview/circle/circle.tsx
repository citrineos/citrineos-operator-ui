// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import './style.scss';

export enum CircleStatusEnum {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
}

export interface CircleProps {
  status?: CircleStatusEnum;
  color?: string;
}

export const Circle = ({
  status = CircleStatusEnum.SUCCESS,
  color,
}: CircleProps) => {
  return (
    <div
      className={`status-circle ${status}`}
      style={color ? { backgroundColor: color } : {}}
    ></div>
  );
};
