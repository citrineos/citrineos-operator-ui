// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Tag } from 'antd';
import { OCPPVersion } from '@citrineos/base';

const ProtocolTag = ({ protocol }: { protocol: string | null | undefined }) => {
  let color: string;
  let protocolName: string;

  switch (protocol) {
    case OCPPVersion.OCPP1_6:
      color = 'cyan';
      protocolName = 'OCPP 1.6';
      break;
    case OCPPVersion.OCPP2_0_1:
      color = 'purple';
      protocolName = 'OCPP 2.0.1';
      break;
    default:
      color = 'default';
      protocolName = 'Unknown';
      break;
  }

  return <Tag color={color}>{protocolName}</Tag>;
};

export default ProtocolTag;
