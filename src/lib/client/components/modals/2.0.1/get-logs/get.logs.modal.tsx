// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { type ChargingStationDto, OCPP2_0_1 } from '@citrineos/base';
import { zodResolver } from '@hookform/resolvers/zod';
import { SelectFormField } from '@lib/client/components/form/field';
import { ChargingStationClass } from '@lib/cls/charging.station.dto';
import type { MessageConfirmation } from '@lib/utils/MessageConfirmation';
import { triggerMessageAndHandleResponse } from '@lib/utils/messages.utils';
import { closeModal } from '@lib/utils/store/modal.slice';
import { useForm } from '@refinedev/react-hook-form';
import { plainToInstance } from 'class-transformer';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import z from 'zod';
import { Form } from '@lib/client/components/form';
import { FormButtonVariants } from '@lib/client/components/buttons/form.button';

interface GetLogsModalProps {
  station: any;
}

const GetLogsSchema = z.object({
  logType: z.enum(OCPP2_0_1.LogEnumType, { message: 'Log Type is required' }),
});

type GetLogsFormData = z.infer<typeof GetLogsSchema>;

const logTypes = Object.keys(OCPP2_0_1.LogEnumType);

export const GetLogsModal = ({ station }: GetLogsModalProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const parsedStation: ChargingStationDto = useMemo(
    () => plainToInstance(ChargingStationClass, station),
    [station],
  ) as ChargingStationDto;

  const remoteLocation = 'http://localhost:4566/citrineos-s3-bucket/';

  const form = useForm({
    resolver: zodResolver(GetLogsSchema),
    defaultValues: {
      logType: OCPP2_0_1.LogEnumType.DiagnosticsLog,
    },
  });

  const onFinish = async (values: GetLogsFormData) => {
    if (!parsedStation?.id) {
      console.error(
        'Error: Cannot submit Get Logs request because station ID is missing.',
      );
      return;
    }

    const data = {
      log: {
        remoteLocation,
        oldestTimestamp: new Date().toISOString(),
        latestTimestamp: new Date().toISOString(),
      },
      logType: values.logType,
      requestId: 0,
    };

    triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/reporting/getLog?identifier=${parsedStation.id}&tenantId=1`,
      data,
      setLoading,
    }).then(() => {
      form.reset();
      dispatch(closeModal());
    });
  };

  return (
    <Form
      {...form}
      submitHandler={onFinish}
      loading={loading}
      submitButtonVariant={FormButtonVariants.submit}
      hideCancel
    >
      <SelectFormField
        control={form.control}
        label="Log Type"
        name="logType"
        options={logTypes}
        placeholder="Select Log Type"
        required
      />
    </Form>
  );
};
