// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import {
  type AuthorizationDto,
  AuthorizationProps,
  AuthorizationSchema,
  AuthorizationWhitelistEnum,
  OCPP2_0_1,
} from '@citrineos/base';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@lib/client/components/form';
import {
  ComboboxFormField,
  formCheckboxStyle,
  FormField,
  SelectFormField,
} from '@lib/client/components/form/field';
import { Input } from '@lib/client/components/ui/input';
import { AuthorizationClass } from '@lib/cls/authorization.dto';
import {
  AUTHORIZATIONS_CREATE_MUTATION,
  AUTHORIZATIONS_EDIT_MUTATION,
  AUTHORIZATIONS_SHOW_QUERY,
} from '@lib/queries/authorizations';
import { ActionType, ResourceType } from '@lib/utils/access.types';
import config from '@lib/utils/config';
import { getSerializedValues } from '@lib/utils/middleware';
import { CanAccess, type GetOneResponse, useTranslate } from '@refinedev/core';
import { useForm } from '@refinedev/react-hook-form';
import z from 'zod';
import { Checkbox } from '@lib/client/components/ui/checkbox';
import { Textarea } from '@lib/client/components/ui/textarea';
import { AccessDeniedFallback } from '@lib/utils/AccessDeniedFallback';
import React from 'react';
import { Card, CardContent, CardHeader } from '@lib/client/components/ui/card';
import { heading2Style, pageMargin } from '@lib/client/styles/page';
import { cardGridStyle, cardHeaderFlex } from '@lib/client/styles/card';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

type AuthorizationUpsertProps = {
  params: { id?: string };
};

const AuthorizationCreateSchema = AuthorizationSchema.pick({
  [AuthorizationProps.idToken]: true,
  [AuthorizationProps.idTokenType]: true,
  [AuthorizationProps.status]: true,
  [AuthorizationProps.cacheExpiryDateTime]: true,
  [AuthorizationProps.language1]: true,
  [AuthorizationProps.language2]: true,
  [AuthorizationProps.personalMessage]: true,
  [AuthorizationProps.disallowedEvseIdPrefixes]: true,
  [AuthorizationProps.realTimeAuth]: true,
  [AuthorizationProps.realTimeAuthUrl]: true,
  [AuthorizationProps.concurrentTransaction]: true,
}).extend({
  [AuthorizationProps.allowedConnectorTypes]: z.string().nullable().optional(),
  [AuthorizationProps.disallowedEvseIdPrefixes]: z
    .string()
    .nullable()
    .optional(),
  [AuthorizationProps.groupAuthorizationId]: z.coerce
    .number<number>()
    .nullable()
    .optional(),
  [AuthorizationProps.chargingPriority]: z.coerce
    .number<number>()
    .nullable()
    .optional(),
  [AuthorizationProps.additionalInfo]: z.string().nullable().optional(),
  realTimeAuthTimeout: z.coerce.number<number>().nullable().optional(),
});

const defaultValues = {
  [AuthorizationProps.idToken]: '',
  [AuthorizationProps.idTokenType]: OCPP2_0_1.IdTokenEnumType.Central,
  [AuthorizationProps.status]: OCPP2_0_1.AuthorizationStatusEnumType.Unknown,
  [AuthorizationProps.cacheExpiryDateTime]: undefined,
  [AuthorizationProps.chargingPriority]: undefined,
  [AuthorizationProps.language1]: '',
  [AuthorizationProps.language2]: '',
  [AuthorizationProps.personalMessage]: '',
  [AuthorizationProps.groupAuthorizationId]: undefined,
  [AuthorizationProps.allowedConnectorTypes]: '',
  [AuthorizationProps.disallowedEvseIdPrefixes]: '',
  [AuthorizationProps.realTimeAuth]: undefined,
  [AuthorizationProps.realTimeAuthUrl]: '',
  realTimeAuthTimeout: undefined,
  [AuthorizationProps.additionalInfo]: '',
  [AuthorizationProps.concurrentTransaction]: false,
};

export type AuthorizationCreateDto = z.infer<typeof AuthorizationCreateSchema>;

const idTokenTypes = Object.keys(OCPP2_0_1.IdTokenEnumType);
const authorizationStatuses = Object.keys(
  OCPP2_0_1.AuthorizationStatusEnumType,
);
const authorizationWhitelistOptions = Object.keys(AuthorizationWhitelistEnum);

