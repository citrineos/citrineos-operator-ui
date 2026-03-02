// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { type ChargingStationDto } from '@citrineos/base';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@lib/client/components/form';
import {
  formCheckboxStyle,
  FormField,
} from '@lib/client/components/form/field';
import { Checkbox } from '@lib/client/components/ui/checkbox';
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

interface UpdateAuthPasswordModalProps {
  station: any;
}

const UpdateAuthPasswordSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  setOnCharger: z.boolean(),
});

type UpdateAuthPasswordFormData = z.infer<typeof UpdateAuthPasswordSchema>;

export const UpdateAuthPasswordModal = ({
  station,
}: UpdateAuthPasswordModalProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const parsedStation: ChargingStationDto = useMemo(
    () => plainToInstance(ChargingStationClass, station),
    [station],
  ) as ChargingStationDto;

  const form = useForm({
    resolver: zodResolver(UpdateAuthPasswordSchema),
    defaultValues: {
      password: '',
      setOnCharger: false,
    },
  });

  const handleSubmit = (values: UpdateAuthPasswordFormData) => {
    if (!parsedStation?.id) {
      console.error(
        'Error: Cannot submit Update Auth Password request because station ID is missing.',
      );
      return;
    }

    const data = {
      password: values.password,
      setOnCharger: values.setOnCharger,
      stationId: parsedStation.id,
    };

    triggerMessageAndHandleResponse<MessageConfirmation>({
      url: `/configuration/password`,
      data,
      setLoading,
      ocppVersion: null,
    }).then(() => {
      form.reset();
      dispatch(closeModal());
    });
  };

  return (
    <Form
      {...form}
      loading={loading}
      submitHandler={handleSubmit}
      submitButtonVariant={FormButtonVariants.submit}
      submitButtonlabel="Update Password"
      hideCancel
    >
      <FormField
        control={form.control}
        label="Password"
        name="password"
        required
      >
        <Input type="password" placeholder="Enter new password" />
      </FormField>

      <FormField
        control={form.control}
        label="Set On Charger"
        name="setOnCharger"
        required
      >
        <Checkbox className={formCheckboxStyle} />
      </FormField>
    </Form>
  );
};
