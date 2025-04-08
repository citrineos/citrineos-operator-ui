import React, { useEffect, useRef, useState } from 'react';
import {
  LOCATIONS_CREATE_MUTATION,
  LOCATIONS_EDIT_MUTATION,
  LOCATIONS_GET_QUERY,
} from '../queries';
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Upload,
} from 'antd';
import { useForm } from '@refinedev/antd';
import { ResourceType } from '../../../resource-type';
import { Country, countryStateData } from '../country.state.data';
import { MapLocationPicker } from '../../../components/map/map.location.picker';
import { GeoPoint, GeoPointProps } from '@util/GeoPoint';
import {
  geocodeAddress,
  getAddressComponent,
  getFullAddress,
} from '@util/geocoding';
import { getSerializedValues } from '@util/middleware';
import { LocationDto, LocationDtoProps } from '../../../dtos/location.dto';
import { BaseKey, useNavigation, useUpdateMany } from '@refinedev/core';
import { UploadOutlined } from '@ant-design/icons';
import { ArrowLeftIcon } from '../../../components/icons/arrow.left.icon';
import { SelectedChargingStations } from './selected.charging.stations';
import {
  ChargingStationDto,
  ChargingStationDtoProps,
} from '../../../dtos/charging.station.dto';
import { useParams } from 'react-router-dom';
import { getPlainToInstanceOptions } from '@util/tables';

