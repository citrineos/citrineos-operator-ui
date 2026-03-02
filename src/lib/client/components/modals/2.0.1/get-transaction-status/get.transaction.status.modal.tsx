// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import {
  type ChargingStationDto,
  OCPPVersion,
  type TransactionDto,
  TransactionProps,
} from '@citrineos/base';
import { zodResolver } from '@hookform/resolvers/zod';
import { ComboboxFormField } from '@lib/client/components/form/field';
import { ChargingStationClass } from '@lib/cls/charging.station.dto';
import { GET_TRANSACTION_LIST_FOR_STATION } from '@lib/queries/transactions';
import { ResourceType } from '@lib/utils/access.types';
import type { MessageConfirmation } from '@lib/utils/MessageConfirmation';
import { triggerMessageAndHandleResponse } from '@lib/utils/messages.utils';
import { closeModal } from '@lib/utils/store/modal.slice';
import { useSelect } from '@refinedev/core';
import { useForm } from '@refinedev/react-hook-form';
import { plainToInstance } from 'class-transformer';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import z from 'zod';
import { Form } from '@lib/client/components/form';
import { FormButtonVariants } from '@lib/client/components/buttons/form.button';

export interface GetTransactionStatusModalProps {
  station: any;
}

export const GetTransactionStatusSchema = z.object({
  transactionId: z.string().optional(),
});

export type GetTransactionStatusFormData = z.infer<
  typeof GetTransactionStatusSchema
>;

export const GetTransactionStatusModal = ({
  station,
}: GetTransactionStatusModalProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const parsedStation: ChargingStationDto = useMemo(
    () => plainToInstance(ChargingStationClass, station),
    [station],
  ) as ChargingStationDto;

  const form = useForm({
    resolver: zodResolver(GetTransactionStatusSchema),
    defaultValues: {
      transactionId: undefined,
    },
  });

  const { options, onSearch, query } = useSelect<TransactionDto>({
    resource: ResourceType.TRANSACTIONS,
    optionLabel: TransactionProps.transactionId,
    optionValue: TransactionProps.transactionId,
    meta: {
      gqlQuery: GET_TRANSACTION_LIST_FOR_STATION,
      gqlVariables: {
        stationId: parsedStation.id,
      },
    },
    pagination: { mode: 'off' },
  });

  const onFinish = async (values: GetTransactionStatusFormData) => {
    if (!parsedStation?.id) {
      console.error(
        'Error: Cannot submit Get Transaction Status request because station ID is missing.',
      );
      return;
    }

    const data: any = {};

    if (values.transactionId) {
      data.transactionId = values.transactionId;
    }

    triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/transactions/getTransactionStatus?identifier=${parsedStation.id}&tenantId=1`,
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
      submitHandler={onFinish}
      loading={loading}
      submitButtonVariant={FormButtonVariants.submit}
      hideCancel
    >
      <ComboboxFormField
        control={form.control}
        name="transactionId"
        label="Transaction"
        description="Optionally select a transaction to get its status. Leave empty to get the status of all transactions."
        options={options}
        onSearch={onSearch}
        placeholder="Select Transaction"
        searchPlaceholder="Search Transactions"
        isLoading={query.isLoading}
      />
    </Form>
  );
};
