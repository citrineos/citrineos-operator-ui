// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import type { ChargingStationDto } from '@citrineos/base';
import { OCPPVersion } from '@citrineos/base';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@lib/client/components/form';
import { FormField } from '@lib/client/components/form/field';
import { Input } from '@lib/client/components/ui/input';
import { ChargingStationClass } from '@lib/cls/charging.station.dto';
import type { MessageConfirmation } from '@lib/utils/MessageConfirmation';
import { triggerMessageAndHandleResponse } from '@lib/utils/messages.utils';
import { closeModal } from '@lib/utils/store/modal.slice';
import { useForm } from '@refinedev/react-hook-form';
import { plainToInstance } from 'class-transformer';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import z from 'zod';
import { FormButtonVariants } from '@lib/client/components/buttons/form.button';

export interface UpdateFirmwareModalProps {
  station: ChargingStationDto;
}

const UpdateFirmwareSchema = z.object({
  location: z
    .url('Must be a valid URL')
    .min(1, 'Location is required')
    .max(512),
  retrieveDate: z.string().min(1, 'Retrieve date is required'),
  retries: z.coerce.number<number>().int().min(0).optional(),
  retryInterval: z.coerce.number<number>().int().min(0).optional(),
});

type UpdateFirmwareFormData = z.infer<typeof UpdateFirmwareSchema>;

export const UpdateFirmwareModal = ({ station }: UpdateFirmwareModalProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const parsedStation: ChargingStationDto = useMemo(
    () => plainToInstance(ChargingStationClass, station),
    [station],
  ) as ChargingStationDto;

  const form = useForm({
    resolver: zodResolver(UpdateFirmwareSchema),
    defaultValues: {
      location: '',
      retrieveDate: '',
      retries: undefined,
      retryInterval: undefined,
    },
  });

  const handleSubmit = (values: UpdateFirmwareFormData) => {
    if (!parsedStation?.id) {
      console.error(
        'Error: Cannot submit Update Firmware request because station ID is missing.',
      );
      return;
    }

    const data = {
      location: values.location,
      retrieveDate: new Date(values.retrieveDate).toISOString(),
      ...(values.retries !== undefined && { retries: values.retries }),
      ...(values.retryInterval !== undefined && {
        retryInterval: values.retryInterval,
      }),
    };

    triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/configuration/updateFirmware?identifier=${parsedStation.id}&tenantId=1`,
      data,
      setLoading,
      ocppVersion: OCPPVersion.OCPP1_6,
    }).then(() => {
      form.reset({
        location: '',
        retrieveDate: '',
        retries: undefined,
        retryInterval: undefined,
      });

      dispatch(closeModal());
    });
  };

  return (
    <Form
      {...form}
      loading={loading}
      submitHandler={handleSubmit}
      submitButtonVariant={FormButtonVariants.submit}
      hideCancel
    >
      <FormField
        control={form.control}
        label="Location (URL)"
        name="location"
        required
      >
        <Input placeholder="https://example.com/firmware.bin" type="url" />
      </FormField>

      <FormField
        control={form.control}
        label="Retrieve Date"
        name="retrieveDate"
        required
      >
        <Input type="datetime-local" />
      </FormField>

      <FormField control={form.control} label="Retries" name="retries">
        <Input type="number" placeholder="Number of retries" min="0" />
      </FormField>

      <FormField
        control={form.control}
        label="Retry Interval"
        name="retryInterval"
      >
        <Input type="number" placeholder="Retry interval in seconds" min="0" />
      </FormField>
    </Form>
  );
};
