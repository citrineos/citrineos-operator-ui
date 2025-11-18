// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@lib/client/components/ui/tooltip';
import {
  ChargerStatusEnum,
  getStatusColor,
} from '@lib/client/pages/overview/charger-activity/charger.activity.card';

export interface CircleProps {
  status?: ChargerStatusEnum;
  color?: string;
}

export const Circle = ({
  status = ChargerStatusEnum.OFFLINE,
  color,
}: CircleProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`status-circle`}
            style={
              color
                ? { backgroundColor: color }
                : { backgroundColor: getStatusColor(status) }
            }
          ></div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{status}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
