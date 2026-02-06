// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import React, { useEffect, useState } from 'react';
import {
  ChargingStationCapabilityEnum,
  type ChargingStationCapabilityEnumType,
  ChargingStationParkingRestrictionEnum,
  type ChargingStationParkingRestrictionEnumType,
  ChargingStationProps,
  ChargingStationSchema,
  type LocationDto,
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
import {
  CanAccess,
  type CrudFilter,
  useNotification,
  useSelect,
  useTranslate,
} from '@refinedev/core';
import { useForm } from '@refinedev/react-hook-form';
import { debounce } from 'lodash';
import { ChevronLeft, UploadIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import z from 'zod';
import { Card, CardContent, CardHeader } from '@lib/client/components/ui/card';
import { cardGridStyle, cardHeaderFlex } from '@lib/client/styles/card';
import { heading2Style, pageMargin } from '@lib/client/styles/page';
import { S3_BUCKET_FOLDER_IMAGES_CHARGING_STATIONS } from '@lib/utils/consts';
import { Field, FieldLabel } from '@lib/client/components/ui/field';
import { Button } from '@lib/client/components/ui/button';
import { buttonIconSize } from '@lib/client/styles/icon';
import { uploadFileViaPresignedUrl } from '@lib/server/actions/file/uploadFileViaPresignedUrl';
import { Checkbox } from '@lib/client/components/ui/checkbox';
import { Label } from '@lib/client/components/ui/label';

type ChargingStationUpsertProps = {
  params?: { id?: string };
};

const ChargingStationCreateSchema = ChargingStationSchema.pick({
  [ChargingStationProps.id]: true,
  [ChargingStationProps.locationId]: true,
  [ChargingStationProps.floorLevel]: true,
  [ChargingStationProps.parkingRestrictions]: true,
  [ChargingStationProps.capabilities]: true,
  [ChargingStationProps.use16StatusNotification0]: true,
});

const defaultChargingStation = {
  [ChargingStationProps.id]: '',
  [ChargingStationProps.isOnline]: false,
  [ChargingStationProps.locationId]: undefined,
  [ChargingStationProps.floorLevel]: '',
  [ChargingStationProps.parkingRestrictions]: [],
  [ChargingStationProps.capabilities]: [],
  [ChargingStationProps.use16StatusNotification0]: true,
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
  const locationId = searchParams?.get('locationId');

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [useLocationCoordinates, setUseLocationCoordinates] = useState(true);
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const { open } = useNotification();

  const { replace, back } = useRouter();
  const translate = useTranslate();

  const form = useForm({
    refineCoreProps: {
      resource: ResourceType.CHARGING_STATIONS,
      redirect: false,
      mutationMode: 'pessimistic',
      action: stationId ? 'edit' : 'create',
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

  // Initialize coordinates from station data when editing
  useEffect(() => {
    const station = form.refineCore.query?.data?.data;
    if (station && stationId) {
      const coords = (station as any).coordinates;
      if (coords) {
        setLatitude(coords.coordinates[1]);
        setLongitude(coords.coordinates[0]);
        setUseLocationCoordinates(false);
      } else {
        setUseLocationCoordinates(true);
      }
    }
  }, [form.refineCore.query?.data?.data, stationId]);

  // Update coordinates when location changes and useLocationCoordinates is true
  useEffect(() => {
    if (useLocationCoordinates && locationOptions) {
      const selectedLocationId = form.getValues(
        ChargingStationProps.locationId,
      );
      const selectedLocation = locationQuery.data?.data?.find(
        (loc: LocationDto) => loc.id === selectedLocationId,
      );
      if (selectedLocation?.coordinates) {
        setLatitude(selectedLocation.coordinates.coordinates[1]);
        setLongitude(selectedLocation.coordinates.coordinates[0]);
      }
    }
  }, [useLocationCoordinates, locationOptions, form, locationQuery.data?.data]);

  const handleOnFinish = (values: ChargingStationCreateDto) => {
    const now = new Date().toISOString();

    const newItem: any = getSerializedValues(
      { ...values },
      ChargingStationClass,
    );

    // Handle coordinates
    if (useLocationCoordinates) {
      newItem.coordinates = null;
    } else if (latitude !== undefined && longitude !== undefined) {
      newItem.coordinates = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
    }

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
          const renamedFileName = `${S3_BUCKET_FOLDER_IMAGES_CHARGING_STATIONS}/${finalStationId}`;
          uploadFileViaPresignedUrl(uploadedFile, renamedFileName).catch(
            (err: any) => {
              console.error(err);
              open?.({
                type: 'error',
                message: translate('imageUploadFailed'),
              });
            },
          );
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
              {translate(`actions.${stationId ? 'edit' : 'create'}`)}{' '}
              {translate('ChargingStations.chargingStation')}
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form} submitHandler={handleOnFinish}>
            <div className={cardGridStyle}>
              <FormField
                control={form.control}
                label="ID"
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
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="use16StatusNotification0"
                    checked={
                      form.watch(
                        ChargingStationProps.use16StatusNotification0,
                      ) ?? true
                    }
                    onCheckedChange={(checked) => {
                      form.setValue(
                        ChargingStationProps.use16StatusNotification0,
                        checked === true,
                      );
                    }}
                  />
                  <Label htmlFor="use16StatusNotification0">
                    {translate('ChargingStations.use16StatusNotification0')}
                  </Label>
                </div>
              </Field>

              {/* Coordinates Section */}
              <Field>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="useLocationCoordinates"
                    checked={useLocationCoordinates}
                    onCheckedChange={(checked) => {
                      setUseLocationCoordinates(checked === true);
                      if (checked) {
                        // Update coordinates from selected location
                        const selectedLocationId = form.getValues(
                          ChargingStationProps.locationId,
                        );
                        const selectedLocation = locationQuery.data?.data?.find(
                          (loc: LocationDto) => loc.id === selectedLocationId,
                        );
                        if (selectedLocation?.coordinates) {
                          setLatitude(
                            selectedLocation.coordinates.coordinates[1],
                          );
                          setLongitude(
                            selectedLocation.coordinates.coordinates[0],
                          );
                        }
                      }
                    }}
                  />
                  <Label htmlFor="useLocationCoordinates">
                    Use Location Coordinates
                  </Label>
                </div>
              </Field>

              <Field>
                <FieldLabel>
                  <span className={formLabelStyle}>Latitude</span>
                </FieldLabel>
                <Input
                  type="number"
                  step="any"
                  value={latitude ?? ''}
                  onChange={(e) =>
                    setLatitude(
                      e.target.value ? parseFloat(e.target.value) : undefined,
                    )
                  }
                  disabled={useLocationCoordinates}
                  placeholder="Enter latitude"
                />
              </Field>

              <Field>
                <FieldLabel>
                  <span className={formLabelStyle}>Longitude</span>
                </FieldLabel>
                <Input
                  type="number"
                  step="any"
                  value={longitude ?? ''}
                  onChange={(e) =>
                    setLongitude(
                      e.target.value ? parseFloat(e.target.value) : undefined,
                    )
                  }
                  disabled={useLocationCoordinates}
                  placeholder="Enter longitude"
                />
              </Field>

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
                  {translate('buttons.upload')}
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
