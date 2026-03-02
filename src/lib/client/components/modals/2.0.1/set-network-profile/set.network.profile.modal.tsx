// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import React, { useMemo, useState } from 'react';
import {
  type ChargingStationDto,
  OCPP2_0_1,
  OCPPVersion,
} from '@citrineos/base';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@lib/client/components/form';
import {
  ComboboxFormField,
  formCheckboxStyle,
  FormField,
  formLabelStyle,
  formLabelWrapperStyle,
  SelectFormField,
} from '@lib/client/components/form/field';
import { Checkbox } from '@lib/client/components/ui/checkbox';
import { Input } from '@lib/client/components/ui/input';
import { Textarea } from '@lib/client/components/ui/textarea';
import { ChargingStationClass } from '@lib/cls/charging.station.dto';
import { SERVER_NETWORK_PROFILE_LIST_QUERY } from '@lib/queries/server.network.profiles';
import { ResourceType } from '@lib/utils/access.types';
import type { MessageConfirmation } from '@lib/utils/MessageConfirmation';
import { triggerMessageAndHandleResponse } from '@lib/utils/messages.utils';
import { closeModal } from '@lib/utils/store/modal.slice';
import { useSelect } from '@refinedev/core';
import { useForm } from '@refinedev/react-hook-form';
import { plainToInstance } from 'class-transformer';
import { useDispatch } from 'react-redux';
import z from 'zod';
import { Field, FieldLabel } from '@lib/client/components/ui/field';
import { FormButtonVariants } from '@lib/client/components/buttons/form.button';

export interface SetNetworkProfileModalProps {
  station: any;
}

// APN Schema
const ApnSchema = z.object({
  apn: z.string().min(1, 'APN is required').max(512),
  apnUserName: z.string().max(20).optional(),
  apnPassword: z.string().max(20).optional(),
  simPin: z.coerce.number<number>().int().optional(),
  preferredNetwork: z.string().max(6).optional(),
  useOnlyPreferredNetwork: z.boolean().optional(),
  apnAuthentication: z.enum(OCPP2_0_1.APNAuthenticationEnumType, {
    message: 'APN Authentication is required',
  }),
});

// VPN Schema
const VpnSchema = z.object({
  server: z.string().min(1, 'Server is required').max(512),
  user: z.string().min(1, 'User is required').max(20),
  group: z.string().max(20).optional(),
  password: z.string().min(1, 'Password is required').max(20),
  key: z.string().min(1, 'Key is required').max(255),
  type: z.enum(OCPP2_0_1.VPNEnumType, {
    message: 'VPN Type is required',
  }),
});

// Network Connection Profile Schema
const NetworkConnectionProfileSchema = z.object({
  ocppVersion: z.enum(OCPP2_0_1.OCPPVersionEnumType, {
    message: 'OCPP Version is required',
  }),
  ocppTransport: z.enum(OCPP2_0_1.OCPPTransportEnumType, {
    message: 'OCPP Transport is required',
  }),
  ocppCsmsUrl: z
    .string()
    .url('Must be a valid URL')
    .min(1, 'CSMS URL is required')
    .max(512),
  messageTimeout: z.coerce
    .number<number>()
    .int()
    .min(0, 'Message timeout must be positive'),
  securityProfile: z.coerce
    .number<number>()
    .int()
    .min(0, 'Security profile must be positive'),
  ocppInterface: z.enum(OCPP2_0_1.OCPPInterfaceEnumType, {
    message: 'OCPP Interface is required',
  }),
  apn: ApnSchema.optional(),
  vpn: VpnSchema.optional(),
});

const SetNetworkProfileSchema = z.object({
  websocketServerConfigId: z.string().optional(),
  configurationSlot: z.coerce
    .number<number>()
    .int()
    .min(0, 'Configuration slot must be non-negative'),
  connectionData: NetworkConnectionProfileSchema,
  includeApn: z.boolean(),
  includeVpn: z.boolean(),
});

type SetNetworkProfileFormData = z.infer<typeof SetNetworkProfileSchema>;

const fieldGrid = 'grid grid-cols-3 sm:grid-cols-2 xl:grid-cols-4 gap-6';

const ocppVersions = Object.keys(OCPP2_0_1.OCPPVersionEnumType);
const ocppTransports = Object.keys(OCPP2_0_1.OCPPTransportEnumType);
const ocppInterfaces = Object.keys(OCPP2_0_1.OCPPInterfaceEnumType);
const apnAuthenticationTypes = Object.keys(OCPP2_0_1.APNAuthenticationEnumType);
const vpnTypes = Object.keys(OCPP2_0_1.VPNEnumType);

