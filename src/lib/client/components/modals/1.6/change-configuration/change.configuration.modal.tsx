// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import React, { useMemo, useState } from 'react';
import { type ChargingStationDto, OCPPVersion } from '@citrineos/base';
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
import { useDispatch } from 'react-redux';
import z from 'zod';
import { FormButtonVariants } from '@lib/client/components/buttons/form.button';

export const ChangeConfigurationSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string().min(1, 'Value is required'),
});

export type ChangeConfigurationFormData = z.infer<
  typeof ChangeConfigurationSchema
>;

export interface ChangeConfigurationModalProps {
  station: any;
  defaultConfiguration?: ChangeConfigurationFormData;
  onFinish?: () => void;
}

export const ChangeConfigurationModal = ({
  station,
  defaultConfiguration,
  onFinish,
}: ChangeConfigurationModalProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const parsedStation: ChargingStationDto = useMemo(
    () => plainToInstance(ChargingStationClass, station),
    [station],
  ) as ChargingStationDto;

  const form = useForm({
    resolver: zodResolver(ChangeConfigurationSchema),
    defaultValues: {
      key: defaultConfiguration ? defaultConfiguration.key : '',
      value: defaultConfiguration ? defaultConfiguration.value : '',
    },
  });

  const handleSubmit = (values: ChangeConfigurationFormData) => {
    if (!parsedStation?.id) {
      console.error(
        'Error: Cannot submit Change Configuration request because station ID is missing.',
      );
      return;
    }

    const data = {
      key: values.key,
      value: values.value,
    };

    triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/configuration/changeConfiguration?identifier=${parsedStation.id}&tenantId=1`,
      data,
      setLoading,
      ocppVersion: OCPPVersion.OCPP1_6,
    }).then(() => {
      form.reset({
        key: '',
        value: '',
      });

      onFinish?.();
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
      <FormField control={form.control} label="Key" name="key">
        <Input placeholder="Configuration key" />
      </FormField>

      <FormField control={form.control} label="Value" name="value">
        <Input placeholder="Configuration value" />
      </FormField>
    </Form>
  );
};
