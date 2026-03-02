// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { type ChargingStationDto, OCPP2_0_1 } from '@citrineos/base';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField, SelectFormField } from '@lib/client/components/form/field';
import { Input } from '@lib/client/components/ui/input';
import { ChargingStationClass } from '@lib/cls/charging.station.dto';
import type { MessageConfirmation } from '@lib/utils/MessageConfirmation';
import {
  readFileContent,
  triggerMessageAndHandleResponse,
} from '@lib/utils/messages.utils';
import { closeModal } from '@lib/utils/store/modal.slice';
import { useForm } from '@refinedev/react-hook-form';
import { plainToInstance } from 'class-transformer';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import z from 'zod';
import { Form } from '@lib/client/components/form';
import { FormButtonVariants } from '@lib/client/components/buttons/form.button';

export interface CertificateSignedModalProps {
  station: any;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['.pem', '.id'];

const certificateSigningUses = Object.keys(
  OCPP2_0_1.CertificateSigningUseEnumType,
);

export const CertificateSignedSchema = z.object({
  certificateType: z.enum(OCPP2_0_1.CertificateSigningUseEnumType).optional(),
  certificate: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, 'Certificate file is required')
    .refine(
      (files) => {
        const file = files?.[0];
        if (!file) return false;
        const extension = '.' + file.name.split('.').pop()?.toLowerCase();
        return ACCEPTED_FILE_TYPES.includes(extension);
      },
      `File must be one of: ${ACCEPTED_FILE_TYPES.join(', ')}`,
    )
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      'File size must be less than 5MB',
    ),
});

export type CertificateSignedFormData = z.infer<typeof CertificateSignedSchema>;

export const CertificateSignedModal = ({
  station,
}: CertificateSignedModalProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const parsedStation: ChargingStationDto = useMemo(
    () => plainToInstance(ChargingStationClass, station),
    [station],
  ) as ChargingStationDto;

  const form = useForm({
    resolver: zodResolver(CertificateSignedSchema),
    defaultValues: {
      certificateType: undefined,
      certificate: undefined,
    },
  });

  const fileRef = form.register('certificate');

  const onFinish = (values: CertificateSignedFormData) => {
    if (!parsedStation?.id) {
      console.error(
        'Error: Cannot submit Certificate Signed request because station ID is missing.',
      );
      return;
    }

    const file = values.certificate[0];
    readFileContent(file)
      .then((fileContent) => {
        const data = {
          certificateType: values.certificateType,
          certificateChain: fileContent,
        };

        triggerMessageAndHandleResponse<MessageConfirmation[]>({
          url: `/certificates/certificateSigned?identifier=${parsedStation.id}&tenantId=1`,
          data,
          setLoading,
        }).then(() => {
          form.reset({
            certificateType: undefined,
            certificate: undefined,
          });
          dispatch(closeModal());
        });
      })
      .catch((err) => console.error('Error during submission:', err));
  };

  const handleFormSubmit = form.handleSubmit(onFinish);

  return (
    <Form
      {...form}
      submitHandler={handleFormSubmit}
      loading={loading}
      submitButtonVariant={FormButtonVariants.submit}
      hideCancel
    >
      <FormField
        control={form.control}
        label="Certificate File"
        name="certificate"
        required
      >
        <Input
          type="file"
          accept={ACCEPTED_FILE_TYPES.join(',')}
          {...fileRef}
        />
      </FormField>

      <SelectFormField
        control={form.control}
        label="Certificate Type"
        name="certificateType"
        options={certificateSigningUses}
        placeholder="Select Certificate Type"
      />
    </Form>
  );
};
