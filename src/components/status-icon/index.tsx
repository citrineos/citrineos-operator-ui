import React from 'react';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { red, green } from '@ant-design/colors';

interface StatusIconProps {
  value?: boolean | null;
}

export const StatusIcon: React.FC<StatusIconProps> = ({ value }) => {
  return value ? (
    <CheckCircleTwoTone twoToneColor={green.primary} />
  ) : (
    <CloseCircleTwoTone twoToneColor={red.primary} />
  );
};
