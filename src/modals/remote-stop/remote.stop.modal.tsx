// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { Flex } from 'antd';
import { ChargingStationDto } from '../../dtos/charging.station.dto';
import { plainToInstance } from 'class-transformer';
import { OCPPVersion } from '@citrineos/base';
import { OCPP2_0_1_RemoteStop } from './2.0.1';
import { OCPP1_6_RemoteStop } from './1.6';

export interface RemoteStopTransactionModalProps {
  station: ChargingStationDto;
}

export const RemoteStopTransactionModal = ({
  station,
}: RemoteStopTransactionModalProps) => {
  const parsedStation: ChargingStationDto = useMemo(
    () => plainToInstance(ChargingStationDto, station),
    [station],
  );

  // Dynamically render the appropriate component based on protocol version
  const renderCommandsByProtocol = () => {
    switch (parsedStation.protocol) {
      case OCPPVersion.OCPP1_6:
        return <OCPP1_6_RemoteStop station={parsedStation} />;
      case OCPPVersion.OCPP2_0_1:
        return <OCPP2_0_1_RemoteStop station={parsedStation} />;
      default:
        return (
          <div>Unsupported protocol version: {parsedStation.protocol}</div>
        );
    }
  };

  return <Flex>{renderCommandsByProtocol()}</Flex>;
};
