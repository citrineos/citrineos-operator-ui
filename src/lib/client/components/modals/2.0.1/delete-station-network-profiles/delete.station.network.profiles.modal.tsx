// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { type ChargingStationDto, HttpMethod } from '@citrineos/base';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormField,
  nestedFormRowFlex,
} from '@lib/client/components/form/field';
import { Input } from '@lib/client/components/ui/input';
import { ChargingStationClass } from '@lib/cls/charging.station.dto';
import type { MessageConfirmation } from '@lib/utils/MessageConfirmation';
import { triggerMessageAndHandleResponse } from '@lib/utils/messages.utils';
import { closeModal } from '@lib/utils/store/modal.slice';
import { useForm } from '@refinedev/react-hook-form';
import { plainToInstance } from 'class-transformer';
import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import z from 'zod';
import { Form } from '@lib/client/components/form';
import { useFieldArray } from 'react-hook-form';
import { AddArrayItemButton } from '@lib/client/components/form/add-array-item-button';
import { RemoveArrayItemButton } from '@lib/client/components/form/remove-array-item-button';
import { FormButtonVariants } from '@lib/client/components/buttons/form.button';

export interface DeleteStationNetworkProfilesModalProps {
  station: any;
}

export const DeleteStationNetworkProfilesSchema = z.object({
  configurationSlots: z
    .array(
      z.object({
        slot: z.coerce.number<number>().int().positive(),
      }),
    ) // an array of objects to allow react-hook-form useFieldArray to work
    .min(1, 'At least one configuration slot is required'),
});

export type DeleteStationNetworkProfilesFormData = z.infer<
  typeof DeleteStationNetworkProfilesSchema
>;

export const DeleteStationNetworkProfilesModal = ({
  station,
}: DeleteStationNetworkProfilesModalProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const parsedStation: ChargingStationDto = useMemo(
    () => plainToInstance(ChargingStationClass, station),
    [station],
  ) as ChargingStationDto;

  const form = useForm({
    resolver: zodResolver(DeleteStationNetworkProfilesSchema),
    defaultValues: {
      configurationSlots: [{ slot: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'configurationSlots',
  });

  const onFinish = async (values: DeleteStationNetworkProfilesFormData) => {
    if (!parsedStation?.id) {
      console.error(
        'Error: Cannot submit Delete Station Network Profiles request because station ID is missing.',
      );
      return;
    }

    const uniqueSlots = [
      ...new Set(values.configurationSlots.map((cs) => cs.slot)),
    ];

    let url = `/configuration/serverNetworkProfile?stationId=${parsedStation.id}`;
    for (const configurationSlot of uniqueSlots) {
      url += `&configurationSlot=${configurationSlot}`;
    }

    triggerMessageAndHandleResponse<MessageConfirmation>({
      url: url,
      data: undefined,
      setLoading,
      ocppVersion: null,
      method: HttpMethod.Delete,
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
      submitButtonVariant={FormButtonVariants.delete}
      submitButtonLabel="Delete Profiles"
      hideCancel
    >
      <AddArrayItemButton
        onAppendAction={() =>
          append({
            slot: 0,
          })
        }
        itemLabel="Slot"
      />
      {fields.map((field, index) => (
        <div key={field.id} className={nestedFormRowFlex}>
          <FormField
            control={form.control}
            label={`Slot #${index + 1}`}
            name={`configurationSlots.${index}.slot`}
          >
            <Input type="number" placeholder="Enter slot number" min="1" />
          </FormField>

          <RemoveArrayItemButton onRemoveAction={() => remove(index)} />
        </div>
      ))}
    </Form>
  );
};
