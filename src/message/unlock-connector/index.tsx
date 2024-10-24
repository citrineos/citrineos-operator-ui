import React, { useState } from 'react';
import { Button, Form } from 'antd';
import { Type } from 'class-transformer';
import { UnlockStatusEnumType } from '@citrineos/base';
import { IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { triggerMessageAndHandleResponse } from '../util';
import { AssociationSelection } from '../../components/data-model-table/association-selection';
import { SelectionType } from '../../components/data-model-table/editable';
import { Evse, EvseProps } from '../../pages/evses/Evse';
import { GET_EVSE_LIST_FOR_STATION } from '../queries';
import { VariableAttributeProps } from '../../pages/evses/variable-attributes/VariableAttributes';
import { StatusInfoType } from '../model/StatusInfoType';
import { NEW_IDENTIFIER } from '../../util/consts';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';

enum UnlockConnectorRequestProps {
  // customData = 'customData', // todo
  evseId = 'evseId',
}

export class UnlockConnectorRequest {
  @Type(() => Evse)
  @ValidateNested()
  @IsOptional()
  evseId?: Evse;

  // @Type(() => CustomDataType)
  // @ValidateNested()
  // customData?: CustomDataType;

  constructor() {
    Object.assign(this, {
      [UnlockConnectorRequestProps.evseId]: NEW_IDENTIFIER,
    });
  }
}

export class UnlockConnectorResponse {
  // @Type(() => CustomDataType)
  // @ValidateNested()
  // @IsOptional()
  // customData?: CustomDataType;

  @IsEnum(UnlockStatusEnumType)
  status!: UnlockStatusEnumType;

  @Type(() => StatusInfoType)
  @ValidateNested()
  statusInfo?: StatusInfoType;
}

export interface UnlockConnectorProps {
  station: ChargingStation;
}

export const UnlockConnector: React.FC<UnlockConnectorProps> = ({
  station,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    const plainValues = await form.validateFields();
    const data = {
      evseId: plainValues[UnlockConnectorRequestProps.evseId][EvseProps.id],
      connectorId:
        plainValues[UnlockConnectorRequestProps.evseId][EvseProps.connectorId],
    };
    await triggerMessageAndHandleResponse(
      `/evdriver/unlockConnector?identifier=${station.id}&tenantId=1`,
      UnlockConnectorResponse,
      data,
      (response: UnlockConnectorResponse) =>
        response &&
        response.status &&
        response.status === UnlockStatusEnumType.Unlocked,
    );
  };

  const [parentRecord, setParentRecord] = useState(
    new UnlockConnectorRequest(),
  );

  const handleFormChange = (
    _changedValues: any,
    allValues: UnlockConnectorRequest,
  ) => {
    setParentRecord(allValues);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={parentRecord}
      onValuesChange={handleFormChange}
    >
      <Form.Item
        label={UnlockConnectorRequestProps.evseId}
        name={UnlockConnectorRequestProps.evseId}
      >
        <AssociationSelection
          selectable={SelectionType.SINGLE}
          parentIdFieldName={UnlockConnectorRequestProps.evseId}
          associatedIdFieldName={EvseProps.databaseId}
          gqlQuery={GET_EVSE_LIST_FOR_STATION}
          gqlQueryVariables={{
            [VariableAttributeProps.stationId]: station.id,
          }}
          parentRecord={parentRecord}
          associatedRecordClass={Evse}
          value={form.getFieldValue(UnlockConnectorRequestProps.evseId)}
          onChange={(newValue: any[]) => {
            const currentData: UnlockConnectorRequest =
              form.getFieldValue(true) || {};
            currentData[UnlockConnectorRequestProps.evseId] = newValue[0];
            form.setFieldsValue(currentData);
          }}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Unlock Connector
        </Button>
      </Form.Item>
    </Form>
  );
};
