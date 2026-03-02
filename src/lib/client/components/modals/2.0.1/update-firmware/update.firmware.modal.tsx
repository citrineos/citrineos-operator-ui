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
import { CHARGING_STATION_SEQUENCES_GET_QUERY } from '@lib/queries/charging.station.sequences';
import type { MessageConfirmation } from '@lib/utils/MessageConfirmation';
import {
  formatPem,
  triggerMessageAndHandleResponse,
} from '@lib/utils/messages.utils';
import { closeModal } from '@lib/utils/store/modal.slice';
import { useApiUrl, useCustom } from '@refinedev/core';
import { useForm } from '@refinedev/react-hook-form';
import { plainToInstance } from 'class-transformer';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import z from 'zod';
import { Textarea } from '@lib/client/components/ui/textarea';
import { FormButtonVariants } from '@lib/client/components/buttons/form.button';

export interface UpdateFirmwareModalProps {
  station: ChargingStationDto;
}

const UpdateFirmwareSchema = z.object({
  requestId: z.coerce.number<number>().int().min(0),
  retries: z.coerce.number<number>().int().min(0).optional(),
  retryInterval: z.coerce.number<number>().int().min(0).optional(),
  location: z.string().url('Must be a valid URL').min(1).max(512),
  retrieveDateTime: z.string().min(1, 'Retrieve date is required'),
  installDateTime: z.string().optional(),
  signingCertificate: z.string().max(5500).optional(),
  signature: z.string().max(800).optional(),
});

type UpdateFirmwareFormData = z.infer<typeof UpdateFirmwareSchema>;

export const UpdateFirmwareModal = ({ station }: UpdateFirmwareModalProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const parsedStation: ChargingStationDto = useMemo(
    () => plainToInstance(ChargingStationClass, station),
    [station],
  ) as ChargingStationDto;

  const apiUrl = useApiUrl();
  const {
    query: { data: requestIdResponse, isLoading: isRequestIdLoading },
  } = useCustom({
    url: `${apiUrl}`,
    method: 'post',
    config: { headers: { 'Content-Type': 'application/json' } },
    meta: {
      operation: 'ChargingStationSequencesGet',
      gqlQuery: CHARGING_STATION_SEQUENCES_GET_QUERY,
      gqlVariables: { stationId: station.id, type: 'updateFirmware' },
    },
  });

  const form = useForm({
    resolver: zodResolver(UpdateFirmwareSchema),
    defaultValues: {
      requestId: 0,
      retries: undefined,
      retryInterval: undefined,
      location: '',
      retrieveDateTime: '',
      installDateTime: '',
      signingCertificate: '',
      signature: '',
    },
  });

  useEffect(() => {
    if (requestIdResponse?.data?.ChargingStationSequences?.[0]?.value) {
      form.setValue(
        'requestId',
        requestIdResponse.data.ChargingStationSequences[0].value,
      );
    }
  }, [requestIdResponse, form]);

  const handleSubmit = (values: UpdateFirmwareFormData) => {
    if (!parsedStation?.id) {
      console.error(
        'Error: Cannot submit Update Firmware request because station ID is missing.',
      );
      return;
    }

    let signingCertificate: string | undefined;
    if (values.signingCertificate && values.signingCertificate.trim()) {
      const pemString = formatPem(values.signingCertificate);
      if (!pemString) {
        toast.error('Incorrectly formatted PEM certificate');
        return;
      }
      signingCertificate = pemString;
    }

    const data = {
      requestId: values.requestId,
      ...(values.retries !== undefined && { retries: values.retries }),
      ...(values.retryInterval !== undefined && {
        retryInterval: values.retryInterval,
      }),
      firmware: {
        location: values.location,
        retrieveDateTime: new Date(values.retrieveDateTime).toISOString(),
        ...(values.installDateTime && {
          installDateTime: new Date(values.installDateTime).toISOString(),
        }),
        ...(signingCertificate && { signingCertificate }),
        ...(values.signature && { signature: values.signature }),
      },
    };

    triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/configuration/updateFirmware?identifier=${parsedStation.id}&tenantId=1`,
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
      loading={loading || isRequestIdLoading}
      submitHandler={handleSubmit}
      submitButtonVariant={FormButtonVariants.submit}
      submitButtonLabel="Update Firmware"
      hideCancel
    >
      <FormField
        control={form.control}
        label="Request ID"
        name="requestId"
        required
      >
        <Input type="number" placeholder="Request ID" min="0" />
      </FormField>

      <FormField
        control={form.control}
        label="Location (URL)"
        name="location"
        required
      >
        <Input
          placeholder="https://example.com/firmware.bin"
          type="url"
          required
        />
      </FormField>

      <FormField
        control={form.control}
        label="Retrieve Date/Time"
        name="retrieveDateTime"
        required
      >
        <Input type="datetime-local" />
      </FormField>

      <FormField
        control={form.control}
        label="Install Date/Time"
        name="installDateTime"
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

      <FormField
        control={form.control}
        label="Signing Certificate (PEM)"
        name="signingCertificate"
      >
        <Textarea placeholder="Paste PEM-formatted certificate here" />
      </FormField>

      <FormField control={form.control} label="Signature" name="signature">
        <Input placeholder="Firmware signature" />
      </FormField>
    </Form>
  );
};
