import { ChargingStation } from '../remote-stop/ChargingStation';
import React from 'react';
import { Button, Form, Input, notification } from 'antd';
import { AssociationSelection } from '../../components/data-model-table/association-selection';
import { SelectionType } from '../../components/data-model-table/editable';
import {
  Variable,
  VariableProps,
} from '../../pages/evses/variable-attributes/variables/Variable';
import { VARIABLE_LIST_QUERY } from '../../pages/evses/variable-attributes/variables/queries';
import {
  Component,
  ComponentProps,
} from '../../pages/evses/variable-attributes/components/Component';
import { COMPONENT_LIST_QUERY } from '../../pages/evses/variable-attributes/components/queries';
import { plainToInstance, Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { BaseRestClient } from '../../util/BaseRestClient';
import { MessageConfirmation } from '../MessageConfirmation';
import { NEW_IDENTIFIER } from '../../util/consts';

enum SetVariablesDataProps {
  component = 'component',
  variable = 'variable',
  value = 'value',
}

class SetVariablesData {
  @Type(() => Component)
  component!: Component;

  @Type(() => Variable)
  variable!: Variable;

  @IsString()
  value!: string;

  constructor() {
    Object.assign(this, {
      [SetVariablesDataProps.component]: NEW_IDENTIFIER,
      [SetVariablesDataProps.variable]: NEW_IDENTIFIER,
      [SetVariablesDataProps.value]: '',
    });
  }
}

export interface SetVariablesProps {
  station: ChargingStation;
}

export const SetVariables: React.FC<SetVariablesProps> = ({ station }) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    const plainValues = await form.validateFields();
    const plainList: any[] = plainValues[SET_VARIABLES_DATA];
    const list: SetVariablesData[] = plainList.map((item: SetVariablesData) =>
      plainToInstance(SetVariablesData, item),
    );
    const data = list.map(
      (item: SetVariablesData) =>
        ({
          attributeValue: item.value,
          component: {
            name: item[SetVariablesDataProps.component][ComponentProps.name],
          },
          variable: {
            name: item[SetVariablesDataProps.variable][VariableProps.name],
          },
        }) as any,
    );
    const payload = { setVariableData: data };
    const client = new BaseRestClient();
    const response = await client.post(
      `/monitoring/setVariables?identifier=${station.id}&tenantId=1`,
      MessageConfirmation,
      {},
      payload,
    );

    // todo reuse handle response!
    if (response && response.success) {
      notification.success({
        message: 'Success',
        description: 'The set variables request was successful.',
        placement: 'topRight',
      });
    } else {
      notification.error({
        message: 'Request Failed',
        description:
          'The set variables request did not receive a successful response.',
        placement: 'topRight',
      });
    }
  };

  const SET_VARIABLES_DATA = 'setVariablesData';

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{ [SET_VARIABLES_DATA]: [new SetVariablesData()] }}
    >
      <Form.List name={SET_VARIABLES_DATA}>
        {(fields, { add, remove }) => {
          return (
            <>
              {fields.map((field, index) => (
                <>
                  <Form.Item
                    label={SetVariablesDataProps.component}
                    name={[index, SetVariablesDataProps.component]}
                  >
                    <AssociationSelection
                      selectable={SelectionType.SINGLE}
                      parentIdFieldName={SetVariablesDataProps.component}
                      associatedIdFieldName={ComponentProps.id}
                      gqlQuery={COMPONENT_LIST_QUERY}
                      parentRecord={form.getFieldValue([
                        SET_VARIABLES_DATA,
                        index,
                      ])}
                      associatedRecordClass={Component}
                      value={form.getFieldValue([
                        SET_VARIABLES_DATA,
                        index,
                        SetVariablesDataProps.component,
                      ])}
                      onChange={(newValue: any[]) => {
                        const currentData: SetVariablesData[] =
                          form.getFieldValue(SET_VARIABLES_DATA) || [];
                        currentData[index][SetVariablesDataProps.component] =
                          newValue[0];
                        form.setFieldsValue({
                          [SET_VARIABLES_DATA]: currentData,
                        });
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label={SetVariablesDataProps.variable}
                    name={[index, SetVariablesDataProps.variable]}
                  >
                    <AssociationSelection
                      selectable={SelectionType.SINGLE}
                      parentIdFieldName={SetVariablesDataProps.variable}
                      associatedIdFieldName={VariableProps.id}
                      gqlQuery={VARIABLE_LIST_QUERY}
                      parentRecord={form.getFieldValue([
                        SET_VARIABLES_DATA,
                        index,
                      ])}
                      associatedRecordClass={Variable}
                      value={form.getFieldValue([
                        SET_VARIABLES_DATA,
                        index,
                        SetVariablesDataProps.variable,
                      ])}
                      onChange={(newValue: any[]) => {
                        const currentData: SetVariablesData[] =
                          form.getFieldValue(SET_VARIABLES_DATA) || [];
                        currentData[index][SetVariablesDataProps.variable] =
                          newValue[0];
                        form.setFieldsValue({
                          [SET_VARIABLES_DATA]: currentData,
                        });
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Value"
                    name={[index, SetVariablesDataProps.value]}
                  >
                    <Input />
                  </Form.Item>
                  {fields.length > 1 && (
                    <Button
                      type="dashed"
                      onClick={() => {
                        remove(index);
                      }}
                      block
                      icon={<MinusCircleOutlined />}
                    >
                      Remove Variable Set
                    </Button>
                  )}
                </>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    add(new SetVariablesData());
                  }}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Variable Set
                </Button>
              </Form.Item>
            </>
          );
        }}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Set Variables
        </Button>
      </Form.Item>
    </Form>
  );
};
