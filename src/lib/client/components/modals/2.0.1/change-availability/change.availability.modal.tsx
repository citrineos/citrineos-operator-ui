// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useState } from 'react';
import { type ChargingStationDto } from '@citrineos/base';
import { OCPP2_0_1 } from '@citrineos/base';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@lib/client/components/form';
import { ComboboxFormField } from '@lib/client/components/form/field';
import { ConnectorSelector } from '@lib/client/components/modals/shared/connector-selector/connector.selector';
import { EvseSelector } from '@lib/client/components/modals/shared/evse-selector/evse.selector';
import { ChargingStationClass } from '@lib/cls/charging.station.dto';
import type { MessageConfirmation } from '@lib/utils/MessageConfirmation';
import { triggerMessageAndHandleResponse } from '@lib/utils/messages.utils';
import { closeModal } from '@lib/utils/store/modal.slice';
import { useForm } from '@refinedev/react-hook-form';
import { plainToInstance } from 'class-transformer';
import { useDispatch } from 'react-redux';
import { z } from 'zod';
import { Controller } from 'react-hook-form';
import { FormButtonVariants } from '@lib/client/components/buttons/form.button';

export interface ChangeAvailabilityModalProps {
  station: ChargingStationDto;
}

const ChangeAvailabilitySchema = z.object({
  operationalStatus: z.enum(OCPP2_0_1.OperationalStatusEnumType, {
    message: 'Please select an operational status',
  }),
  evse: z.string().optional(), // { id, evseTypeId }
  connectorId: z.number().optional(),
});

type ChangeAvailabilityFormData = z.infer<typeof ChangeAvailabilitySchema>;

const statuses: OCPP2_0_1.OperationalStatusEnumType[] = Object.keys(
  OCPP2_0_1.OperationalStatusEnumType,
) as OCPP2_0_1.OperationalStatusEnumType[];

export const ChangeAvailabilityModal = ({
  station,
}: ChangeAvailabilityModalProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const parsedStation: ChargingStationDto = useMemo(
    () => plainToInstance(ChargingStationClass, station),
    [station],
  ) as ChargingStationDto;

  const form = useForm({
    resolver: zodResolver(ChangeAvailabilitySchema),
    defaultValues: {
      operationalStatus: undefined,
      evse: undefined,
      connectorId: undefined,
    },
  });

  const handleSubmit = async (values: ChangeAvailabilityFormData) => {
    const data: any = {
      operationalStatus: values.operationalStatus,
    };

    if (values.evse !== undefined) {
      const parsedEvse = JSON.parse(values.evse);

      data.evse = {
        id: parsedEvse.evseTypeId,
        ...(values.connectorId !== undefined
          ? { connectorId: values.connectorId }
          : {}),
      };
    }

    triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/configuration/changeAvailability?identifier=${parsedStation.id}&tenantId=1`,
      data,
      setLoading,
    }).then(() => {
      form.reset();
      dispatch(closeModal());
    });
  };

  const handleEvseSelection = (value: any) => {
    form.setValue('evse', value);
    // Reset connector when EVSE changes
    form.setValue('connectorId', undefined);
  };

  const handleConnectorSelection = (value: number) => {
    form.setValue('connectorId', value);
  };

  const selectedEvseId = form.watch('evse');

  return (
    <Form
      {...form}
      submitHandler={handleSubmit}
      loading={loading}
      submitButtonVariant={FormButtonVariants.submit}
      hideCancel
    >
      <ComboboxFormField
        control={form.control}
        name="operationalStatus"
        label="Operational Status"
        options={statuses.map((status) => ({
          label: status,
          value: status,
        }))}
        placeholder="Select Status"
        required
      />

      <Controller
        control={form.control}
        name="evse"
        render={({ field }) => (
          <EvseSelector
            station={parsedStation}
            value={field.value ?? undefined}
            onSelect={handleEvseSelection}
            isOptional
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
            isOptional
            requiresEvseId
          />
        )}
      />
    </Form>
  );
};
