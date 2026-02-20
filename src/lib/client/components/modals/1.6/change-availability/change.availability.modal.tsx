// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { type ChargingStationDto, type ConnectorDto } from '@citrineos/base';
import { ConnectorProps, OCPP1_6, OCPPVersion } from '@citrineos/base';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@lib/client/components/form';
import {
  ComboboxFormField,
  SelectFormField,
} from '@lib/client/components/form/field';
import { ChargingStationClass } from '@lib/cls/charging.station.dto';
import { CONNECTOR_LIST_FOR_STATION_QUERY } from '@lib/queries/connectors';
import { ResourceType } from '@lib/utils/access.types';
import type { MessageConfirmation } from '@lib/utils/MessageConfirmation';
import { triggerMessageAndHandleResponse } from '@lib/utils/messages.utils';
import { closeModal } from '@lib/utils/store/modal.slice';
import { useSelect } from '@refinedev/core';
import { useForm } from '@refinedev/react-hook-form';
import { plainToInstance } from 'class-transformer';
import React, { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import z from 'zod';
import { FormButtonVariants } from '@lib/client/components/buttons/form.button';

export interface ChangeAvailabilityModalProps {
  station: ChargingStationDto;
}

const ChangeAvailabilitySchema = z.object({
  type: z.enum(OCPP1_6.ChangeAvailabilityRequestType, {
    message: 'Please select an availability type',
  }),
  connectorId: z.number({
    message: 'Connector is required',
  }),
});

type ChangeAvailabilityFormData = z.infer<typeof ChangeAvailabilitySchema>;

const availabilityTypes: OCPP1_6.ChangeAvailabilityRequestType[] = Object.keys(
  OCPP1_6.ChangeAvailabilityRequestType,
) as OCPP1_6.ChangeAvailabilityRequestType[];

export const ChangeAvailabilityModal = ({
  station,
}: ChangeAvailabilityModalProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const parsedStation: ChargingStationDto = useMemo(
    () => plainToInstance(ChargingStationClass, station),
    [station],
  ) as ChargingStationDto;

  const form = useForm({
    resolver: zodResolver(ChangeAvailabilitySchema),
    defaultValues: {
      type: undefined,
      connectorId: undefined,
    },
  });

  const { options, onSearch, query } = useSelect<ConnectorDto>({
    resource: ResourceType.CONNECTORS,
    optionLabel: 'connectorId',
    optionValue: 'connectorId',
    meta: {
      gqlQuery: CONNECTOR_LIST_FOR_STATION_QUERY,
      gqlVariables: {
        offset: 0,
        limit: 10,
        stationId: parsedStation.id,
      },
    },
    sorters: [{ field: ConnectorProps.connectorId, order: 'asc' }],
    pagination: { mode: 'off' },
    onSearch: (value: string) => {
      const connectorId = Number(value);
      if (!connectorId || !Number.isInteger(connectorId) || connectorId < 1) {
        return [];
      }
      return [
        {
          operator: 'or',
          value: [{ field: ConnectorProps.connectorId, operator: 'eq', value }],
        },
      ];
    },
  });

  const onFinish = async (values: ChangeAvailabilityFormData) => {
    const data = {
      type: values.type,
      connectorId: values.connectorId,
    };

    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/configuration/changeAvailability?identifier=${parsedStation.id}&tenantId=1`,
      data,
      setLoading,
      ocppVersion: OCPPVersion.OCPP1_6,
    });

    form.reset({
      type: undefined,
      connectorId: undefined,
    });

    dispatch(closeModal());
  };

  return (
    <Form
      {...form}
      loading={loading}
      submitHandler={onFinish}
      submitButtonVariant={FormButtonVariants.submit}
      hideCancel
    >
      <SelectFormField
        control={form.control}
        label="Availability"
        name="type"
        options={availabilityTypes}
        required
      />
      <ComboboxFormField
        control={form.control}
        label="Connector"
        name="connectorId"
        description="Connector IDs are serial integers starting at 1"
        options={options}
        onSearch={onSearch}
        placeholder="Select Connector"
        searchPlaceholder="Search Connectors"
        isLoading={query.isLoading}
        required
      />
    </Form>
  );
};
