// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import { type ChargingStationDto, OCPPVersion } from '@citrineos/base';
import { zodResolver } from '@hookform/resolvers/zod';
import { ConnectorSelector } from '@lib/client/components/modals/shared/connector-selector/connector.selector';
import { EvseSelector } from '@lib/client/components/modals/shared/evse-selector/evse.selector';
import { ChargingStationClass } from '@lib/cls/charging.station.dto';
import type { MessageConfirmation } from '@lib/utils/MessageConfirmation';
import { triggerMessageAndHandleResponse } from '@lib/utils/messages.utils';
import { closeModal } from '@lib/utils/store/modal.slice';
import { useForm } from '@refinedev/react-hook-form';
import { plainToInstance } from 'class-transformer';
import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import z from 'zod';
import { Form } from '@lib/client/components/form';
import { Controller } from 'react-hook-form';
import { FormButtonVariants } from '@lib/client/components/buttons/form.button';

interface UnlockConnectorModalProps {
  station: any;
}

const UnlockConnectorSchema = z.object({
  evse: z.string({
    message: 'EVSE is required',
  }), // { id, evseTypeId }
  connectorId: z.number({
    message: 'Connector is required',
  }),
});

type UnlockConnectorFormData = z.infer<typeof UnlockConnectorSchema>;

export const UnlockConnectorModal = ({
  station,
}: UnlockConnectorModalProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const parsedStation: ChargingStationDto = useMemo(
    () => plainToInstance(ChargingStationClass, station),
    [station],
  ) as ChargingStationDto;

  const form = useForm({
    resolver: zodResolver(UnlockConnectorSchema),
    defaultValues: {
      evse: undefined,
      connectorId: undefined,
    },
  });

  const onFinish = (values: UnlockConnectorFormData) => {
    if (!parsedStation?.id) {
      console.error(
        'Error: Cannot submit Unlock Connector request because station ID is missing.',
      );
      return;
    }

    const parsedEvse = JSON.parse(values.evse);

    const data = {
      evseId: parsedEvse.evseTypeId,
      connectorId: values.connectorId,
    };

    triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/evdriver/unlockConnector?identifier=${parsedStation.id}&tenantId=1`,
      data,
      setLoading,
      ocppVersion: OCPPVersion.OCPP2_0_1,
    }).then(() => {
      form.reset();
      dispatch(closeModal());
    });
  };

  const handleEvseSelection = (value: string) => {
    form.setValue('evse', value);
    form.setValue('connectorId', 1);
  };

  const handleConnectorSelection = (value: number) => {
    form.setValue('connectorId', value);
  };

  const selectedEvseId = form.watch('evse');

  return (
    <Form
      {...form}
      loading={loading}
      submitHandler={onFinish}
      submitButtonVariant={FormButtonVariants.submit}
      submitButtonLabel="Unlock Connector"
      hideCancel
    >
      <Controller
        control={form.control}
        name="evse"
        render={({ field }) => (
          <EvseSelector
            station={parsedStation}
            value={field.value ?? undefined}
            onSelect={handleEvseSelection}
          />
        )}
      />

      <Controller
        control={form.control}
        name="connectorId"
        render={({ field }) => (
          <ConnectorSelector
            station={parsedStation}
            evseId={selectedEvseId ? JSON.parse(selectedEvseId).id : undefined}
            value={field.value ?? undefined}
            onSelect={handleConnectorSelection}
          />
        )}
      />
    </Form>
  );
};
