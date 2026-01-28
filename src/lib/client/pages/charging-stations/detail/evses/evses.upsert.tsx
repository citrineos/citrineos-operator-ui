// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import React from 'react';
import type { EvseDto } from '@citrineos/base';
import { EvseProps } from '@citrineos/base';
import { Form } from '@lib/client/components/form';
import {
  formCheckboxStyle,
  FormField,
} from '@lib/client/components/form/field';
import { Checkbox } from '@lib/client/components/ui/checkbox';
import { Input } from '@lib/client/components/ui/input';
import { EvseClass } from '@lib/cls/evse.dto';
import { EVSE_CREATE_MUTATION, EVSE_EDIT_MUTATION } from '@lib/queries/evses';
import { ResourceType } from '@lib/utils/access.types';
import { getSerializedValues } from '@lib/utils/middleware';
import { useForm } from '@refinedev/react-hook-form';
import { evsesFormUpsertGrid } from '@lib/client/pages/charging-stations/detail/evses/evses.list';

interface EvseUpsertProps {
  onSubmit: () => void;
  stationId: string;
  evse: EvseDto | null;
}

export const EvseUpsert: React.FC<EvseUpsertProps> = ({
  onSubmit,
  stationId,
  evse,
}) => {
  const form = useForm({
    refineCoreProps: {
      resource: ResourceType.EVSES,
      id: evse?.id,
      redirect: false,
      action: evse ? 'edit' : 'create',
      mutationMode: 'pessimistic',
      meta: {
        gqlMutation: evse ? EVSE_EDIT_MUTATION : EVSE_CREATE_MUTATION,
      },
      onMutationSuccess: () => {
        onSubmit();
      },
    },
    defaultValues: {
      evseTypeId: evse?.evseTypeId || 0,
      evseId: evse?.evseId || '',
      physicalReference: evse?.physicalReference || '',
      removed: evse?.removed || false,
    },
  });

  const reset = () => {
    form.reset({
      evseTypeId: 0,
      evseId: '',
      physicalReference: '',
      removed: false,
    });
  };

  const handleOnFinish = (data: any) => {
    const newItem = getSerializedValues(data, EvseClass);
    newItem.stationId = stationId;

    form.refineCore.onFinish(newItem).then(() => reset());
  };

  return (
    <Form {...form} submitHandler={handleOnFinish} hideCancel>
      <div className={evsesFormUpsertGrid}>
        <FormField
          control={form.control}
          name={EvseProps.evseTypeId}
          label="EVSE Type ID"
          description="The serial integers used in OCPP 2.0.1 to refer to the EVSE, unique per Charging Station."
          required
        >
          <Input type="number" />
        </FormField>

        <FormField
          control={form.control}
          name={EvseProps.evseId}
          label="EVSE ID"
          description="The eMI3 compliant EVSE ID, which must be globally unique."
          required
        >
          <Input />
        </FormField>

        <FormField
          control={form.control}
          name={EvseProps.physicalReference}
          label="Physical Reference"
          description="Any identifier printed on the EVSE used to identify it when physically at the location, e.g. a number or a letter."
        >
          <Input />
        </FormField>

        <FormField
          control={form.control}
          name={EvseProps.removed}
          label="Removed"
          description="Marked as REMOVED"
        >
          <Checkbox className={formCheckboxStyle} />
        </FormField>
      </div>
    </Form>
  );
};
