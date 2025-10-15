// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { AutoComplete, Button, Flex, Form, InputNumber, Spin } from 'antd';
import { useSelect } from '@refinedev/antd';
import { useCustom } from '@refinedev/core';
import { CHARGING_STATION_SEQUENCES_GET_QUERY } from '../../../pages/charging-station-sequences/queries';
import {
  AuthorizationDtoProps,
  BaseDtoProps,
  ChargingStationSequenceType,
  IAuthorizationDto,
  IChargingStationDto,
  IChargingStationSequenceDto,
} from '@citrineos/base';
import { plainToInstance } from 'class-transformer';
import { ChargingStationSequenceDto } from '../../../dtos/charging.station.sequence.dto';
import { closeModal, selectIsModalOpen } from '../../../redux/modal.slice';
import { useDispatch, useSelector } from 'react-redux';
import { MessageConfirmation } from '../../../message/MessageConfirmation';
import { EvseSelector } from '../../shared/evse-selector/evse.selector';

import { triggerMessageAndHandleResponse } from '../../../message/util';
import { ResourceType } from '@util/auth';
import { AUTHORIZATIONS_LIST_QUERY } from '../../../pages/authorizations/queries';

export interface OCPP2_0_1_RemoteStartProps {
  station: IChargingStationDto;
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
  const [authorization, setAuthorization] = useState<IAuthorizationDto | null>(
    null,
  );
  const isModalOpen = useSelector(selectIsModalOpen);

  const { data: requestIdResponse, isLoading: isLoadingRequestId } =
    useCustom<IChargingStationSequenceDto>({
      meta: {
        gqlQuery: CHARGING_STATION_SEQUENCES_GET_QUERY,
        gqlVariables: {
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

  const { selectProps: authorizationSelectProps } =
    useSelect<IAuthorizationDto>({
      resource: ResourceType.AUTHORIZATIONS,
      optionLabel: (authorization) => authorization.idToken,
      optionValue: (authorization) =>
        JSON.stringify({
          idToken: authorization.idToken,
          idTokenType: authorization.idTokenType,
          additionalInfo: authorization.additionalInfo,
        }),
      meta: {
        gqlQuery: AUTHORIZATIONS_LIST_QUERY,
        gqlVariables: { offset: 0, limit: 10 },
      },
      sorters: [{ field: BaseDtoProps.updatedAt, order: 'desc' }],
      pagination: { mode: 'off' },
      onSearch: (value) => [
        {
          operator: 'or',
          value: [
            {
              field: AuthorizationDtoProps.idToken,
              operator: 'contains',
              value,
            },
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
    authorizationSelectProps.loading ||
    evseSelectorLoading ||
    isLoadingRequestId
  ) {
    return <Spin />;
  }

  const handleAuthorizationSelection = (value: any) => {
    const authorization = JSON.parse(value);
    setAuthorization(authorization);
    form.setFieldsValue({ authorization: authorization.idToken });
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
        idToken: authorization!.idToken,
        type: authorization!.idTokenType!,
        additionalInfo: authorization!.additionalInfo || undefined,
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
            label="Authorization"
            name="authorization"
            rules={[{ required: true, message: 'Authorization is required' }]}
          >
            <AutoComplete
              className="full-width"
              onSelect={handleAuthorizationSelection}
              filterOption={false}
              placeholder="Search Authorization"
              {...authorizationSelectProps}
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
