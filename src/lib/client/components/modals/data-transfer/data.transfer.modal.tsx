// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { type ChargingStationDto, OCPPVersion } from '@citrineos/base';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@lib/client/components/form';
import { FormField } from '@lib/client/components/form/field';
import { Input } from '@lib/client/components/ui/input';
import { Textarea } from '@lib/client/components/ui/textarea';
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

export interface DataTransferModalProps {
  station: any;
}

const DataTransferSchema = z.object({
  vendorId: z.string().min(1, 'Vendor ID is required'),
  messageId: z.string().optional(),
  data: z.string().optional(),
});

type DataTransferFormData = z.infer<typeof DataTransferSchema>;

export const DataTransferModal = ({ station }: DataTransferModalProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const parsedStation: ChargingStationDto = useMemo(
    () => plainToInstance(ChargingStationClass, station),
    [station],
  ) as ChargingStationDto;

  const ocppVersion =
    parsedStation.protocol === OCPPVersion.OCPP1_6
      ? OCPPVersion.OCPP1_6
      : OCPPVersion.OCPP2_0_1;

  const form = useForm({
    resolver: zodResolver(DataTransferSchema),
    defaultValues: {
      vendorId: '',
      messageId: '',
      data: '',
    },
  });

  const handleSubmit = (values: DataTransferFormData) => {
    if (!parsedStation?.id) {
      console.error(
        'Error: Cannot submit Data Transfer request because station ID is missing.',
      );
      return;
    }

    const data: Record<string, unknown> = {
      vendorId: values.vendorId,
    };

    if (values.messageId) {
      data.messageId = values.messageId;
    }

    if (values.data) {
      data.data = values.data;
    }

    triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/configuration/dataTransfer?identifier=${parsedStation.id}&tenantId=1`,
      data,
      setLoading,
      ocppVersion,
    }).then(() => {
      form.reset({
        vendorId: '',
        messageId: '',
        data: '',
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
        label="Vendor ID"
        name="vendorId"
        required
      >
        <Input placeholder="Vendor specific implementation identifier" />
      </FormField>

      <FormField control={form.control} label="Message ID" name="messageId">
        <Input placeholder="Specific message or implementation identifier" />
      </FormField>

      <FormField control={form.control} label="Data" name="data">
        <Textarea placeholder="Data to send (freeform text)" />
      </FormField>
    </Form>
  );
};
