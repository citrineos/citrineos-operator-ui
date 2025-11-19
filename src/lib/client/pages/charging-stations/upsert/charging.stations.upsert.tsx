// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import React, { useEffect, useState } from 'react';
import {
  type ChargingStationCapabilityEnumType,
  type ChargingStationParkingRestrictionEnumType,
  type LocationDto,
} from '@citrineos/base';
import {
  ChargingStationCapabilityEnum,
  ChargingStationParkingRestrictionEnum,
  ChargingStationProps,
  ChargingStationSchema,
  LocationProps,
} from '@citrineos/base';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@lib/client/components/form';
import {
  ComboboxFormField,
  FormField,
  formLabelStyle,
  MultiSelectFormField,
} from '@lib/client/components/form/field';
import { MenuSection } from '@lib/client/components/main-menu/main.menu';
import { Input } from '@lib/client/components/ui/input';
import { ChargingStationClass } from '@lib/cls/charging.station.dto';
import {
  CHARGING_STATIONS_CREATE_MUTATION,
  CHARGING_STATIONS_EDIT_MUTATION,
  CHARGING_STATIONS_GET_QUERY,
} from '@lib/queries/charging.stations';
import { LOCATIONS_LIST_QUERY } from '@lib/queries/locations';
import { ActionType, ResourceType } from '@lib/utils/access.types';
import { AccessDeniedFallback } from '@lib/utils/AccessDeniedFallback';
import config from '@lib/utils/config';
import { getSerializedValues } from '@lib/utils/middleware';
import { type CrudFilter, useNotification } from '@refinedev/core';
import { CanAccess, useSelect } from '@refinedev/core';
import { useForm } from '@refinedev/react-hook-form';
import { debounce } from 'lodash';
import { ChevronLeft, UploadIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import z from 'zod';
import { Card, CardContent, CardHeader } from '@lib/client/components/ui/card';
import { cardGridStyle, cardHeaderFlex } from '@lib/client/styles/card';
import { heading2Style, pageMargin } from '@lib/client/styles/page';
import { handleUploadToS3 } from '@lib/utils/file';
import { S3_BUCKET_FOLDER_IMAGES } from '@lib/utils/consts';
import { Field, FieldLabel } from '@lib/client/components/ui/field';
import { Button } from '@lib/client/components/ui/button';
import { buttonIconSize } from '@lib/client/styles/icon';

type ChargingStationUpsertProps = {
  params?: { id?: string };
};

const ChargingStationCreateSchema = ChargingStationSchema.pick({
  [ChargingStationProps.id]: true,
  [ChargingStationProps.locationId]: true,
  [ChargingStationProps.floorLevel]: true,
  [ChargingStationProps.parkingRestrictions]: true,
  [ChargingStationProps.capabilities]: true,
});

const defaultChargingStation = {
  [ChargingStationProps.id]: '',
  [ChargingStationProps.isOnline]: false,
  [ChargingStationProps.locationId]: undefined,
  [ChargingStationProps.floorLevel]: '',
  [ChargingStationProps.parkingRestrictions]: [],
  [ChargingStationProps.capabilities]: [],
};

const parkingRestrictions: ChargingStationParkingRestrictionEnumType[] =
  Object.keys(
    ChargingStationParkingRestrictionEnum,
  ) as ChargingStationParkingRestrictionEnumType[];

const capabilities: ChargingStationCapabilityEnumType[] = Object.keys(
  ChargingStationCapabilityEnum,
) as ChargingStationCapabilityEnumType[];

export type ChargingStationCreateDto = z.infer<
  typeof ChargingStationCreateSchema
>;

export const ChargingStationUpsert = ({
  params,
}: ChargingStationUpsertProps) => {
  const { id: stationId } = params || {};
  const searchParams = useSearchParams();
  const locationId = searchParams.get('locationId');

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const { open } = useNotification();

  const { replace, back } = useRouter();

  const form = useForm({
    refineCoreProps: {
      resource: ResourceType.CHARGING_STATIONS,
      redirect: false,
      mutationMode: 'pessimistic',
      action: stationId ? 'edit' : 'create',
      successNotification: () => {
        return {
          message: `Charging Station ${stationId ? 'updated' : 'created'} successfully`,
          type: 'success',
        };
      },
      errorNotification: (error) => {
        return {
          message: `Error ${stationId ? 'updating' : 'creating'} charging station: ${error?.message}`,
          type: 'error',
        };
      },
      meta: {
        gqlQuery: CHARGING_STATIONS_GET_QUERY,
        gqlMutation: stationId
          ? CHARGING_STATIONS_EDIT_MUTATION
          : CHARGING_STATIONS_CREATE_MUTATION,
      },
    },
    defaultValues: defaultChargingStation,
    resolver: zodResolver(ChargingStationCreateSchema),
    warnWhenUnsavedChanges: true,
  });

  // Location search using refine core's useSelect
  const {
    options: locationOptions,
    onSearch,
    query: locationQuery,
  } = useSelect<LocationDto>({
    resource: ResourceType.LOCATIONS,
    optionLabel: 'name',
    optionValue: 'id',
    meta: {
      gqlQuery: LOCATIONS_LIST_QUERY,
      gqlVariables: {
        where: locationId ? { id: { _eq: Number(locationId) } } : {},
        order_by: { updatedAt: 'desc' },
        offset: 0,
        limit: 5,
      },
    },
    pagination: {
      mode: 'off',
    },
    onSearch: (value: string) => {
      const debouncedSearch = debounce((value: string): CrudFilter[] => {
        if (!value) {
          return [];
        }
        const valueList = [
          { field: LocationProps.name, operator: 'contains', value },
          { field: LocationProps.address, operator: 'contains', value },
          { field: LocationProps.city, operator: 'contains', value },
          { field: LocationProps.state, operator: 'contains', value },
          { field: LocationProps.postalCode, operator: 'contains', value },
        ];
        return [
          {
            operator: 'or',
            value: valueList,
          } as CrudFilter,
        ];
      }, 300);

      return debouncedSearch(value) || [];
    },
  });

  useEffect(() => {
    if (locationId && form) {
      form.setValue(ChargingStationProps.locationId, Number(locationId));
    }
  }, [locationId, form]);

  const handleOnFinish = (values: ChargingStationCreateDto) => {
    const now = new Date().toISOString();

    const newItem: any = getSerializedValues(
      { ...values },
      ChargingStationClass,
    );

    if (!stationId) {
      newItem.tenantId = config.tenantId;
      newItem.createdAt = now;
    }
    newItem.updatedAt = now;

    form.refineCore.onFinish(newItem).then((result) => {
      if (result) {
        const finalStationId = stationId || (result as any).data?.id;

        // Upload image to S3
        if (uploadedFile && finalStationId) {
          const renamedFileName = `${S3_BUCKET_FOLDER_IMAGES}/${ResourceType.CHARGING_STATIONS}/${finalStationId}`;
          handleUploadToS3(uploadedFile, renamedFileName).catch((err: any) => {
            console.error(err);
            open?.({
              type: 'error',
              message: 'Image upload failed',
            });
          });
        }
        replace(`/${MenuSection.CHARGING_STATIONS}/${finalStationId}`);
      } else if (stationId) {
        back();
      }
    });
  };

  return (
    <CanAccess
      resource={ResourceType.CHARGING_STATIONS}
      action={ActionType.EDIT}
      fallback={<AccessDeniedFallback />}
      params={{ id: stationId }}
    >
      <Card className={pageMargin}>
        <CardHeader>
          <div className={cardHeaderFlex}>
            <ChevronLeft onClick={() => back()} className="cursor-pointer" />
            <h2 className={heading2Style}>
              {stationId ? 'Edit' : 'Create'} Charging Station
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form} submitHandler={handleOnFinish}>
            <div className={cardGridStyle}>
              <FormField
                control={form.control}
                label="Charging Station ID"
                name={ChargingStationProps.id}
                required
              >
                <Input />
              </FormField>
              <ComboboxFormField<number, ChargingStationCreateDto>
                control={form.control}
                name={ChargingStationProps.locationId}
                label="Location"
                options={locationOptions}
                onSearch={onSearch}
                placeholder="Select Location"
                isLoading={locationQuery.isLoading}
                required
                disabled={!!locationId}
              />
              <FormField
                control={form.control}
                label="Floor Level"
                name={ChargingStationProps.floorLevel}
              >
                <Input />
              </FormField>

              <MultiSelectFormField<
                ChargingStationParkingRestrictionEnumType,
                ChargingStationCreateDto
              >
                control={form.control}
                name={ChargingStationProps.parkingRestrictions}
                label="Parking Restrictions"
                options={parkingRestrictions}
                placeholder="Select Parking Restrictions"
                searchPlaceholder="Search Parking Restrictions"
              />

              <MultiSelectFormField<
                ChargingStationCapabilityEnumType,
                ChargingStationCreateDto
              >
                control={form.control}
                name={ChargingStationProps.capabilities}
                label="Capabilities"
                options={capabilities}
                placeholder="Select Capabilities"
                searchPlaceholder="Search Capabilities"
              />

              <Field>
                <FieldLabel>
                  <span className={formLabelStyle}>Image</span>
                </FieldLabel>
                <Input
                  type="file"
                  accept="image/*"
                  id="uploadInput"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setUploadedFile(file);
                    setUploadedFileName(file.name);
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    document.getElementById('uploadInput')?.click()
                  }
                >
                  <UploadIcon className={buttonIconSize} />
                  Upload
                </Button>
                {uploadedFileName && (
                  <span className="text-sm text-gray-700">
                    {uploadedFileName}
                  </span>
                )}
              </Field>
            </div>
          </Form>
        </CardContent>
      </Card>
    </CanAccess>
  );
};