export const LocationsUpsert = () => {
  const params: any = useParams<{ id: string }>();
  const locationId = params.id ? params.id : undefined;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formValuesRef = useRef<Record<string, any>>({});

  const { replace, goBack } = useNavigation();
  const { mutate } = useUpdateMany();

  const { form, formProps, query } = useForm<LocationDto>({
    resource: ResourceType.LOCATIONS,
    id: locationId,
    queryOptions: {
      ...getPlainToInstanceOptions(LocationDto, true),
      enabled: !!locationId,
    },
    redirect: false,
    successNotification: false,
    onMutationSuccess: async (locationResponse) => {
      const currentStations =
        formValuesRef.current[LocationDtoProps.chargingStations] || [];
      const prevStations =
        form.getFieldValue(LocationDtoProps.chargingStations) || [];

      // Compute added and removed charging stations
      const currentIds = new Set(
        currentStations.map((cs: ChargingStationDto) => cs.id),
      );
      const prevIds = new Set(
        prevStations.map((cs: ChargingStationDto) => cs.id),
      );

      const addedIds = [...currentIds].filter(
        (id) => !prevIds.has(id),
      ) as BaseKey[];
      const removedIds = [...prevIds].filter(
        (id) => !currentIds.has(id),
      ) as BaseKey[];

      // Create update payloads
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
                  [ChargingStationDtoProps.locationId]:
                    locationResponse.data.id,
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
                values: { [ChargingStationDtoProps.locationId]: null },
              },
              {
                onSuccess: resolve,
                onError: reject,
              },
            );
          }),
        );
      }

      // Wait for all mutations to complete
      try {
        await Promise.all(updateOperations);
        message.success('Location updated successfully').then();
      } catch (_error) {
        message.error('Failed to update charging stations').then();
      } finally {
        replace('/locations');
        setIsSubmitting(false);
      }
    },
    onMutationError: () => {
      message.error('Failed to create location').then();
      setIsSubmitting(false);
    },
    meta: {
      gqlQuery: LOCATIONS_GET_QUERY,
      gqlMutation: locationId
        ? LOCATIONS_EDIT_MUTATION
        : LOCATIONS_CREATE_MUTATION,
    },
  });

  useEffect(() => {
    if (!locationId) {
      form?.setFieldsValue({
        [LocationDtoProps.country]: Country.USA,
      });
      return;
    }
  }, [locationId, query?.data?.data, form]);

  const onFinish = () => {
    formValuesRef.current = form.getFieldsValue(true);

    if (isSubmitting) return;
    setIsSubmitting(true);

    const input = { ...formValuesRef.current };
    delete input[LocationDtoProps.chargingStations];

    const newItem: any = getSerializedValues(input, LocationDto);
    formProps.onFinish?.(newItem);
  };

  const handleLocationSelect = (point: GeoPoint) => {
    form?.setFieldsValue({
      coordinates: { latitude: point.latitude, longitude: point.longitude },
    });
  };

  const handleGeocode = async () => {
    const address = getFullAddress(formProps?.form?.getFieldsValue(true));
    if (!address) {
      message.warning('Please enter an address first.');
      return;
    }

    try {
      const response = await geocodeAddress(address);
      const location = response.geometry.location;
      const addressComponents = response.address_components;
      const point = new GeoPoint(location.lat, location.lng);
      const addressObj = {
        address:
          getAddressComponent(addressComponents, 'street_number') +
          ' ' +
          getAddressComponent(addressComponents, 'route'),
        city: getAddressComponent(addressComponents, 'locality'),
        state: getAddressComponent(
          addressComponents,
          'administrative_area_level_1',
        ),
        postalCode: getAddressComponent(addressComponents, 'postal_code'),
        country: getAddressComponent(addressComponents, 'country'),
        coordinates: { latitude: point.latitude, longitude: point.longitude },
      };
      formProps?.form?.setFieldsValue(addressObj);
      message.success('Address geocoded successfully.');
    } catch (_error: any) {
      message.error('Error fetching coordinates.');
    }
  };

  return (
    <Form
      {...formProps}
      layout="vertical"
      onFinish={onFinish}
      data-testid="locations-create-form"
    >
      <Flex vertical gap={16}>
        <Flex align="center" className="relative">
          <ArrowLeftIcon
            style={{
              cursor: 'pointer',
              position: 'absolute',
              transform: 'translateX(-100%)',
            }}
            onClick={() => goBack()}
          />
          <h3>{locationId ? 'Edit Location' : 'Create Location'}</h3>
        </Flex>
        <Flex gap={16}>
          <Flex vertical flex={1}>
            <Form.Item
              key={LocationDtoProps.name}
              label="Name"
              name={LocationDtoProps.name}
              rules={[
                { required: true, message: 'Please select location name' },
              ]}
              data-testid={LocationDtoProps.name}
            >
              <Input />
            </Form.Item>
            <Form.Item
              key={LocationDtoProps.address}
              label="Address"
              name={LocationDtoProps.address}
              rules={[
                { required: true, message: 'Please enter location address' },
              ]}
              data-testid={LocationDtoProps.address}
            >
              <Input />
            </Form.Item>
            <Row gutter={16}>
              <Col span="12">
                <Form.Item
                  key={LocationDtoProps.city}
                  label="City"
                  name={LocationDtoProps.city}
                  rules={[
                    { required: true, message: 'Please enter location city' },
                  ]}
                  data-testid={LocationDtoProps.city}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span="12">
                <Form.Item
                  key={LocationDtoProps.postalCode}
                  label="Postal Code"
                  name={LocationDtoProps.postalCode}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter location postal code',
                    },
                  ]}
                  data-testid={LocationDtoProps.postalCode}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span="12">
                <Form.Item
                  key={LocationDtoProps.state}
                  label="State"
                  name={LocationDtoProps.state}
                  rules={[
                    { required: true, message: 'Please select location state' },
                  ]}
                  data-testid={LocationDtoProps.state}
                >
                  <Select placeholder="Select a state" allowClear>
                    {countryStateData[
                      form.getFieldValue(LocationDtoProps.country) ||
                        Country.USA
                    ].map((state) => (
                      <Select.Option key={state} value={state}>
                        {state}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span="12">
                <Form.Item
                  key={LocationDtoProps.country}
                  label="Country"
                  name={LocationDtoProps.country}
                  rules={[
                    {
                      required: true,
                      message: 'Please select location country',
                    },
                  ]}
                  data-testid={LocationDtoProps.country}
                >
                  <Select placeholder="Select a country" allowClear>
                    {Object.keys(Country).map((country) => (
                      <Select.Option key={country} value={country}>
                        {country}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Latitude"
                  key={GeoPointProps.latitude}
                  name={[LocationDtoProps.coordinates, GeoPointProps.latitude]}
                  data-testid={GeoPointProps.latitude}
                >
                  <InputNumber
                    placeholder="Click map or enter manually"
                    onChange={(value: number | null) => {
                      const lat = value;
                      const lng = parseFloat(
                        form?.getFieldValue([
                          LocationDtoProps.coordinates,
                          GeoPointProps.longitude,
                        ]),
                      );

                      if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
                        form.setFieldsValue({
                          [LocationDtoProps.coordinates]: {
                            latitude: lat,
                            longitude: lng,
                          },
                        });
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Longitude"
                  key={GeoPointProps.longitude}
                  name={[LocationDtoProps.coordinates, GeoPointProps.longitude]}
                  data-testid={GeoPointProps.longitude}
                >
                  <InputNumber
                    placeholder="Click map or enter manually"
                    onChange={(value: number | null) => {
                      const lat = parseFloat(
                        form?.getFieldValue([
                          LocationDtoProps.coordinates,
                          GeoPointProps.latitude,
                        ]),
                      );
                      const lng = value;
                      if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
                        form.setFieldsValue({
                          [LocationDtoProps.coordinates]: {
                            latitude: lat,
                            longitude: lng,
                          },
                        });
                      }
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ marginTop: '10px' }}>
              <Col>
                <Row style={{ marginBottom: '20px' }}>
                  <Button
                    type="default"
                    onClick={handleGeocode}
                    data-testid="geocode-button"
                  >
                    Get Coordinates
                  </Button>
                </Row>
                <Row style={{ marginBottom: '10px' }}>
                  <Upload>
                    <Button icon={<UploadOutlined />}>Upload Image</Button>
                  </Upload>
                </Row>
                <Row>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      data-testid="locations-create-form-submit"
                      loading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      Submit
                    </Button>
                  </Form.Item>
                </Row>
              </Col>
            </Row>
          </Flex>
          <Flex vertical flex={1}>
            <Row>
              <strong>Please select a location</strong>
            </Row>
            <MapLocationPicker
              point={form.getFieldValue(LocationDtoProps.coordinates)}
              defaultCenter={{ lat: 39.8283, lng: -98.5795 }}
              zoom={3}
              onLocationSelect={handleLocationSelect}
            />
          </Flex>
        </Flex>
        <SelectedChargingStations form={form} />
      </Flex>
    </Form>
  );
};
