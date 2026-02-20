// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import React from 'react';
import { type ConnectorDto } from '@citrineos/base';
import {
  ConnectorFormatEnum,
  ConnectorPowerTypeEnum,
  ConnectorProps,
  ConnectorTypeEnum,
} from '@citrineos/base';
import { Form } from '@lib/client/components/form';
import {
  FormField,
  formLabelStyle,
  formLabelWrapperStyle,
  formRequiredAsterisk,
} from '@lib/client/components/form/field';
import { Input } from '@lib/client/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@lib/client/components/ui/select';
import { ConnectorClass } from '@lib/cls/connector.dto';
import {
  CONNECTOR_CREATE_MUTATION,
  CONNECTOR_EDIT_MUTATION,
} from '@lib/queries/connectors';
import { ResourceType } from '@lib/utils/access.types';
import { getSerializedValues } from '@lib/utils/middleware';
import { getSelectedChargingStation } from '@lib/utils/store/selected.charging.station.slice';
import { useForm } from '@refinedev/react-hook-form';
import { useSelector } from 'react-redux';
import { Field, FieldError, FieldLabel } from '@lib/client/components/ui/field';
import { Controller } from 'react-hook-form';
import { ScrollArea } from '@ferdiunal/refine-shadcn/ui';
import { evsesFormUpsertGrid } from '@lib/client/pages/charging-stations/detail/evses/evses.list';
import { Combobox } from '@lib/client/components/combobox';

interface ConnectorUpsertProps {
  onSubmit: () => void;
  connector: ConnectorDto | null;
  evseId?: number | null;
}

const connectorTypes = Object.keys(ConnectorTypeEnum);

const formats = Object.keys(ConnectorFormatEnum);

const powerTypes = Object.keys(ConnectorPowerTypeEnum);

export const ConnectorsUpsert: React.FC<ConnectorUpsertProps> = ({
  onSubmit,
  connector,
  evseId,
}) => {
  const selectedChargingStation = useSelector(getSelectedChargingStation());

  const form = useForm({
    refineCoreProps: {
      resource: ResourceType.CONNECTORS,
      id: connector?.id,
      redirect: false,
      action: connector ? 'edit' : 'create',
      mutationMode: 'pessimistic',
      meta: {
        gqlMutation: connector
          ? CONNECTOR_EDIT_MUTATION
          : CONNECTOR_CREATE_MUTATION,
      },
      onMutationSuccess: () => {
        onSubmit();
      },
    },
    defaultValues: {
      stationId: connector?.stationId || selectedChargingStation?.id || '',
      connectorId: connector?.connectorId || '',
      evseTypeConnectorId: connector?.evseTypeConnectorId || '',
      type: connector?.type || '',
      format: connector?.format || '',
      powerType: connector?.powerType || '',
      maximumAmperage: connector?.maximumAmperage || 0,
      maximumVoltage: connector?.maximumVoltage || 0,
      maximumPowerWatts: connector?.maximumPowerWatts || 0,
      termsAndConditionsUrl: connector?.termsAndConditionsUrl || '',
    },
  });

  const reset = () => {
    form.reset({
      stationId: '',
      connectorId: '',
      evseTypeConnectorId: '',
      type: '',
      format: '',
      powerType: '',
      maximumAmperage: 0,
      maximumVoltage: 0,
      maximumPowerWatts: 0,
      termsAndConditionsUrl: '',
    });
  };

  const handleOnFinish = (data: any) => {
    if (evseId) {
      data.evseId = evseId;
    }

    form.refineCore
      .onFinish(getSerializedValues(data, ConnectorClass))
      .then(() => reset());
  };

  return (
    <Form {...form} submitHandler={handleOnFinish}>
      <ScrollArea>
        <div className={evsesFormUpsertGrid}>
          <FormField
            control={form.control}
            name={ConnectorProps.stationId}
            label="Station ID"
          >
            <Input disabled={!!selectedChargingStation?.id} />
          </FormField>

          <FormField
            control={form.control}
            name={ConnectorProps.connectorId}
            label="Connector ID"
            description="The serial integers starting at 1 used in OCPP 1.6 to refer to the connector, unique per Charging Station."
          >
            <Input />
          </FormField>

          <FormField
            control={form.control}
            name={ConnectorProps.evseTypeConnectorId}
            label="EVSE Type Connector ID"
            description="The serial integers starting at 1 used in OCPP 2.0.1 to refer to the connector, unique per EVSE."
          >
            <Input />
          </FormField>

          <Controller
            name={ConnectorProps.type}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  className={formLabelWrapperStyle}
                >
                  <span className={formLabelStyle}>Type</span>
                  {formRequiredAsterisk}
                </FieldLabel>
                <Combobox<string>
                  options={connectorTypes.map((ct) => ({
                    label: ct,
                    value: ct,
                  }))}
                  value={field.value ?? undefined}
                  onSelect={(value) =>
                    form.setValue(ConnectorProps.type, value)
                  }
                  placeholder="Select Type"
                  searchPlaceholder="Search Types"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name={ConnectorProps.format}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  className={formLabelWrapperStyle}
                >
                  <span className={formLabelStyle}>Format</span>
                  {formRequiredAsterisk}
                </FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Format" />
                  </SelectTrigger>
                  <SelectContent>
                    {formats.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name={ConnectorProps.powerType}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  className={formLabelWrapperStyle}
                >
                  <span className={formLabelStyle}>Power Type</span>
                  {formRequiredAsterisk}
                </FieldLabel>
                <Combobox<string>
                  options={powerTypes.map((pt) => ({
                    label: pt,
                    value: pt,
                  }))}
                  value={field.value ?? undefined}
                  onSelect={(value) =>
                    form.setValue(ConnectorProps.powerType, value)
                  }
                  placeholder="Select Power Type"
                  searchPlaceholder="Search Power Types"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <FormField
            control={form.control}
            name={ConnectorProps.maximumAmperage}
            label="Maximum Amperage"
          >
            <Input type="number" />
          </FormField>

          <FormField
            control={form.control}
            name={ConnectorProps.maximumVoltage}
            label="Maximum Voltage"
          >
            <Input type="number" />
          </FormField>

          <FormField
            control={form.control}
            name={ConnectorProps.maximumPowerWatts}
            label="Maximum Power Watts"
          >
            <Input type="number" />
          </FormField>

          <FormField
            control={form.control}
            name={ConnectorProps.termsAndConditionsUrl}
            label="Terms and Conditions URL"
          >
            <Input />
          </FormField>
        </div>
      </ScrollArea>
    </Form>
  );
};
