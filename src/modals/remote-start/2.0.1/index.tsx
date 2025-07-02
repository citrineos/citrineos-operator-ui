// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { AutoComplete, Button, Flex, Form, InputNumber, Spin } from 'antd';
import { useSelect } from '@refinedev/antd';
import { ID_TOKENS_LIST_QUERY } from '../../../pages/id-tokens/queries';
import { useCustom } from '@refinedev/core';
import { CHARGING_STATION_SEQUENCES_GET_QUERY } from '../../../pages/charging-station-sequences/queries';
import { ChargingStationDto } from '../../../dtos/charging.station.dto';
import { ChargingStationSequenceType } from '@citrineos/base';
import { plainToInstance } from 'class-transformer';
import { ChargingStationSequenceDto } from '../../../dtos/charging.station.sequence.dto';
import { EvseDto } from '../../../dtos/evse.dto';
import { IdTokenDto, IdTokenDtoProps } from '../../../dtos/id.token.dto';
import { BaseDtoProps } from '../../../dtos/base.dto';
import { closeModal, selectIsModalOpen } from '../../../redux/modal.slice';
import { useDispatch, useSelector } from 'react-redux';
import { MessageConfirmation } from '../../../message/MessageConfirmation';
import { EvseSelector } from '../../shared/evse-selector/evse.selector';

import { triggerMessageAndHandleResponse } from '../../../message/util';
import { ResourceType } from '@util/auth';

export interface OCPP2_0_1_RemoteStartProps {
  station: ChargingStationDto;
}

export const OCPP2_0_1_RemoteStart = ({
  station,
}: OCPP2_0_1_RemoteStartProps) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [evseSelectorLoading, setEvseSelectorLoading] =
    useState<boolean>(false);
  const [idToken, setIdToken] = useState<IdTokenDto | null>(null);
  const isModalOpen = useSelector(selectIsModalOpen);

  const { data: requestIdResponse, isLoading: isLoadingRequestId } =
    useCustom<ChargingStationSequenceDto>({
      meta: {
        gqlQuery: CHARGING_STATION_SEQUENCES_GET_QUERY,
        variables: {
          stationId: station.id,
          type: ChargingStationSequenceType.remoteStartId,
        },
      },
      queryOptions: {
        select: (data: any) => {
          return {
            data: !data.data.ChargingStationSequences[0]
              ? undefined
              : plainToInstance(
                  ChargingStationSequenceDto,
                  data.data.ChargingStationSequences[0],
                ),
          };
        },
      },
    } as any);

  const { selectProps: idTokenSelectProps } = useSelect<IdTokenDto>({
    resource: ResourceType.ID_TOKENS,
    optionLabel: (idToken) => idToken.idToken,
    optionValue: (idToken) => JSON.stringify(idToken),
    meta: {
      gqlQuery: ID_TOKENS_LIST_QUERY,
      gqlVariables: { offset: 0, limit: 10 },
    },
    sorters: [{ field: BaseDtoProps.updatedAt, order: 'desc' }],
    pagination: { mode: 'off' },
    onSearch: (value) => [
      {
        operator: 'or',
        value: [
          { field: IdTokenDtoProps.idToken, operator: 'contains', value },
        ],
      },
    ],
  });

  useEffect(() => {
    if (isModalOpen) {
      form.resetFields();
    }
  }, [isModalOpen, form]);

  useEffect(() => {
    if (
      requestIdResponse &&
      requestIdResponse.data &&
      requestIdResponse.data.value
    ) {
      form.setFieldsValue({ remoteStartId: requestIdResponse.data.value });
    }
  }, [requestIdResponse, form]);

  if (
    loading ||
    idTokenSelectProps.loading ||
    evseSelectorLoading ||
    isLoadingRequestId
  ) {
    return <Spin />;
  }

  const handleIdTokenSelection = (value: any) => {
    const idToken = JSON.parse(value);
    setIdToken(idToken);
    form.setFieldsValue({ idToken: idToken.idToken });
  };

  const handleEvseSelection = (value: any) => {
    form.setFieldsValue({ evseId: Number(value) });
  };

  const onFinish = async () => {
    const { remoteStartId, evseId } = form.getFieldsValue();

    const data = {
      remoteStartId,
      evseId,
      idToken: {
        idToken: idToken?.idToken,
        type: idToken?.type,
      },
    };

    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/evdriver/requestStartTransaction?identifier=${station.id}&tenantId=1`,
      data,
      setLoading,
    });
  };

  return (
    <Form {...formProps} layout="vertical" onFinish={onFinish}>
      <Flex vertical gap={16}>
        <Flex>
          <Form.Item
            className={'full-width'}
            label="Remote Start ID"
            name="remoteStartId"
            rules={[{ required: true, message: 'Remote Start ID is required' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Flex>

        <Flex>
          <Form.Item
            className={'full-width'}
            label="ID Token"
            name="idToken"
            rules={[{ required: true, message: 'ID Token is required' }]}
          >
            <AutoComplete
              className="full-width"
              onSelect={handleIdTokenSelection}
              filterOption={false}
              placeholder="Search ID Token"
              {...idTokenSelectProps}
            />
          </Form.Item>
        </Flex>

        <Flex>
          <EvseSelector
            station={station}
            onSelect={handleEvseSelection}
            onLoading={setEvseSelectorLoading}
            isOptional={true}
          />
        </Flex>

        <Flex justify="end" gap={8}>
          <Button onClick={() => dispatch(closeModal())}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Flex>
      </Flex>
    </Form>
  );
};
