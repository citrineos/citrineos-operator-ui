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
import { FormField } from '@lib/client/components/form/field';
import { Input } from '@lib/client/components/ui/input';
import { FormButtonVariants } from '@lib/client/components/buttons/form.button';

interface GetLogsModalProps {
  station: any;
}

const GetLogsSchema = z.object({
  requestId: z.coerce
    .number<number>()
    .int()
    .positive('Request ID must be a positive number'),
  remoteLocation: z
    .url('Must be a valid URL')
    .min(1, 'Remote Location is required')
    .max(512),
  oldestTimestamp: z.string().min(1).optional(),
  latestTimestamp: z.string().min(1).optional(),
  logType: z.enum(OCPP2_0_1.LogEnumType, { message: 'Log Type is required' }),
  retries: z.coerce.number<number>().int().min(0).optional(),
  retryInterval: z.coerce.number<number>().int().min(0).optional(),
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
      remoteLocation,
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
        remoteLocation: values.remoteLocation,
        oldestTimestamp: values.oldestTimestamp
          ? new Date(values.oldestTimestamp).toISOString()
          : undefined,
        latestTimestamp: values.latestTimestamp
          ? new Date(values.latestTimestamp).toISOString()
          : undefined,
      },
      logType: values.logType,
      requestId: values.requestId,
      ...(values.retries !== undefined && { retries: values.retries }),
      ...(values.retryInterval !== undefined && {
        retryInterval: values.retryInterval,
      }),
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
      <FormField
        control={form.control}
        label="Request ID"
        name="requestId"
        required
      >
        <Input type="number" placeholder="Enter request ID" />
      </FormField>
      <FormField
        control={form.control}
        label="Remote Location (URL)"
        name="remoteLocation"
        required
      >
        <Input placeholder={remoteLocation} type="url" />
      </FormField>
      <SelectFormField
        control={form.control}
        label="Log Type"
        name="logType"
        options={logTypes}
        placeholder="Select Log Type"
        required
      />
      <FormField
        control={form.control}
        label="Oldest Timestamp"
        name="oldestTimestamp"
      >
        <Input type="datetime-local" />
      </FormField>

      <FormField
        control={form.control}
        label="Latest Timestamp"
        name="latestTimestamp"
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
