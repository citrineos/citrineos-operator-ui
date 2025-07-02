// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useMemo, useState } from 'react';
import { Flex, Form, Spin } from 'antd';
import { useSelector } from 'react-redux';
import { selectIsModalOpen } from '../../redux/modal.slice';
import { plainToInstance } from 'class-transformer';
import { ChargingStationDto } from '../../dtos/charging.station.dto';
import { OCPPVersion } from '@citrineos/base';
import { OCPP1_6_Commands } from './1.6';
import { OCPP2_0_1_Commands } from './2.0.1';
export interface OtherCommandsModalProps {
  station: any;
}

export const OtherCommandsModal = ({ station }: OtherCommandsModalProps) => {
  const parsedStation: ChargingStationDto = useMemo(
    () => plainToInstance(ChargingStationDto, station),
    [station],
  );
  const [loading, setLoading] = useState<boolean>(false);
  const isModalOpen = useSelector(selectIsModalOpen);

  useEffect(() => {
    if (isModalOpen) {
      setLoading(false);
    }
  }, [isModalOpen]);

  if (loading) {
    return <Spin />;
  }

  // Dynamically render the appropriate component based on protocol version
  const renderCommandsByProtocol = () => {
    switch (parsedStation.protocol) {
      case OCPPVersion.OCPP1_6:
        return <OCPP1_6_Commands station={parsedStation} />;
      case OCPPVersion.OCPP2_0_1:
        return <OCPP2_0_1_Commands station={parsedStation} />;
      default:
        return (
          <div>Unsupported protocol version: {parsedStation.protocol}</div>
        );
    }
  };

  return <Flex>{renderCommandsByProtocol()}</Flex>;
};
