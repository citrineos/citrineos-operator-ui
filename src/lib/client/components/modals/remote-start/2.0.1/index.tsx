// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import type {
  AuthorizationDto,
  ChargingStationDto,
  ChargingStationSequenceDto,
} from '@citrineos/base';
import {
  AuthorizationProps,
  BaseProps,
  ChargingStationSequenceTypeEnum,
} from '@citrineos/base';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@lib/client/components/form';
import {
  ComboboxFormField,
  FormField,
} from '@lib/client/components/form/field';
import { EvseSelector } from '@lib/client/components/modals/shared/evse-selector/evse.selector';
import { Input } from '@lib/client/components/ui/input';
import { ChargingStationSequenceClass } from '@lib/cls/charging.station.sequence.dto';
import { AUTHORIZATIONS_LIST_QUERY } from '@lib/queries/authorizations';
import { CHARGING_STATION_SEQUENCES_GET_QUERY } from '@lib/queries/charging.station.sequences';
import { ResourceType } from '@lib/utils/access.types';
import type { MessageConfirmation } from '@lib/utils/MessageConfirmation';
import { triggerMessageAndHandleResponse } from '@lib/utils/messages.utils';
import { closeModal } from '@lib/utils/store/modal.slice';
import { useCustom, useSelect } from '@refinedev/core';
import { useForm } from '@refinedev/react-hook-form';
import { plainToInstance } from 'class-transformer';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import z from 'zod';
import { Controller } from 'react-hook-form';
import { isEmpty } from '@lib/utils/assertion';
import { FormButtonVariants } from '@lib/client/components/buttons/form.button';

export interface OCPP2_0_1_RemoteStartProps {
  station: ChargingStationDto;
}

export const RemoteStartSchema = z.object({
  remoteStartId: z.coerce
    .number<number>()
    .min(0, 'Remote Start ID must be at least 0'),
  authorization: z.string().min(1, 'Authorization is required'),
  evse: z.string().optional(), // { id, evseTypeId }
});
export type RemoteStartFormData = z.infer<typeof RemoteStartSchema>;

export const OCPP2_0_1_RemoteStart = ({
  station,
}: OCPP2_0_1_RemoteStartProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(RemoteStartSchema),
    defaultValues: {
      remoteStartId: 0,
      authorization: '',
      evse: '',
    },
  });

  const {
    query: { data: requestIdResponse, isLoading: isLoadingRequestId },
  } = useCustom<ChargingStationSequenceDto>({
    meta: {
      gqlQuery: CHARGING_STATION_SEQUENCES_GET_QUERY,
      gqlVariables: {
        stationId: station.id,
        type: ChargingStationSequenceTypeEnum.remoteStartId,
      },
    },
    queryOptions: {
      select: (data: any) => {
        return {
          data: !data.data.ChargingStationSequences[0]
            ? undefined
            : plainToInstance(
                ChargingStationSequenceClass,
                data.data.ChargingStationSequences[0],
              ),
        };
      },
    },
  } as any);

  const {
    options: authorizationOptions,
    onSearch: authorizationOnSearch,
    query: authorizationQueryResult,
  } = useSelect<AuthorizationDto>({
    resource: ResourceType.AUTHORIZATIONS,
    optionLabel: 'idToken',
    optionValue: (item) => {
      return JSON.stringify({
        idToken: item.idToken,
        idTokenType: item.idTokenType,
        additionalInfo: item.additionalInfo,
      });
    },
    meta: {
      gqlQuery: AUTHORIZATIONS_LIST_QUERY,
      gqlVariables: { offset: 0, limit: 10 },
    },
    sorters: [{ field: BaseProps.updatedAt, order: 'desc' }],
    pagination: { mode: 'off' },
    onSearch: (value) => [
      {
        operator: 'or',
        value: [
          {
            field: AuthorizationProps.idToken,
            operator: 'contains',
            value,
          },
        ],
      },
    ],
  });

  useEffect(() => {
    if (
      requestIdResponse &&
      requestIdResponse.data &&
      requestIdResponse.data.value
    ) {
      form.setValue('remoteStartId', requestIdResponse.data.value);
    }
  }, [requestIdResponse, form]);

  const handleEvseSelection = (value: string) => {
    form.setValue('evse', value);
  };

  const onFinish = (values: RemoteStartFormData) => {
    const parsedAuthorization = JSON.parse(values.authorization);
    const parsedEvse = values.evse ? JSON.parse(values.evse) : undefined;
    const parsedAdditionalInfo = isEmpty(parsedAuthorization.additionalInfo)
      ? undefined
      : parsedAuthorization.additionalInfo;

    const data = {
      remoteStartId: values.remoteStartId,
      evseId: parsedEvse?.evseTypeId,
      idToken: {
        idToken: parsedAuthorization.idToken,
        type: parsedAuthorization.idTokenType!,
        additionalInfo: parsedAdditionalInfo,
      },
    };

    triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/evdriver/requestStartTransaction?identifier=${station.id}&tenantId=1`,
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
      loading={
        loading || authorizationQueryResult.isLoading || isLoadingRequestId
      }
      submitHandler={onFinish}
      hideCancel
      submitButtonVariant={FormButtonVariants.confirm}
      submitButtonLabel="Start"
    >
      <FormField
        control={form.control}
        label="Remote Start ID"
        name="remoteStartId"
      >
        <Input type="number" min={0} />
      </FormField>

      <ComboboxFormField
        control={form.control}
        label="Authorization"
        name="authorization"
        options={authorizationOptions}
        onSearch={authorizationOnSearch}
        placeholder="Select Authorization"
        searchPlaceholder="Search Authorizations"
        required
      />

      <Controller
        control={form.control}
        name="evse"
        render={({ field }) => (
          <EvseSelector
            station={station}
            value={field.value ?? undefined}
            onSelect={handleEvseSelection}
            isOptional
          />
        )}
      />
    </Form>
  );
};
