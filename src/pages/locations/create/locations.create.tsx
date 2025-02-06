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
import { GeoPoint } from '@util/GeoPoint';
import { geocodeAddress, getAddressComponent } from '@util/geocoding';
import { getSerializedValues } from '@util/middleware';
import { LocationDto } from '../../../dtos/location.dto';
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
  } as any;

  const { formProps } = useForm(obj);

  const onFinish = (input: any) => {
    const newLocation: any = getSerializedValues(input, LocationDto);
    formProps.onFinish?.(newLocation);
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
    console.log('address', address);
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
            key="name"
            label="Name"
            name="name"
            required={true}
            data-testid="name"
          >
            <Input />
          </Form.Item>
          <Form.Item
            key="address"
            label="Address"
            name="address"
            required={true}
            data-testid="address"
          >
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span="12">
              <Form.Item
                key="city"
                label="City"
                name="city"
                required={true}
                data-testid="city"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span="12">
              <Form.Item
                key="postalCode"
                label="Postal Code"
                name="postalCode"
                required={true}
                data-testid="postalCode"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span="12">
              <Form.Item
                key="state"
                label="State"
                name="state"
                required={true}
                data-testid="state"
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
                key="country"
                label="Country"
                name="country"
                initialValue={Country.USA}
                required={true}
                data-testid="country"
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
                key="latitude"
                name={['coordinates', 'latitude']}
                data-testid="latitude"
              >
                <InputNumber
                  placeholder="Click map or enter manually"
                  onChange={(value: number | null) => {
                    const lat = value;
                    const lng = parseFloat(
                      formProps.form?.getFieldValue([
                        'coordinates',
                        'longitude',
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
                key="longitude"
                name={['coordinates', 'longitude']}
                data-testid="longitude"
              >
                <InputNumber
                  placeholder="Click map or enter manually"
                  onChange={(value: number | null) => {
                    const lat = parseFloat(
                      formProps.form?.getFieldValue([
                        'coordinates',
                        'latitude',
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
