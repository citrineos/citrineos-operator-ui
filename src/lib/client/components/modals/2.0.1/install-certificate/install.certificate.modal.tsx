// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import {
  type ChargingStationDto,
  OCPP2_0_1,
  OCPPVersion,
} from '@citrineos/base';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@lib/client/components/form';
import { FormField, SelectFormField } from '@lib/client/components/form/field';
import { ChargingStationClass } from '@lib/cls/charging.station.dto';
import type { MessageConfirmation } from '@lib/utils/MessageConfirmation';
import {
  formatPem,
  triggerMessageAndHandleResponse,
} from '@lib/utils/messages.utils';
import { closeModal } from '@lib/utils/store/modal.slice';
import { useForm } from '@refinedev/react-hook-form';
import { plainToInstance } from 'class-transformer';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import z from 'zod';
import { Textarea } from '@lib/client/components/ui/textarea';
import { FormButtonVariants } from '@lib/client/components/buttons/form.button';

interface InstallCertificateModalProps {
  station: any;
}

const InstallCertificateSchema = z.object({
  certificate: z
    .string()
    .min(1, 'Certificate is required')
    .max(5500, 'Certificate must be less than 5500 characters'),
  certificateType: z.enum(OCPP2_0_1.InstallCertificateUseEnumType, {
    message: 'Certificate Type is required',
  }),
});

type InstallCertificateFormData = z.infer<typeof InstallCertificateSchema>;

const installCertificateTypes = Object.keys(
  OCPP2_0_1.InstallCertificateUseEnumType,
);

export const InstallCertificateModal = ({
  station,
}: InstallCertificateModalProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const parsedStation: ChargingStationDto = useMemo(
    () => plainToInstance(ChargingStationClass, station),
    [station],
  ) as ChargingStationDto;

  const form = useForm({
    resolver: zodResolver(InstallCertificateSchema),
    defaultValues: {
      certificate: '',
      certificateType: undefined,
    },
  });

  const handleSubmit = (values: InstallCertificateFormData) => {
    if (!parsedStation?.id) {
      console.error(
        'Error: Cannot submit Install Certificate request because station ID is missing.',
      );
      return;
    }

    const pemString = formatPem(values.certificate);
    if (pemString == null) {
      toast.error('Incorrectly formatted PEM certificate');
      return;
    }

    const data = {
      certificate: pemString,
      certificateType: values.certificateType,
    };

    triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/certificates/installCertificate?identifier=${parsedStation.id}&tenantId=1`,
      data,
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
      submitHandler={handleSubmit}
      submitButtonVariant={FormButtonVariants.submit}
      hideCancel
    >
      <SelectFormField
        control={form.control}
        label="Certificate Type"
        name="certificateType"
        options={installCertificateTypes}
        placeholder="Select Certificate Type"
        required
      />

      <FormField
        control={form.control}
        label="Certificate (PEM)"
        name="certificate"
        required
      >
        <Textarea />
      </FormField>
    </Form>
  );
};
