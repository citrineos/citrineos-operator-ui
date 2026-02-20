// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import {
  type ChargingStationDto,
  type ComponentDto,
  ComponentProps,
  OCPP2_0_1,
  OCPPVersion,
} from '@citrineos/base';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ComboboxFormField,
  FormField,
  nestedFormRowFlex,
  SelectFormField,
} from '@lib/client/components/form/field';
import { Input } from '@lib/client/components/ui/input';
import { ChargingStationClass } from '@lib/cls/charging.station.dto';
import { COMPONENT_LIST_QUERY } from '@lib/queries/components';
import { ResourceType } from '@lib/utils/access.types';
import type { MessageConfirmation } from '@lib/utils/MessageConfirmation';
import { triggerMessageAndHandleResponse } from '@lib/utils/messages.utils';
import { closeModal } from '@lib/utils/store/modal.slice';
import { useSelect } from '@refinedev/core';
import { useForm } from '@refinedev/react-hook-form';
import { plainToInstance } from 'class-transformer';
import React, { useMemo, useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import z from 'zod';
import { Form } from '@lib/client/components/form';
import { AddArrayItemButton } from '@lib/client/components/form/add-array-item-button';
import { RemoveArrayItemButton } from '@lib/client/components/form/remove-array-item-button';
import { FormButtonVariants } from '@lib/client/components/buttons/form.button';

interface SetVariablesModalProps {
  station: any;
}

const SetVariableDataSchema = z.object({
  componentId: z.coerce.number<number>().min(1, 'Component is required'),
  variableId: z.coerce.number<number>().min(1, 'Variable is required'),
  value: z.string().min(1, 'Value is required'),
  attributeType: z.enum(OCPP2_0_1.AttributeEnumType).optional(),
});

const SetVariablesSchema = z.object({
  setVariableData: z
    .array(SetVariableDataSchema)
    .min(1, 'At least one variable is required'),
});

type SetVariablesFormData = z.infer<typeof SetVariablesSchema>;

const attributeTypes = Object.keys(OCPP2_0_1.AttributeEnumType);

export const SetVariablesModal = ({ station }: SetVariablesModalProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const parsedStation: ChargingStationDto = useMemo(
    () => plainToInstance(ChargingStationClass, station),
    [station],
  ) as ChargingStationDto;

  const form = useForm({
    resolver: zodResolver(SetVariablesSchema),
    defaultValues: {
      setVariableData: [
        {
          componentId: 0,
          variableId: 0,
          value: '',
          attributeType: undefined,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'setVariableData',
  });

  const {
    options: componentOptions,
    onSearch: componentOnSearch,
    query: componentQuery,
  } = useSelect<ComponentDto>({
    resource: ResourceType.COMPONENTS,
    optionLabel: ComponentProps.name,
    optionValue: 'id',
    meta: {
      gqlQuery: COMPONENT_LIST_QUERY,
      gqlVariables: {
        offset: 0,
        limit: 10,
      },
    },
    pagination: { mode: 'off' },
  });

  const onFinish = async (values: SetVariablesFormData) => {
    if (!parsedStation?.id) {
      console.error(
        'Error: Cannot submit Set Variables request because station ID is missing.',
      );
      return;
    }

    const setVariableData = values.setVariableData.map((item) => {
      const component = componentOptions.find(
        (c) => c.value === item.componentId,
      );
      const componentName = (component as any)?.label || '';

      return {
        component: {
          name: componentName,
        },
        variable: {
          name: item.variableId,
        },
        attributeValue: item.value,
        ...(item.attributeType && { attributeType: item.attributeType }),
      };
    });

    triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/monitoring/setVariables?identifier=${parsedStation.id}&tenantId=1`,
      data: { setVariableData },
      setLoading,
      ocppVersion: OCPPVersion.OCPP2_0_1,
    }).then(() => {
      form.reset();
      dispatch(closeModal());
    });
  };

  return (
    <Form
      {...form}
      loading={loading}
      submitHandler={onFinish}
      submitButtonVariant={FormButtonVariants.submit}
      submitButtonLabel="Set Variables"
      hideCancel
    >
      <div className="flex items-start">
        <AddArrayItemButton
          onAppendAction={() =>
            append({
              componentId: 0,
              variableId: 0,
              value: '',
              attributeType: undefined,
            })
          }
          itemLabel="Variable"
        />
      </div>
      <div className="flex flex-col gap-6 w-full">
        {fields.map((field, index) => (
          <div key={field.id} className={nestedFormRowFlex}>
            <ComboboxFormField
              control={form.control}
              label={`Component #${index + 1}`}
              name={`setVariableData.${index}.componentId`}
              options={componentOptions}
              onSearch={componentOnSearch}
              placeholder="Select Component"
              searchPlaceholder="Search Component"
              isLoading={componentQuery.isLoading}
            />
            <FormField
              control={form.control}
              label={`Variable Name #${index + 1}`}
              name={`setVariableData.${index}.variableId`}
            >
              <Input placeholder="Variable Name" />
            </FormField>

            <FormField
              control={form.control}
              label={`Value #${index + 1}`}
              name={`setVariableData.${index}.value`}
            >
              <Input placeholder="Value To Set" />
            </FormField>

            <SelectFormField
              control={form.control}
              label={`Attribute Type #${index + 1}`}
              name={`setVariableData.${index}.attributeType`}
              options={attributeTypes}
              placeholder="Select Attribute Type"
            />

            <RemoveArrayItemButton onRemoveAction={() => remove(index)} />
          </div>
        ))}
      </div>
    </Form>
  );
};
