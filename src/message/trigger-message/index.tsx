import { ChargingStation } from '../remote-stop/ChargingStation';
import React, { useState } from 'react';
import { Button, Form } from 'antd';
import { AssociationSelection } from '../../components/data-model-table/association-selection';
import { SelectionType } from '../../components/data-model-table/editable';
import { plainToInstance, Type } from 'class-transformer';
import { CustomDataType } from '../../model/CustomData';
import { Evse, EvseProps } from '../../pages/evses/Evse';
import {
  MessageTriggerEnumType,
  TriggerMessageStatusEnumType,
} from '@citrineos/base';
import { GET_EVSE_LIST_FOR_STATION } from '../queries';
import { VariableAttributeProps } from '../../pages/evses/variable-attributes/VariableAttributes';
import { getSchemaForInstanceAndKey, renderField } from '../../components/form';
import { FieldPath } from '../../components/form/state/fieldpath';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { triggerMessageAndHandleResponse } from '../util';
import { StatusInfoType } from '../model/StatusInfoType';
import { NEW_IDENTIFIER } from '../../util/consts';

enum TriggerMessageRequestProps {
  customData = 'customData',
  evseId = 'evseId',
  requestedMessage = 'requestedMessage',
}

export class TriggerMessageRequest {
  @Type(() => Evse)
  @ValidateNested()
  @IsOptional()
  evseId?: Evse;

  @IsEnum(MessageTriggerEnumType)
  @IsNotEmpty()
  requestedMessage!: MessageTriggerEnumType;

  @Type(() => CustomDataType)
  @ValidateNested()
  customData?: CustomDataType;

  constructor() {
    Object.assign(this, {
      [TriggerMessageRequestProps.evseId]: NEW_IDENTIFIER,
      [TriggerMessageRequestProps.requestedMessage]: '',
    });
  }
}

export class TriggerMessageResponse {
  @Type(() => CustomDataType)
  @ValidateNested()
  @IsOptional()
  customData?: CustomDataType;

  @IsEnum(TriggerMessageStatusEnumType)
  status!: TriggerMessageStatusEnumType;

  @Type(() => StatusInfoType)
  @ValidateNested()
  statusInfo?: StatusInfoType;
}

export interface TriggerMessageProps {
  station: ChargingStation;
}

export const TriggerMessage: React.FC<TriggerMessageProps> = ({ station }) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    const plainValues = await form.validateFields();
    const classInstance = plainToInstance(TriggerMessageRequest, plainValues);
    const evse = classInstance[TriggerMessageRequestProps.evseId];
    const data = {
      requestedMessage:
        classInstance[TriggerMessageRequestProps.requestedMessage],
      customData: classInstance[TriggerMessageRequestProps.customData],
      evse: evse
        ? {
            id: evse[EvseProps.databaseId],
            // customData: todo,
            connectorId: evse[EvseProps.connectorId],
          }
        : undefined,
    };
    await triggerMessageAndHandleResponse(
      `/configuration/triggerMessage?identifier=${station.id}&tenantId=1`,
      TriggerMessageResponse,
      data,
      (response: TriggerMessageResponse) =>
        response &&
        response.status &&
        response.status === TriggerMessageStatusEnumType.Accepted,
    );
  };

  const [parentRecord, setParentRecord] = useState(new TriggerMessageRequest());

  const handleFormChange = (
    _changedValues: any,
    allValues: TriggerMessageRequest,
  ) => {
    setParentRecord(allValues);
  };

  const instance = plainToInstance(TriggerMessageRequest, {});
  const fieldSchema = getSchemaForInstanceAndKey(
    instance,
    TriggerMessageRequestProps.requestedMessage,
    [TriggerMessageRequestProps.requestedMessage],
  );

  const enumField = renderField({
    schema: fieldSchema,
    preFieldPath: FieldPath.empty(),
    disabled: false,
  });

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={parentRecord}
      onValuesChange={handleFormChange}
    >
      <Form.Item
        label={TriggerMessageRequestProps.evseId}
        name={TriggerMessageRequestProps.evseId}
      >
        <AssociationSelection
          selectable={SelectionType.SINGLE}
          parentIdFieldName={TriggerMessageRequestProps.evseId}
          associatedIdFieldName={EvseProps.databaseId}
          gqlQuery={GET_EVSE_LIST_FOR_STATION}
          gqlQueryVariables={{
            [VariableAttributeProps.stationId]: station.id,
          }}
          parentRecord={parentRecord}
          associatedRecordClass={Evse}
          value={form.getFieldValue(TriggerMessageRequestProps.evseId)}
          onChange={(newValue: any[]) => {
            const currentData: TriggerMessageRequest =
              form.getFieldValue(true) || {};
            currentData[TriggerMessageRequestProps.evseId] = newValue[0];
            form.setFieldsValue(currentData);
          }}
        />
      </Form.Item>
      {enumField}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Trigger Message
        </Button>
      </Form.Item>
    </Form>
  );
};
