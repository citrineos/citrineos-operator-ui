// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0
'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ChargingStationProps,
  ChargingStationSchema,
  type LocationFacilityEnumType,
  type LocationParkingEnumType,
  LocationProps,
  LocationSchema,
  PointSchema,
} from '@citrineos/base';
import { LocationFacilityEnum, LocationParkingEnum } from '@citrineos/base';
import { MenuSection } from '@lib/client/components/main-menu/main.menu';
import {
  defaultLatitude,
  defaultLongitude,
  MapLocationPicker,
} from '@lib/client/components/map/map.location.picker';
import { Button } from '@lib/client/components/ui/button';
import { Input } from '@lib/client/components/ui/input';
import { LocationClass } from '@lib/cls/location.dto';
import {
  LOCATIONS_CREATE_MUTATION,
  LOCATIONS_EDIT_MUTATION,
  LOCATIONS_GET_QUERY,
} from '@lib/queries/locations';
import { AccessDeniedFallback } from '@lib/utils/AccessDeniedFallback';
import { ActionType, ResourceType } from '@lib/utils/access.types';
import config from '@lib/utils/config';
import { Country, countryStateData } from '@lib/utils/country.state.data';
import { getSerializedValues } from '@lib/utils/middleware';
import { CanAccess, useUpdateMany } from '@refinedev/core';
import { ChevronLeft, Upload as UploadIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { heading2Style, pageFlex, pageMargin } from '@lib/client/styles/page';
import { cardHeaderFlex } from '@lib/client/styles/card';
import { Card, CardContent, CardHeader } from '@lib/client/components/ui/card';
import { useForm } from '@refinedev/react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ComboboxFormField,
  FormField,
  formLabelStyle,
  formLabelWrapperStyle,
  formRequiredAsterisk,
  MultiSelectFormField,
  SelectFormField,
} from '@lib/client/components/form/field';
import { Field, FieldLabel } from '@lib/client/components/ui/field';
import { buttonIconSize } from '@lib/client/styles/icon';
import { Form } from '@lib/client/components/form';
import { z } from 'zod';
import { GeoPoint } from '@lib/utils/GeoPoint';
import { Controller } from 'react-hook-form';
import { AddressAutocomplete } from '@lib/client/components/form/address-autocomplete';
import { SelectedChargingStations } from '@lib/client/pages/locations/upsert/selected.charging.stations';
import { toast } from 'sonner';
import { useNotification } from '@refinedev/core';
import { S3_BUCKET_FOLDER_IMAGES_LOCATIONS } from '@lib/utils/consts';
import { uploadFileViaPresignedUrl } from '@lib/server/actions/file/uploadFileViaPresignedUrl';

type LocationsUpsertProps = {
  params: { id?: string };
};

const LocationCreateSchema = LocationSchema.pick({
  [LocationProps.name]: true,
  [LocationProps.address]: true,
  [LocationProps.city]: true,
  [LocationProps.postalCode]: true,
  [LocationProps.state]: true,
  [LocationProps.country]: true,
  [LocationProps.timeZone]: true,
  [LocationProps.parkingType]: true,
  [LocationProps.facilities]: true,
  [LocationProps.chargingPool]: true,
}).extend({
  [LocationProps.coordinates]: PointSchema.optional(),
  [LocationProps.chargingPool]: z
    .array(
      ChargingStationSchema.pick({
        [ChargingStationProps.id]: true,
      }),
    )
    .nullable()
    .optional(),
});

type LocationCreateDto = z.infer<typeof LocationCreateSchema>;

const defaultLocation = {
  [LocationProps.name]: '',
  [LocationProps.address]: '',
  [LocationProps.city]: '',
  [LocationProps.postalCode]: '',
  [LocationProps.state]: '',
  [LocationProps.country]: Country.USA,
  [LocationProps.coordinates]: undefined,
  [LocationProps.timeZone]: 'UTC',
  [LocationProps.parkingType]: undefined,
  [LocationProps.facilities]: [] as LocationFacilityEnumType[],
  [LocationProps.chargingPool]: undefined,
};

