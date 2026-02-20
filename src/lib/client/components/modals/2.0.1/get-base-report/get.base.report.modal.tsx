// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import {
  type ChargingStationDto,
  OCPP2_0_1,
  OCPPVersion,
} from '@citrineos/base';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField, SelectFormField } from '@lib/client/components/form/field';
import { Input } from '@lib/client/components/ui/input';
import { ChargingStationClass } from '@lib/cls/charging.station.dto';
import { CHARGING_STATION_SEQUENCES_GET_QUERY } from '@lib/queries/charging.station.sequences';
import type { MessageConfirmation } from '@lib/utils/MessageConfirmation';
import { triggerMessageAndHandleResponse } from '@lib/utils/messages.utils';
import { closeModal } from '@lib/utils/store/modal.slice';
import { useApiUrl, useCustom } from '@refinedev/core';
import { useForm } from '@refinedev/react-hook-form';
import { plainToInstance } from 'class-transformer';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import z from 'zod';
import { Form } from '@lib/client/components/form';
import { FormButtonVariants } from '@lib/client/components/buttons/form.button';

export interface GetBaseReportModalProps {
  station: any;
}

const GetBaseReportSchema = z.object({
  requestId: z.coerce
    .number<number>()
    .int()
    .positive('Request ID must be a positive number'),
  reportBase: z.enum(OCPP2_0_1.ReportBaseEnumType, {
    message: 'Report Base is required',
  }),
});

type GetBaseReportFormData = z.infer<typeof GetBaseReportSchema>;

const reportBaseTypes = Object.keys(OCPP2_0_1.ReportBaseEnumType);

export const GetBaseReportModal = ({ station }: GetBaseReportModalProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const parsedStation: ChargingStationDto = useMemo(
    () => plainToInstance(ChargingStationClass, station),
    [station],
  ) as ChargingStationDto;

  const apiUrl = useApiUrl();
  const {
    query: { data: requestIdResponse, isLoading: isLoadingRequestId },
  } = useCustom<any>({
    url: `${apiUrl}`,
    method: 'post',
    config: {
      headers: {
        'Content-Type': 'application/json',
      },
    },
    meta: {
      operation: 'ChargingStationSequencesGet',
      gqlQuery: CHARGING_STATION_SEQUENCES_GET_QUERY,
      gqlVariables: {
        stationId: parsedStation.id,
        type: 'getBaseReport',
      },
    },
  });

  const form = useForm({
    resolver: zodResolver(GetBaseReportSchema),
    defaultValues: {
      requestId: 1,
      reportBase: OCPP2_0_1.ReportBaseEnumType.FullInventory,
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

  const onFinish = (values: GetBaseReportFormData) => {
    if (!parsedStation?.id) {
      console.error(
        'Error: Cannot submit Get Base Report request because station ID is missing.',
      );
      return;
    }

    const data = {
      requestId: values.requestId,
      reportBase: values.reportBase,
    };

    triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/reporting/getBaseReport?identifier=${parsedStation.id}&tenantId=1`,
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
      <FormField
        control={form.control}
        label="Request ID"
        name="requestId"
        required
      >
        <Input type="number" placeholder="Enter request ID" />
      </FormField>

      <SelectFormField
        control={form.control}
        label="Report Base"
        name="reportBase"
        options={reportBaseTypes}
        placeholder="Select Report Base"
        required
      />
    </Form>
  );
};
