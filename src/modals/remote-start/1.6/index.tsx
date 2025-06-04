// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { AutoComplete, Button, Flex, Form, InputNumber, Spin } from 'antd';
import { useSelect } from '@refinedev/antd';
import { ID_TOKENS_LIST_QUERY } from '../../../pages/id-tokens/queries';
import { ChargingStationDto } from '../../../dtos/charging.station.dto';
import { OCPPVersion } from '@citrineos/base';
import { IdTokenDto, IdTokenDtoProps } from '../../../dtos/id.token.dto';
import { BaseDtoProps } from '../../../dtos/base.dto';
import { closeModal, selectIsModalOpen } from '../../../redux/modal.slice';
import { useDispatch, useSelector } from 'react-redux';
import { MessageConfirmation } from '../../../message/MessageConfirmation';
import { triggerMessageAndHandleResponse } from '../../../message/util';
import { ConnectorDto } from '../../../dtos/connector.dto';
import { ConnectorSelector } from '../../shared/connector-selector/connector.selector';
import { ResourceType } from '@util/auth';

export interface OCPP1_6_RemoteStartProps {
  station: ChargingStationDto;
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

  if (loading || idTokenSelectProps.loading || connectorSelectorLoading) {
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
              {...idTokenSelectProps}
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
