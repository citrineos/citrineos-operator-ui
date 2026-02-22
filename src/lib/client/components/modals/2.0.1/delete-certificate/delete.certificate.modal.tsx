// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import {
  type ChargingStationDto,
  type InstalledCertificateDto,
  InstalledCertificateProps,
  OCPPVersion,
} from '@citrineos/base';
import { zodResolver } from '@hookform/resolvers/zod';
import { ComboboxFormField } from '@lib/client/components/form/field';
import { ChargingStationClass } from '@lib/cls/charging.station.dto';
import { INSTALLED_CERTIFICATE_LIST_QUERY } from '@lib/queries/installed.certificates';
import { ResourceType } from '@lib/utils/access.types';
import type { MessageConfirmation } from '@lib/utils/MessageConfirmation';
import { triggerMessageAndHandleResponse } from '@lib/utils/messages.utils';
import { closeModal } from '@lib/utils/store/modal.slice';
import { useSelect } from '@refinedev/core';
import { useForm } from '@refinedev/react-hook-form';
import { plainToInstance } from 'class-transformer';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import z from 'zod';
import { Form } from '@lib/client/components/form';
import { FormButtonVariants } from '@lib/client/components/buttons/form.button';

export interface DeleteCertificateModalProps {
  station: any;
}

export const DeleteCertificateSchema = z.object({
  certificate: z.string().min(1, 'Certificate is required'),
});

export type DeleteCertificateFormData = z.infer<typeof DeleteCertificateSchema>;

export const DeleteCertificateModal = ({
  station,
}: DeleteCertificateModalProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const parsedStation: ChargingStationDto = useMemo(
    () => plainToInstance(ChargingStationClass, station),
    [station],
  ) as ChargingStationDto;

  const form = useForm({
    resolver: zodResolver(DeleteCertificateSchema),
    defaultValues: {
      certificate: '',
    },
  });

  const { options, onSearch, query } = useSelect<InstalledCertificateDto>({
    resource: ResourceType.INSTALLED_CERTIFICATES,
    optionLabel: 'serialNumber',
    optionValue: (cert) => JSON.stringify(cert),
    meta: {
      gqlQuery: INSTALLED_CERTIFICATE_LIST_QUERY,
      gqlVariables: {
        offset: 0,
        limit: 10,
      },
    },
    filters: [
      {
        field: InstalledCertificateProps.stationId,
        operator: 'eq',
        value: parsedStation.id,
      },
    ],
    pagination: { mode: 'off' },
  });

  const selectedCertificate = form.watch('certificate');

  const onFinish = async (values: DeleteCertificateFormData) => {
    if (!parsedStation?.id) {
      console.error(
        'Error: Cannot submit Delete Certificate request because station ID is missing.',
      );
      return;
    }

    if (!values.certificate) {
      toast.error('Please select a certificate');
      return;
    }

    const certificate = JSON.parse(values.certificate);

    if (parsedStation.id !== certificate.stationId) {
      toast.error('This certificate does not belong to this station');
      return;
    }

    const data = {
      certificateHashData: {
        hashAlgorithm: certificate.hashAlgorithm,
        issuerNameHash: certificate.issuerNameHash,
        issuerKeyHash: certificate.issuerKeyHash,
        serialNumber: certificate.serialNumber,
      },
    };

    triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/certificates/deleteCertificate?identifier=${parsedStation.id}&tenantId=1`,
      data,
      setLoading,
      ocppVersion: OCPPVersion.OCPP2_0_1,
    }).then(() => {
      form.reset({
        certificate: '',
      });
      dispatch(closeModal());
    });
  };

  const renderCertificateInformation = (stringifiedCertificate: string) => {
    if (!stringifiedCertificate) {
      return <></>;
    }

    const certificate = JSON.parse(stringifiedCertificate);

    return (
      <div className="flex flex-col gap-2 rounded-md bg-muted p-4 text-sm">
        <span>
          <span className="font-semibold">Hash Algorithm:</span>{' '}
          {certificate.hashAlgorithm}
        </span>
      </div>
    );
  };

  return (
    <Form
      {...form}
      submitHandler={onFinish}
      loading={loading}
      submitButtonVariant={FormButtonVariants.delete}
      submitButtonLabel="Delete Certificate"
      hideCancel
    >
      <ComboboxFormField
        control={form.control}
        name="certificate"
        label="Installed Certificate"
        options={options}
        onSearch={onSearch}
        placeholder="Search Certificates by Serial Number"
        isLoading={query.isLoading}
        required
      />

      {renderCertificateInformation(selectedCertificate)}
    </Form>
  );
};