export const AuthorizationUpsert = ({ params }: AuthorizationUpsertProps) => {
  const { id } = params;
  const { back } = useRouter();
  const translate = useTranslate();

  const form = useForm({
    refineCoreProps: {
      resource: ResourceType.AUTHORIZATIONS,
      redirect: 'list',
      queryOptions: {
        enabled: !!id,
        select: (data: GetOneResponse<AuthorizationDto>) => {
          // Convert arrays to comma-separated strings for form display
          const formData = {
            ...data.data,
            allowedConnectorTypes:
              data.data?.allowedConnectorTypes?.join?.(', '),
            disallowedEvseIdPrefixes:
              data.data?.disallowedEvseIdPrefixes?.join?.(', '),
          };
          return { ...data, data: formData };
        },
      },
      mutationMode: 'pessimistic',
      action: id ? 'edit' : 'create',
      liveMode: 'auto',
      meta: {
        gqlQuery: AUTHORIZATIONS_SHOW_QUERY,
        gqlMutation: id
          ? AUTHORIZATIONS_EDIT_MUTATION
          : AUTHORIZATIONS_CREATE_MUTATION,
      },
    },
    defaultValues: { ...defaultValues },
    resolver: zodResolver(AuthorizationCreateSchema),
    warnWhenUnsavedChanges: true,
  });

  const handleOnFinish = async (values: AuthorizationCreateDto) => {
    const now = new Date().toISOString();
    const newItem: any = getSerializedValues(values, AuthorizationClass);

    // Trim whitespace from string fields
    const stringFields = [
      'idToken',
      'language1',
      'language2',
      'personalMessage',
      'realTimeAuthUrl',
    ];
    for (const field of stringFields) {
      if (typeof newItem[field] === 'string') {
        newItem[field] = newItem[field].trim();
      }
    }

    // Convert comma-separated strings back to arrays, set to undefined if empty
    if (typeof newItem.allowedConnectorTypes === 'string') {
      const arr = newItem.allowedConnectorTypes
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
      newItem.allowedConnectorTypes = arr.length > 0 ? arr : undefined;
    }
    if (typeof newItem.disallowedEvseIdPrefixes === 'string') {
      const arr = newItem.disallowedEvseIdPrefixes
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
      newItem.disallowedEvseIdPrefixes = arr.length > 0 ? arr : undefined;
    }

    // Convert empty strings to undefined
    const optionalStringFields = [
      'language1',
      'language2',
      'personalMessage',
      'realTimeAuthUrl',
    ];
    for (const field of optionalStringFields) {
      if (newItem[field] === '') {
        newItem[field] = undefined;
      }
    }

    if (newItem.additionalInfo === '') {
      newItem.additionalInfo = null;
    }

    if (!id) {
      newItem.tenantId = config.tenantId;
      newItem.createdAt = now;
    }
    newItem.updatedAt = now;

    form.refineCore.onFinish?.(newItem);
  };

  return (
    <CanAccess
      resource={ResourceType.AUTHORIZATIONS}
      action={ActionType.EDIT}
      fallback={<AccessDeniedFallback />}
      params={{ id }}
    >
      <Card className={pageMargin}>
        <CardHeader>
          <div className={cardHeaderFlex}>
            <ChevronLeft onClick={() => back()} className="cursor-pointer" />
            <h2 className={heading2Style}>
              {translate(`actions.${id ? 'edit' : 'create'}`)}{' '}
              {translate('Authorizations.authorization')}
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form} submitHandler={handleOnFinish}>
            <div className={cardGridStyle}>
              <FormField
                control={form.control}
                label="ID Token"
                name={AuthorizationProps.idToken}
                required
              >
                <Input />
              </FormField>

              <ComboboxFormField
                control={form.control}
                label="ID Token Type"
                name={AuthorizationProps.idTokenType}
                options={idTokenTypes.map((type) => ({
                  label: type,
                  value: type,
                }))}
                placeholder="Select Type"
                searchPlaceholder="Search Types"
                required
              />

              <ComboboxFormField
                control={form.control}
                label="Status"
                name={AuthorizationProps.status}
                options={authorizationStatuses.map((status) => ({
                  label: status,
                  value: status,
                }))}
                placeholder="Select Status"
                searchPlaceholder="Search Statuses"
                required
              />

              <FormField
                control={form.control}
                label="Cache Expiry DateTime"
                name={AuthorizationProps.cacheExpiryDateTime}
              >
                <Input type="datetime-local" />
              </FormField>

              <FormField
                control={form.control}
                label="Charging Priority"
                name={AuthorizationProps.chargingPriority}
              >
                <Input type="number" min="0" />
              </FormField>

              <FormField
                control={form.control}
                label="Language 1"
                name={AuthorizationProps.language1}
              >
                <Input />
              </FormField>

              <FormField
                control={form.control}
                label="Language 2"
                name={AuthorizationProps.language2}
              >
                <Input />
              </FormField>

              <FormField
                control={form.control}
                label="Personal Message"
                name={AuthorizationProps.personalMessage}
              >
                <Input />
              </FormField>

              <FormField
                control={form.control}
                label="Group Authorization ID"
                name={AuthorizationProps.groupAuthorizationId}
              >
                <Input type="number" min="1" />
              </FormField>

              <FormField
                control={form.control}
                label="Allowed Connector Types (comma-separated)"
                name="allowedConnectorTypes"
              >
                <Input placeholder="e.g., Type2, CCS" />
              </FormField>

              <FormField
                control={form.control}
                label="Disallowed EVSE ID Prefixes (comma-separated)"
                name="disallowedEvseIdPrefixes"
              >
                <Input placeholder="e.g., EVSE1, EVSE2" />
              </FormField>

              <SelectFormField
                control={form.control}
                label="Real-Time Authentication"
                name={AuthorizationProps.realTimeAuth}
                options={authorizationWhitelistOptions}
                placeholder="Select Option"
              />

              <FormField
                control={form.control}
                label="Real-Time Authentication URL"
                name={AuthorizationProps.realTimeAuthUrl}
              >
                <Input type="url" />
              </FormField>

              <FormField
                control={form.control}
                label="Real-Time Authentication Timeout (seconds)"
                name="realTimeAuthTimeout"
              >
                <Input type="number" min="0" />
              </FormField>

              <FormField
                control={form.control}
                label="Additional Info (JSON)"
                name={AuthorizationProps.additionalInfo}
              >
                <Textarea placeholder='[{ "key1": "value1" }, { "key2": "value2" }]' />
              </FormField>

              <FormField
                control={form.control}
                label="Allow Concurrent Transaction"
                name={AuthorizationProps.concurrentTransaction}
              >
                <Checkbox className={formCheckboxStyle} />
              </FormField>
            </div>
          </Form>
        </CardContent>
      </Card>
    </CanAccess>
  );
};