const countryOptions = Object.keys(Country);

const parkingTypes: LocationParkingEnumType[] = Object.keys(
  LocationParkingEnum,
) as LocationParkingEnumType[];

const facilities: LocationFacilityEnumType[] = Object.keys(
  LocationFacilityEnum,
) as LocationFacilityEnumType[];

export const LocationsUpsert = ({ params }: LocationsUpsertProps) => {
  const locationId = params.id ?? undefined;
  const { replace, back } = useRouter();
  const { mutate } = useUpdateMany();

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const { open } = useNotification();

  const originalStationIdsRef = useRef<string[] | undefined>(undefined);
  const [latitude, setLatitude] = useState<number | undefined>(defaultLatitude);
  const [longitude, setLongitude] = useState<number | undefined>(
    defaultLongitude,
  );
  const [geoPoint, setGeoPoint] = useState<GeoPoint | undefined>(
    new GeoPoint(defaultLatitude, defaultLongitude),
  );

  const [stateLoading, setStateLoading] = useState(false);

  const form = useForm({
    refineCoreProps: {
      resource: ResourceType.LOCATIONS,
      redirect: false,
      mutationMode: 'pessimistic',
      action: locationId ? 'edit' : 'create',
      successNotification: () => {
        return {
          message: `Location ${locationId ? 'updated' : 'created'} successfully`,
          type: 'success',
        };
      },
      errorNotification: (error) => {
        return {
          message: `Error ${locationId ? 'updating' : 'creating'} location: ${error?.message}`,
          type: 'error',
        };
      },
      meta: {
        gqlQuery: LOCATIONS_GET_QUERY,
        gqlMutation: locationId
          ? LOCATIONS_EDIT_MUTATION
          : LOCATIONS_CREATE_MUTATION,
      },
    },
    defaultValues: defaultLocation,
    resolver: zodResolver(LocationCreateSchema),
    warnWhenUnsavedChanges: true,
  });

  const chosenState = form.watch(LocationProps.state);
  const chosenCountry = form.watch(LocationProps.country);
  const coordinates = form.watch(LocationProps.coordinates);
  const currentChargingPool = form.watch(LocationProps.chargingPool);

  useEffect(() => {
    if (!originalStationIdsRef.current && currentChargingPool !== undefined) {
      originalStationIdsRef.current = currentChargingPool
        ? currentChargingPool.map((charger) => charger.id)
        : [];
    }
  }, [currentChargingPool]);

  useEffect(() => {
    if (latitude && longitude) {
      setGeoPoint(new GeoPoint(latitude, longitude));
    } else {
      setGeoPoint(undefined);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (coordinates && coordinates.coordinates) {
      setLatitude(coordinates.coordinates[1]);
      setLongitude(coordinates.coordinates[0]);
    } else {
      setLatitude(defaultLatitude);
      setLongitude(defaultLongitude);
    }
  }, [coordinates]);

  const processChargingPoolChanges = (locationId: string) => {
    const prevStationIds = new Set(originalStationIdsRef.current);
    const currentStationIds = new Set(
      (currentChargingPool || []).map((charger) => charger.id),
    );

    const addedIds = [...currentStationIds].filter(
      (id) => !prevStationIds.has(id),
    );
    const removedIds = [...prevStationIds].filter(
      (id) => !currentStationIds.has(id),
    );

    const updateOperations = [];
    if (addedIds.length > 0) {
      updateOperations.push(
        new Promise((resolve, reject) => {
          mutate(
            {
              successNotification: false,
              resource: ResourceType.CHARGING_STATIONS,
              mutationMode: 'pessimistic',
              ids: addedIds,
              values: {
                [ChargingStationProps.locationId]: locationId,
              },
            },
            {
              onSuccess: resolve,
              onError: reject,
            },
          );
        }),
      );
    }
    if (removedIds.length > 0) {
      updateOperations.push(
        new Promise((resolve, reject) => {
          mutate(
            {
              successNotification: false,
              resource: ResourceType.CHARGING_STATIONS,
              mutationMode: 'pessimistic',
              ids: removedIds,
              values: { [ChargingStationProps.locationId]: null },
            },
            {
              onSuccess: resolve,
              onError: reject,
            },
          );
        }),
      );
    }

    Promise.all(updateOperations).catch((err: any) =>
      toast.error(
        `Failed to update charging stations on location due to error ${JSON.stringify(err)}`,
      ),
    );
  };

  const handleSubmit = (values: LocationCreateDto) => {
    const now = new Date().toISOString();

    const newItem: any = getSerializedValues({ ...values }, LocationClass);

    if (!locationId) {
      newItem.tenantId = config.tenantId;
      newItem.createdAt = now;
    }

    newItem.updatedAt = now;

    if (latitude && longitude) {
      newItem.coordinates = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
    }

    // Remove chargingPool before sending to Hasura
    // Will be handled after successful response
    const { chargingPool, ...finalLocation } = newItem;

    form.refineCore.onFinish(finalLocation).then((result) => {
      if (result) {
        // Get final location id from existing or new location
        const finalLocationId = locationId || (result as any).data?.id;

        // Upload image
        if (uploadedFile && finalLocationId) {
          const renamedFileName = `${S3_BUCKET_FOLDER_IMAGES_LOCATIONS}/${finalLocationId}`;
          uploadFileViaPresignedUrl(uploadedFile, renamedFileName).catch(
            (err: any) => {
              console.error(err);
              open?.({
                type: 'error',
                message: 'Image upload failed',
              });
            },
          );
        }

        replace(`/${MenuSection.LOCATIONS}/${finalLocationId}`);
      } else if (locationId) {
        processChargingPoolChanges(locationId);
        back();
      }
    });
  };

  const handleMapClick = (point: GeoPoint) => {
    setLatitude(point.latitude);
    setLongitude(point.longitude);
  };

  return (
    <CanAccess
      resource={ResourceType.LOCATIONS}
      action={locationId ? ActionType.EDIT : ActionType.CREATE}
      fallback={<AccessDeniedFallback />}
      params={{ id: locationId }}
    >
      <div className={`${pageMargin} ${pageFlex}`}>
        <Card>
          <CardHeader>
            <div className={cardHeaderFlex}>
              <ChevronLeft className="cursor-pointer" onClick={() => back()} />
              <h2 className={heading2Style}>
                {locationId ? 'Edit' : 'Create'} Location
              </h2>
            </div>
          </CardHeader>
          <CardContent>
            <Form
              {...form}
              loading={form.refineCore.formLoading}
              submitHandler={handleSubmit}
              showFormErrors
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="grid grid-cols-2 xs:grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    label="Name"
                    name={LocationProps.name}
                    required
                  >
                    <Input />
                  </FormField>
                  <Controller
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel className={formLabelWrapperStyle}>
                          <span className={formLabelStyle}>Address</span>
                          {formRequiredAsterisk}
                        </FieldLabel>
                        <AddressAutocomplete
                          value={field.value!}
                          onChangeAction={field.onChange}
                          country={chosenCountry as Country}
                          onSelectPlaceAction={(_placeId, details) => {
                            form.setValue(
                              LocationProps.address,
                              details.address,
                            );
                            form.setValue(
                              LocationProps.city,
                              details.city ?? '',
                            );

                            const country =
                              details.country === 'United States'
                                ? Country.USA
                                : Country.Canada;

                            form.setValue(LocationProps.country, country);

                            setStateLoading(true);

                            // Since state relies on country
                            // Wait for next tick to set state so Select options are ready
                            setTimeout(() => {
                              form.setValue(
                                LocationProps.state,
                                details.state ?? '',
                              );
                              setStateLoading(false);
                            }, 1);

                            form.setValue(
                              LocationProps.postalCode,
                              details.postalCode ?? '',
                            );

                            if (details.coordinates) {
                              form.setValue(LocationProps.coordinates, {
                                type: 'Point',
                                coordinates: [
                                  details.coordinates.lng,
                                  details.coordinates.lat,
                                ],
                              });
                            }
                          }}
                        />
                      </Field>
                    )}
                  />

                  <FormField
                    control={form.control}
                    label="City"
                    name={LocationProps.city}
                    required
                  >
                    <Input />
                  </FormField>
                  {chosenCountry && (
                    <ComboboxFormField
                      control={form.control}
                      name={LocationProps.state}
                      label="State"
                      value={chosenState}
                      options={countryStateData[chosenCountry].map(
                        (state: string) => ({
                          label: state,
                          value: state,
                        }),
                      )}
                      placeholder="Select State"
                      searchPlaceholder="Search States"
                      isLoading={stateLoading}
                      required
                    />
                  )}
                  {!chosenCountry && (
                    <Field>
                      <FieldLabel className={formLabelWrapperStyle}>
                        <span className={formLabelStyle}>State</span>
                        {formRequiredAsterisk}
                      </FieldLabel>
                      Choose a country to see state options.
                    </Field>
                  )}
                  <FormField
                    control={form.control}
                    label="Postal Code"
                    name={LocationProps.postalCode}
                    required
                  >
                    <Input />
                  </FormField>
                  <SelectFormField
                    control={form.control}
                    name={LocationProps.country}
                    label="Country"
                    options={countryOptions}
                    placeholder="Select Country"
                    required
                  />
                  {/* Latitude is not a form field, but is required to create Coordinates, so it's not in a Controller. */}
                  <Field>
                    <FieldLabel
                      htmlFor="latitude"
                      className={formLabelWrapperStyle}
                    >
                      <span className={formLabelStyle}>Latitude</span>
                      {formRequiredAsterisk}
                    </FieldLabel>
                    <Input
                      id="latitude"
                      value={latitude}
                      onChange={(e) =>
                        setLatitude(
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                      type="number"
                      placeholder="Click map or enter manually"
                    />
                  </Field>
                  {/* Longitude is not a form field, but is required to create Coordinates, so it's not in a Controller. */}
                  <Field>
                    <FieldLabel
                      htmlFor="longitude"
                      className={formLabelWrapperStyle}
                    >
                      <span className={formLabelStyle}>Longitude</span>
                      {formRequiredAsterisk}
                    </FieldLabel>
                    <Input
                      id="longitude"
                      value={longitude}
                      onChange={(e) =>
                        setLongitude(
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                      type="number"
                      placeholder="Click map or enter manually"
                    />
                  </Field>
                  <FormField
                    control={form.control}
                    label="Time Zone"
                    name={LocationProps.timeZone}
                    required
                  >
                    <Input />
                  </FormField>
                  <ComboboxFormField
                    control={form.control}
                    name={LocationProps.parkingType}
                    label="Parking Type"
                    options={parkingTypes.map(
                      (pt: LocationParkingEnumType) => ({
                        label: pt,
                        value: pt,
                      }),
                    )}
                    placeholder="Select Parking Type"
                    searchPlaceholder="Search Parking Types"
                  />
                  <MultiSelectFormField
                    control={form.control}
                    label="Facilities"
                    name={LocationProps.facilities}
                    options={facilities}
                    placeholder="Select Facilities"
                    searchPlaceholder="Search Facilities"
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
                <div>
                  <MapLocationPicker
                    point={geoPoint}
                    onLocationSelect={handleMapClick}
                  />
                </div>
              </div>

              {/* Charging Stations Selection - Only for Edit Mode */}
              {locationId && (
                <SelectedChargingStations form={form} params={params} />
              )}
            </Form>
          </CardContent>
        </Card>
      </div>
    </CanAccess>
  );
};
