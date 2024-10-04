import { ChargingStation } from '../remote-stop/ChargingStation';
import React, { useState } from 'react';
import { Button, Form } from 'antd';
import { AssociationSelection } from '../../components/data-model-table/association-selection';
import { SelectionType } from '../../components/data-model-table/editable';
import { plainToInstance, Type } from 'class-transformer';
import { CustomDataType } from '../../model/CustomData';
import { Evse, EvseProps } from '../../pages/evses/Evse';
import {
  ChangeAvailabilityStatusEnumType,
  OperationalStatusEnumType,
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

enum ChangeAvailabilityRequestProps {
  customData = 'customData',
  evse = 'evse',
  operationalStatus = 'operationalStatus',
}

export class ChangeAvailabilityRequest {
  @Type(() => Evse)
  @ValidateNested()
  @IsOptional()
  evse?: Evse;

  @IsEnum(OperationalStatusEnumType)
  @IsNotEmpty()
  operationalStatus!: OperationalStatusEnumType;

  @Type(() => CustomDataType)
  @ValidateNested()
  customData?: CustomDataType;

  constructor() {
    Object.assign(this, {
      [ChangeAvailabilityRequestProps.evse]: NEW_IDENTIFIER,
      [ChangeAvailabilityRequestProps.operationalStatus]: '',
    });
  }
}

export class ChangeAvailabilityResponse {
  @Type(() => CustomDataType)
  @ValidateNested()
  @IsOptional()
  customData?: CustomDataType;

  @IsEnum(ChangeAvailabilityStatusEnumType)
  status!: ChangeAvailabilityStatusEnumType;

  @Type(() => StatusInfoType)
  @ValidateNested()
  statusInfo?: StatusInfoType;
}

export interface ChangeAvailabilityProps {
  station: ChargingStation;
}

export const ChangeAvailability: React.FC<ChangeAvailabilityProps> = ({
  station,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    const plainValues = await form.validateFields();
    const classInstance = plainToInstance(
      ChangeAvailabilityRequest,
      plainValues,
    );
    const evse = classInstance[ChangeAvailabilityRequestProps.evse];
    if (evse) {
      const data = {
        operationalStatus:
          classInstance[ChangeAvailabilityRequestProps.operationalStatus],
        customData: classInstance[ChangeAvailabilityRequestProps.customData],
        evse: {
          id: evse[EvseProps.databaseId],
          // customData: todo,
          connectorId: evse[EvseProps.connectorId],
        },
      };
      await triggerMessageAndHandleResponse(
        `/configuration/changeAvailability?identifier=${station.id}&tenantId=1`,
        ChangeAvailabilityResponse,
        data,
        (response: ChangeAvailabilityResponse) =>
          response &&
          response.status &&
          response.status === ChangeAvailabilityStatusEnumType.Accepted,
      );
    }
  };

  const [parentRecord, setParentRecord] = useState(
    new ChangeAvailabilityRequest(),
  );

  const handleFormChange = (
    _changedValues: any,
    allValues: ChangeAvailabilityRequest,
  ) => {
    setParentRecord(allValues);
  };

  const instance = plainToInstance(ChangeAvailabilityRequest, {});
  const fieldSchema = getSchemaForInstanceAndKey(
    instance,
    ChangeAvailabilityRequestProps.operationalStatus,
    [ChangeAvailabilityRequestProps.operationalStatus],
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
        label={ChangeAvailabilityRequestProps.evse}
        name={ChangeAvailabilityRequestProps.evse}
      >
        <AssociationSelection
          selectable={SelectionType.SINGLE}
          parentIdFieldName={ChangeAvailabilityRequestProps.evse}
          associatedIdFieldName={EvseProps.databaseId}
          gqlQuery={GET_EVSE_LIST_FOR_STATION}
          gqlQueryVariables={{
            [VariableAttributeProps.stationId]: station.id,
          }}
          parentRecord={parentRecord}
          associatedRecordClass={Evse}
          value={form.getFieldValue(ChangeAvailabilityRequestProps.evse)}
          onChange={(newValue: any[]) => {
            const currentData: ChangeAvailabilityRequest =
              form.getFieldValue(true) || {};
            currentData[ChangeAvailabilityRequestProps.evse] = newValue[0];
            form.setFieldsValue(currentData);
          }}
        />
      </Form.Item>
      {enumField}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Change Availability
        </Button>
      </Form.Item>
    </Form>
  );
};
