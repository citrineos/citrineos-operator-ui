// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { useMemo, useState } from 'react';
import {
  type ChargingStationDto,
  OCPP2_0_1,
  OCPPVersion,
} from '@citrineos/base';
import { zodResolver } from '@hookform/resolvers/zod';
import { MultiSelectFormField } from '@lib/client/components/form/field';
import { ChargingStationClass } from '@lib/cls/charging.station.dto';
import type { MessageConfirmation } from '@lib/utils/MessageConfirmation';
import { triggerMessageAndHandleResponse } from '@lib/utils/messages.utils';
import { closeModal } from '@lib/utils/store/modal.slice';
import { useForm } from '@refinedev/react-hook-form';
import { plainToInstance } from 'class-transformer';
import { useDispatch } from 'react-redux';
import z from 'zod';
import { Form } from '@lib/client/components/form';
import { FormButtonVariants } from '@lib/client/components/buttons/form.button';

interface GetInstalledCertificateIdsModalProps {
  station: any;
}

const GetInstalledCertificateIdsSchema = z.object({
  certificateType: z
    .array(z.enum(OCPP2_0_1.GetCertificateIdUseEnumType))
    .optional(),
});

type GetInstalledCertificateIdsFormData = z.infer<
  typeof GetInstalledCertificateIdsSchema
>;

const certificateTypeOptions = Object.values(
  OCPP2_0_1.GetCertificateIdUseEnumType,
);

export const GetInstalledCertificateIdsModal = ({
  station,
}: GetInstalledCertificateIdsModalProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const parsedStation: ChargingStationDto = useMemo(
    () => plainToInstance(ChargingStationClass, station),
    [station],
  ) as ChargingStationDto;

  const form = useForm({
    resolver: zodResolver(GetInstalledCertificateIdsSchema),
    defaultValues: {
      certificateType: [],
    },
  });

  const onFinish = async (values: GetInstalledCertificateIdsFormData) => {
    if (!parsedStation?.id) {
      console.error(
        'Error: Cannot submit Get Installed Certificate IDs request because station ID is missing.',
      );
      return;
    }

    const data = {
      certificateType:
        values.certificateType && values.certificateType.length > 0
          ? values.certificateType
          : undefined,
    };

    triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/certificates/getInstalledCertificateIds?identifier=${parsedStation.id}&tenantId=1`,
      data,
      setLoading,
      ocppVersion: OCPPVersion.OCPP2_0_1,
    }).then(() => {
      form.reset();
      dispatch(closeModal());
    });
  };

  const handleFormSubmit = form.handleSubmit(onFinish);

  return (
    <Form
      {...form}
      loading={loading}
      submitHandler={handleFormSubmit}
      submitButtonVariant={FormButtonVariants.submit}
      hideCancel
    >
      <MultiSelectFormField
        control={form.control}
        label="Certificate Types"
        name="certificateType"
        description="When certificate types are omitted, all certificate types are requested."
        options={certificateTypeOptions}
        placeholder="Select Certificate Types"
        searchPlaceholder="Search Certificate Types"
      />
    </Form>
  );
};
