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
import { getSerializedValues } from '@lib/utils/middleware';
import { CanAccess, useTranslate, useUpdateMany } from '@refinedev/core';
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
import {
  getCountryList,
  getCountryConfig,
  type CountryCode,
  type AdministrativeArea,
  getAdministrativeAreas,
} from '@lib/utils/country.config';
import { OpeningHoursForm } from '@lib/client/components/opening-hours';
import { isValid, parseISO } from 'date-fns';

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
  [LocationProps.coordinates]: true,
  [LocationProps.parkingType]: true,
  [LocationProps.facilities]: true,
  [LocationProps.chargingPool]: true,
  [LocationProps.openingHours]: true,
}).extend({
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
  [LocationProps.country]: getCountryList()[0]?.code || '', // Default to first country
  [LocationProps.coordinates]: {
    type: 'Point' as const,
    coordinates: [defaultLongitude, defaultLatitude],
  },
  [LocationProps.timeZone]: 'UTC',
  [LocationProps.parkingType]: undefined,
  [LocationProps.facilities]: [] as LocationFacilityEnumType[],
  [LocationProps.chargingPool]: undefined,
  [LocationProps.openingHours]: undefined,
};

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
  const translate = useTranslate();

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [administrativeAreas, setAdministrativeAreas] = useState<
    AdministrativeArea[]
  >([]);
  const [loadingAdminAreas, setLoadingAdminAreas] = useState(false);

  const { open } = useNotification();

  const originalStationIdsRef = useRef<string[] | undefined>(undefined);
  const [geoPoint, setGeoPoint] = useState<GeoPoint | undefined>(
    new GeoPoint(defaultLatitude, defaultLongitude),
  );

  const countryList = getCountryList();

  const form = useForm({
    refineCoreProps: {
      resource: ResourceType.LOCATIONS,
      redirect: false,
      mutationMode: 'pessimistic',
      action: locationId ? 'edit' : 'create',
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

  const chosenCountryCode = form.watch(LocationProps.country) as CountryCode;
  const chosenState = form.watch(LocationProps.state);
  const coordinates = form.watch(LocationProps.coordinates);
  const currentChargingPool = form.watch(LocationProps.chargingPool);

  const countryConfig = getCountryConfig(chosenCountryCode);

  // Find the country name for display purposes
  const chosenCountry = countryList.find(
    (country) => country.code === chosenCountryCode,
  );
  const chosenCountryName = chosenCountry?.name || '';

  // Load administrative areas when country changes
  useEffect(() => {
    if (chosenCountryCode && countryConfig.usesAdministrativeAreas) {
      setLoadingAdminAreas(true);
      getAdministrativeAreas(chosenCountryCode)
        .then((areas) => {
          setAdministrativeAreas(areas);
        })
        .catch((err) => {
          console.error('Failed to load administrative areas:', err);
          setAdministrativeAreas([]);
        })
        .finally(() => {
          setLoadingAdminAreas(false);
        });
    } else {
      setAdministrativeAreas([]);
      // Clear state field if country doesn't use administrative areas
      if (!countryConfig.usesAdministrativeAreas) {
        form.setValue(LocationProps.state, '');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenCountryCode, countryConfig.usesAdministrativeAreas]);

  useEffect(() => {
    if (!originalStationIdsRef.current && currentChargingPool !== undefined) {
      originalStationIdsRef.current = currentChargingPool
        ? currentChargingPool.map((charger) => charger.id)
        : [];
    }
  }, [currentChargingPool]);

  useEffect(() => {
    if (coordinates && coordinates.coordinates) {
      setGeoPoint(
        new GeoPoint(coordinates.coordinates[1], coordinates.coordinates[0]),
      );
    } else {
      setGeoPoint(new GeoPoint(defaultLatitude, defaultLongitude));
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

    // Clean up openingHours before serialization
    if (newItem.openingHours) {
      const {
        exceptionalOpenings,
        exceptionalClosings,
        regularHours,
        ...rest
      } = newItem.openingHours;

      const cleanedOpeningHours: Record<string, unknown> = { ...rest };

      // Filter valid date periods
      const filterValidPeriods = (periods: unknown[]) =>
        (periods || []).filter((p: unknown) => {
          if (!p || typeof p !== 'object') return false;
          const period = p as { periodBegin?: unknown; periodEnd?: unknown };
          const begin =
            period.periodBegin instanceof Date
              ? period.periodBegin
              : typeof period.periodBegin === 'string'
                ? parseISO(period.periodBegin)
                : null;
          const end =
            period.periodEnd instanceof Date
              ? period.periodEnd
              : typeof period.periodEnd === 'string'
                ? parseISO(period.periodEnd)
                : null;
          return begin && isValid(begin) && end && isValid(end);
        });

      const validOpenings = filterValidPeriods(exceptionalOpenings);
      if (validOpenings.length > 0) {
        cleanedOpeningHours.exceptionalOpenings = validOpenings;
      }

      const validClosings = filterValidPeriods(exceptionalClosings);
      if (validClosings.length > 0) {
        cleanedOpeningHours.exceptionalClosings = validClosings;
      }

      if (regularHours && regularHours.length > 0) {
        cleanedOpeningHours.regularHours = regularHours;
      }

      // If after cleaning, the object only contains `twentyfourSeven`, and it's false,
      // we can consider the whole object empty.
      if (
        Object.keys(cleanedOpeningHours).length === 1 &&
        'twentyfourSeven' in cleanedOpeningHours &&
        !cleanedOpeningHours.twentyfourSeven
      ) {
        newItem.openingHours = null;
      } else {
        newItem.openingHours = cleanedOpeningHours;
      }
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
                message: translate('imageUploadFailed'),
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
    form.setValue(LocationProps.coordinates, {
      type: 'Point',
      coordinates: [point.longitude, point.latitude],
    });
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
                {translate(`actions.${locationId ? 'edit' : 'create'}`)}{' '}
                {translate('Locations.location')}
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

                  <ComboboxFormField
                    control={form.control}
                    name={LocationProps.country}
                    label="Country"
                    value={chosenCountryName}
                    options={countryList.map((country) => ({
                      label: country.name,
                      value: country.name,
                    }))}
                    placeholder="Select Country"
                    searchPlaceholder="Search Countries"
                    required
                    onSelect={(countryName: string) => {
                      const selectedCountry = countryList.find(
                        (country) => country.name === countryName,
                      );
                      if (selectedCountry) {
                        form.setValue(
                          LocationProps.country,
                          selectedCountry.code,
                        );
                      }
                    }}
                  />

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
                          countryCode={chosenCountryCode}
                          onSelectPlaceAction={(_placeId, details) => {
                            form.setValue(
                              LocationProps.address,
                              details.address,
                            );
                            form.setValue(
                              LocationProps.city,
                              details.city ?? '',
                            );

                            // Set country from autocomplete
                            if (details.countryCode) {
                              form.setValue(
                                LocationProps.country,
                                details.countryCode,
                              );
                            }

                            // Set state from autocomplete
                            if (details.state) {
                              // Wait for administrative areas to load
                              setTimeout(() => {
                                form.setValue(
                                  LocationProps.state,
                                  details.state ?? '',
                                );
                              }, 100);
                            }

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

                  {countryConfig.usesAdministrativeAreas && (
                    <ComboboxFormField
                      control={form.control}
                      name={LocationProps.state}
                      label={countryConfig.administrativeAreaLabel}
                      value={chosenState}
                      options={
                        administrativeAreas?.map((area) => ({
                          label: area.name,
                          value: area.name,
                        })) ?? []
                      }
                      placeholder={`Select ${countryConfig.administrativeAreaLabel}`}
                      searchPlaceholder={`Search ${countryConfig.administrativeAreaLabel}s`}
                      isLoading={loadingAdminAreas}
                      required={countryConfig.usesAdministrativeAreas}
                    />
                  )}

                  {countryConfig.postalCodeRequired && (
                    <FormField
                      control={form.control}
                      label={countryConfig.postalCodeLabel}
                      name={LocationProps.postalCode}
                      required={countryConfig.postalCodeRequired}
                    >
                      <Input />
                    </FormField>
                  )}

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
                      value={coordinates?.coordinates[1] || ''}
                      onChange={(e) => {
                        const lat = parseFloat(e.target.value);
                        const lng = coordinates?.coordinates[0] ?? 0;

                        if (!isNaN(lat) && !isNaN(lng))
                          form.setValue(LocationProps.coordinates, {
                            type: 'Point',
                            coordinates: [lng, lat],
                          });
                      }}
                      type="number"
                      placeholder="Click map or enter manually"
                    />
                  </Field>
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
                      value={coordinates?.coordinates[0] || ''}
                      onChange={(e) => {
                        const lat = coordinates?.coordinates[1] ?? 0;
                        const lng = parseFloat(e.target.value);

                        if (!isNaN(lat) && !isNaN(lng))
                          form.setValue(LocationProps.coordinates, {
                            type: 'Point',
                            coordinates: [lng, lat],
                          });
                      }}
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

              {/* Opening Hours */}
              <div className="mt-6">
                <Controller
                  control={form.control}
                  name={LocationProps.openingHours}
                  render={({ field }) => (
                    <OpeningHoursForm
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                    />
                  )}
                />
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
