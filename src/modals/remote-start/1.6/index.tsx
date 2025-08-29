// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { AutoComplete, Button, Flex, Form, InputNumber, Spin } from 'antd';
import { useSelect } from '@refinedev/antd';
import {
  AuthorizationDtoProps,
  BaseDtoProps,
  IChargingStationDto,
  IAuthorizationDto,
  OCPPVersion,
} from '@citrineos/base';
import { closeModal, selectIsModalOpen } from '../../../redux/modal.slice';
import { useDispatch, useSelector } from 'react-redux';
import { MessageConfirmation } from '../../../message/MessageConfirmation';
import { triggerMessageAndHandleResponse } from '../../../message/util';
import { ConnectorSelector } from '../../shared/connector-selector/connector.selector';
import { ResourceType } from '@util/auth';
import { AUTHORIZATIONS_LIST_QUERY } from '../../../pages/authorizations/queries';

export interface OCPP1_6_RemoteStartProps {
  station: IChargingStationDto;
}

export const OCPP1_6_RemoteStart = ({ station }: OCPP1_6_RemoteStartProps) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [connectorSelectorLoading, setConnectorSelectorLoading] =
    useState<boolean>(false);
  const isModalOpen = useSelector(selectIsModalOpen);

  const { selectProps: authorizationSelectProps } =
    useSelect<IAuthorizationDto>({
      resource: ResourceType.AUTHORIZATIONS,
      optionLabel: (authorization) => authorization.idToken,
      optionValue: (authorization) =>
        JSON.stringify({
          idToken: authorization.idToken,
          type: authorization.idTokenType,
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

  if (loading || authorizationSelectProps.loading || connectorSelectorLoading) {
    return <Spin />;
  }

  const handleIdTokenSelection = (value: any) => {
    const idToken = JSON.parse(value);
    form.setFieldsValue({ idTag: idToken.idToken });
  };

  const handleConnectorSelection = (value: any) => {
    form.setFieldsValue({ connectorId: Number(value) });
  };

  const onFinish = async () => {
    const { connectorId, idTag } = form.getFieldsValue();
    const data = {
      connectorId,
      idTag,
    };

    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/evdriver/remoteStartTransaction?identifier=${station.id}&tenantId=1`,
      data,
      ocppVersion: OCPPVersion.OCPP1_6,
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
            name="idTag"
            rules={[{ required: true, message: 'ID Token is required' }]}
          >
            <AutoComplete
              className="full-width"
              onSelect={handleIdTokenSelection}
              filterOption={false}
              placeholder="Search ID Token"
              {...authorizationSelectProps}
            />
          </Form.Item>
        </Flex>

        <Flex>
          <ConnectorSelector
            station={station}
            onSelect={handleConnectorSelection}
            onLoading={setConnectorSelectorLoading}
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
