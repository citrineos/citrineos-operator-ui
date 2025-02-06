import React, { useState } from 'react';
import { LOCATIONS_CREATE_MUTATION, LOCATIONS_GET_QUERY } from '../queries';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Upload,
} from 'antd';
import { useForm, UseFormProps } from '@refinedev/antd';
import { ResourceType } from '../../../resource-type';
import { Country, countryStateData } from '../country.state.data';
import { MapLocationPicker } from '../../../components/map/map.location.picker';
import { GeoPoint, GeoPointProps } from '@util/GeoPoint';
import { geocodeAddress, getAddressComponent } from '@util/geocoding';
import { getSerializedValues } from '@util/middleware';
import { LocationDto, LocationDtoProps } from '../../../dtos/location.dto';
import { useNavigation } from '@refinedev/core';
import { UploadOutlined } from '@ant-design/icons';

export const LocationsCreate = () => {
  const [states, setStates] = useState<string[]>(countryStateData[Country.USA]);
  const [selectedPoint, setSelectedPoint] = useState<GeoPoint | undefined>(
    undefined,
  );

  const { replace } = useNavigation();

  const obj: UseFormProps = {
    resource: ResourceType.LOCATIONS,
    queryOptions: {
      enabled: false,
    },
    redirect: false,
    onMutationSuccess: () => {
      replace('/locations');
    },
    meta: {
      gqlQuery: LOCATIONS_GET_QUERY,
      gqlMutation: LOCATIONS_CREATE_MUTATION,
    },
  };

  const { formProps } = useForm(obj);

  const onFinish = (input: any) => {
    const newItem: any = getSerializedValues(input, LocationDto);
    formProps.onFinish?.(newItem);
  };

  const handleCountryChange = (value: Country) => {
    setStates(countryStateData[value] || []);
  };

  const handleLocationSelect = (point: GeoPoint) => {
    setSelectedPoint(point);
    formProps.form?.setFieldsValue({
      coordinates: { latitude: point.latitude, longitude: point.longitude },
    });
  };

  const getFullAddress = () => {
    const values = formProps?.form?.getFieldsValue([
      'address',
      'city',
      'state',
      'postalCode',
      'country',
    ]);
    return `${values.address || ''}, ${values.city || ''}, ${
      values.state || ''
    } ${values.postalCode || ''}, ${values.country || ''}`.trim();
  };

  const handleGeocode = async () => {
    const address = getFullAddress();
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
      setSelectedPoint(point);
      message.success('Address geocoded successfully.');
    } catch (error: any) {
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
      <Row gutter={16}>
        <Col span="12">
          <Form.Item
            key={LocationDtoProps.name}
            label="Name"
            name={LocationDtoProps.name}
            rules={[
              { required: true, message: 'Please seelect location name' },
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
                  {states.map((state) => (
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
                initialValue={Country.USA}
                rules={[
                  { required: true, message: 'Please select location country' },
                ]}
                data-testid={LocationDtoProps.country}
              >
                <Select
                  placeholder="Select a country"
                  onChange={handleCountryChange}
                  allowClear
                >
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
                      formProps.form?.getFieldValue([
                        LocationDtoProps.coordinates,
                        GeoPointProps.longitude,
                      ]),
                    );

                    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
                      setSelectedPoint(new GeoPoint(lat, lng));
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
                      formProps.form?.getFieldValue([
                        LocationDtoProps.coordinates,
                        GeoPointProps.latitude,
                      ]),
                    );
                    const lng = value;
                    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
                      setSelectedPoint(new GeoPoint(lat, lng));
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
                  >
                    Submit
                  </Button>
                </Form.Item>
              </Row>
            </Col>
          </Row>
        </Col>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <Row>
            <strong>Please select a location</strong>
          </Row>
          <MapLocationPicker
            point={selectedPoint}
            defaultCenter={{ lat: 39.8283, lng: -98.5795 }}
            zoom={3}
            onLocationSelect={handleLocationSelect}
          />
        </div>
      </Row>
    </Form>
  );
};
