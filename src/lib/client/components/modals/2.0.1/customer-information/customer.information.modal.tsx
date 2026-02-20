// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import {
  type AuthorizationDto,
  type ChargingStationDto,
  OCPPVersion,
} from '@citrineos/base';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ComboboxFormField,
  formCheckboxStyle,
  FormField,
} from '@lib/client/components/form/field';
import { Checkbox } from '@lib/client/components/ui/checkbox';
import { Input } from '@lib/client/components/ui/input';
import { ChargingStationClass } from '@lib/cls/charging.station.dto';
import { AUTHORIZATIONS_LIST_QUERY } from '@lib/queries/authorizations';
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
import { Form } from '@lib/client/components/form';
import { FormButtonVariants } from '@lib/client/components/buttons/form.button';

export interface CustomerInformationModalProps {
  station: any;
}

export const CustomerInformationSchema = z.object({
  requestId: z.coerce
    .number<number>()
    .int()
    .positive('Request ID must be a positive number'),
  report: z.boolean(),
  clear: z.boolean(),
  customerIdentifier: z.string().optional(),
  authorization: z.string().optional(),
});

export type CustomerInformationFormData = z.infer<
  typeof CustomerInformationSchema
>;

export const CustomerInformationModal = ({
  station,
}: CustomerInformationModalProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const parsedStation: ChargingStationDto = useMemo(
    () => plainToInstance(ChargingStationClass, station),
    [station],
  ) as ChargingStationDto;

  const form = useForm({
    resolver: zodResolver(CustomerInformationSchema),
    defaultValues: {
      requestId: 1,
      report: false,
      clear: false,
      customerIdentifier: '',
      authorization: '',
    },
  });

  const { options, onSearch, query } = useSelect<AuthorizationDto>({
    resource: ResourceType.AUTHORIZATIONS,
    optionLabel: 'idToken',
    optionValue: (auth) => JSON.stringify(auth),
    meta: {
      gqlQuery: AUTHORIZATIONS_LIST_QUERY,
      gqlVariables: {
        offset: 0,
        limit: 10,
      },
    },
    pagination: { mode: 'off' },
  });

  const onFinish = (values: CustomerInformationFormData) => {
    if (!parsedStation?.id) {
      console.error(
        'Error: Cannot submit Customer Information request because station ID is missing.',
      );
      return;
    }

    const payload: any = {
      requestId: values.requestId,
      report: values.report,
      clear: values.clear,
      customerIdentifier: values.customerIdentifier || undefined,
    };

    if (values.authorization) {
      const authorization = JSON.parse(values.authorization);

      payload.idToken = {
        idToken: authorization.idToken,
        type: authorization.idTokenType,
        additionalInfo: authorization.additionalInfo,
      };
    }

    triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/reporting/customerInformation?identifier=${parsedStation.id}&tenantId=1`,
      data: payload,
      setLoading,
      ocppVersion: OCPPVersion.OCPP2_0_1,
    }).then(() => {
      form.reset({
        requestId: 1,
        report: false,
        clear: false,
        customerIdentifier: '',
        authorization: '',
      });

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
      <FormField
        control={form.control}
        label="Request ID"
        name="requestId"
        required
      >
        <Input type="number" placeholder="Enter request ID" />
      </FormField>

      <FormField control={form.control} label="Report" name="report">
        <Checkbox className={formCheckboxStyle} />
      </FormField>

      <FormField control={form.control} label="Clear" name="clear">
        <Checkbox className={formCheckboxStyle} />
      </FormField>

      <FormField
        control={form.control}
        label="Customer Identifier"
        name="customerIdentifier"
      >
        <Input placeholder="Enter customer identifier" />
      </FormField>

      <ComboboxFormField
        control={form.control}
        name="authorization"
        label="Authorization"
        options={options}
        onSearch={onSearch}
        placeholder="Search Authorizations"
        isLoading={query.isLoading}
      />
    </Form>
  );
};