export const SetNetworkProfileModal = ({
  station,
}: SetNetworkProfileModalProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const parsedStation: ChargingStationDto = useMemo(
    () => plainToInstance(ChargingStationClass, station),
    [station],
  ) as ChargingStationDto;

  const form = useForm({
    resolver: zodResolver(SetNetworkProfileSchema),
    defaultValues: {
      websocketServerConfigId: undefined,
      configurationSlot: 1,
      connectionData: {
        ocppVersion: OCPP2_0_1.OCPPVersionEnumType.OCPP20,
        ocppTransport: OCPP2_0_1.OCPPTransportEnumType.JSON,
        ocppCsmsUrl: '',
        messageTimeout: 30,
        securityProfile: 0,
        ocppInterface: OCPP2_0_1.OCPPInterfaceEnumType.Wired0,
        apn: undefined,
        vpn: undefined,
      },
      includeApn: false,
      includeVpn: false,
    },
  });

  const {
    options: serverNetworkProfileOptions,
    onSearch: serverNetworkProfileOnSearch,
    query: serverNetworkProfileQuery,
  } = useSelect({
    resource: ResourceType.SERVER_NETWORK_PROFILES,
    optionLabel: 'host',
    optionValue: 'id',
    meta: {
      gqlQuery: SERVER_NETWORK_PROFILE_LIST_QUERY,
      gqlVariables: {
        offset: 0,
        limit: 10,
      },
    },
    pagination: { mode: 'off' },
  });

  const onFinish = (values: SetNetworkProfileFormData) => {
    if (!parsedStation?.id) {
      console.error(
        'Error: Cannot submit Set Network Profile request because station ID is missing.',
      );
      return;
    }

    // Remove includeApn and includeVpn flags, and clean up connectionData
    const connectionData: any = {
      ocppVersion: values.connectionData.ocppVersion,
      ocppTransport: values.connectionData.ocppTransport,
      ocppCsmsUrl: values.connectionData.ocppCsmsUrl,
      messageTimeout: values.connectionData.messageTimeout,
      securityProfile: values.connectionData.securityProfile,
      ocppInterface: values.connectionData.ocppInterface,
    };

    if (values.includeApn && values.connectionData.apn) {
      connectionData.apn = values.connectionData.apn;
    }

    if (values.includeVpn && values.connectionData.vpn) {
      connectionData.vpn = values.connectionData.vpn;
    }

    const data = {
      configurationSlot: values.configurationSlot,
      connectionData,
    };

    let url = `/configuration/setNetworkProfile?identifier=${parsedStation.id}&tenantId=1`;
    if (values.websocketServerConfigId) {
      url = `${url}&websocketServerConfigId=${values.websocketServerConfigId}`;
    }

    triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url,
      data,
      setLoading,
      ocppVersion: OCPPVersion.OCPP2_0_1,
    }).then(() => {
      form.reset();
      dispatch(closeModal());
    });
  };

  const handleFormSubmit = () => onFinish(form.getValues());

  const includeApn = form.watch('includeApn');
  const includeVpn = form.watch('includeVpn');

  return (
    <Form
      {...form}
      submitHandler={handleFormSubmit}
      loading={loading}
      submitButtonVariant={FormButtonVariants.submit}
      submitButtonLabel="Set Network Profile"
      hideCancel
    >
      <div className={fieldGrid}>
        <ComboboxFormField
          control={form.control}
          label="Websocket Server Config"
          name="websocketServerConfigId"
          options={serverNetworkProfileOptions}
          onSearch={serverNetworkProfileOnSearch}
          placeholder="Search Server Network Profiles"
          isLoading={serverNetworkProfileQuery.isLoading}
        />

        <FormField
          control={form.control}
          label="Configuration Slot"
          name="configurationSlot"
        >
          <Input type="number" min="0" />
        </FormField>

        <SelectFormField
          control={form.control}
          label="OCPP Version"
          name="connectionData.ocppVersion"
          options={ocppVersions}
          placeholder="Select OCPP Version"
          required
        />

        <SelectFormField
          control={form.control}
          label="OCPP Transport"
          name="connectionData.ocppTransport"
          options={ocppTransports}
          placeholder="Select OCPP Transport"
          required
        />

        <FormField
          control={form.control}
          label="OCPP CSMS URL"
          name="connectionData.ocppCsmsUrl"
          required
        >
          <Input placeholder="wss://example.com/ocpp" type="url" />
        </FormField>

        <FormField
          control={form.control}
          label="Message Timeout (seconds)"
          name="connectionData.messageTimeout"
        >
          <Input type="number" min="0" />
        </FormField>

        <FormField
          control={form.control}
          label="Security Profile"
          name="connectionData.securityProfile"
        >
          <Input type="number" min={0} />
        </FormField>

        <SelectFormField
          control={form.control}
          label="OCPP Interface"
          name="connectionData.ocppInterface"
          options={ocppInterfaces}
          placeholder="Select OCPP Interface"
          required
        />

        <FormField
          control={form.control}
          label="Security Profile"
          name="connectionData.securityProfile"
        >
          <Input type="number" min={0} />
        </FormField>
      </div>
      <div className={fieldGrid}>
        {/* APN Section */}
        {/* Checkbox to show/hide APN section */}
        <Field>
          <FieldLabel className={formLabelWrapperStyle}>
            <span className={formLabelStyle}>Include APN Configuration</span>
          </FieldLabel>
          <Checkbox
            className={formCheckboxStyle}
            checked={includeApn}
            onCheckedChange={(checked) => {
              form.setValue('includeApn', checked as boolean);
              if (!checked) {
                form.setValue('connectionData.apn', undefined);
              } else {
                form.setValue('connectionData.apn', {
                  apn: '',
                  apnAuthentication: OCPP2_0_1.APNAuthenticationEnumType.CHAP,
                });
              }
            }}
          />
        </Field>

        {includeApn && (
          <>
            <FormField
              control={form.control}
              label="APN"
              name="connectionData.apn.apn"
              required
            >
              <Input placeholder="APN name" />
            </FormField>

            <SelectFormField
              control={form.control}
              label="APN Authentication"
              name="connectionData.apn.apnAuthentication"
              options={apnAuthenticationTypes}
              placeholder="Select Authentication Type"
              required
            />

            <FormField
              control={form.control}
              label="APN Username"
              name="connectionData.apn.apnUserName"
            >
              <Input />
            </FormField>

            <FormField
              control={form.control}
              label="APN Password"
              name="connectionData.apn.apnPassword"
            >
              <Input type="password" />
            </FormField>

            <FormField
              control={form.control}
              label="SIM PIN"
              name="connectionData.apn.simPin"
            >
              <Input type="number" />
            </FormField>

            <FormField
              control={form.control}
              label="Preferred Network"
              name="connectionData.apn.preferredNetwork"
            >
              <Input />
            </FormField>

            <FormField
              control={form.control}
              label="Use Only Preferred Network"
              name="connectionData.apn.useOnlyPreferredNetwork"
            >
              <Checkbox className={formCheckboxStyle} />
            </FormField>
          </>
        )}
      </div>
      <div className={fieldGrid}>
        {/* VPN Section */}
        {/* Checkbox to show/hide VPN section */}
        <Field>
          <FieldLabel className={formLabelWrapperStyle}>
            <span className={formLabelStyle}>Include VPN Configuration</span>
          </FieldLabel>
          <Checkbox
            className={formCheckboxStyle}
            checked={includeVpn}
            onCheckedChange={(checked) => {
              form.setValue('includeVpn', checked as boolean);
              if (!checked) {
                form.setValue('connectionData.vpn', undefined);
              } else {
                form.setValue('connectionData.vpn', {
                  server: '',
                  user: '',
                  password: '',
                  key: '',
                  type: OCPP2_0_1.VPNEnumType.IKEv2,
                });
              }
            }}
          />
        </Field>

        {includeVpn && (
          <>
            <SelectFormField
              control={form.control}
              label="VPN Type"
              name="connectionData.vpn.type"
              options={vpnTypes}
              placeholder="Select VPN Type"
              required
            />

            <FormField
              control={form.control}
              label="Server"
              name="connectionData.vpn.server"
              required
            >
              <Input placeholder="VPN server" />
            </FormField>

            <FormField
              control={form.control}
              label="User"
              name="connectionData.vpn.user"
              required
            >
              <Input placeholder="VPN username" />
            </FormField>

            <FormField
              control={form.control}
              label="Group"
              name="connectionData.vpn.group"
            >
              <Input />
            </FormField>

            <FormField
              control={form.control}
              label="Password"
              name="connectionData.vpn.password"
              required
            >
              <Input type="password" placeholder="VPN password" />
            </FormField>

            <FormField
              control={form.control}
              label="Key"
              name="connectionData.vpn.key"
              required
            >
              <Textarea placeholder="VPN key" rows={3} />
            </FormField>
          </>
        )}
      </div>
    </Form>
  );
};
