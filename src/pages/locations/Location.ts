import { IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { GeoPoint, IsGeoPoint } from '../../util/GeoPoint';
import { ToClass, ToPlain } from '../../util/Transformers';
import { ClassResourceType } from '../../util/decorators/ClassResourceType';
import { ResourceType } from '../../resource-type';
import { ClassGqlListQuery } from '../../util/decorators/ClassGqlListQuery';
import { ClassGqlGetQuery } from '../../util/decorators/ClassGqlGetQuery';
import { ClassGqlCreateMutation } from '../../util/decorators/ClassGqlCreateMutation';
import { ClassGqlEditMutation } from '../../util/decorators/ClassGqlEditMutation';
import { ClassGqlDeleteMutation } from '../../util/decorators/ClassGqlDeleteMutation';
import { PrimaryKeyFieldName } from '../../util/decorators/PrimaryKeyFieldName';
import {
  LOCATIONS_CREATE_MUTATION,
  LOCATIONS_DELETE_MUTATION,
  LOCATIONS_EDIT_MUTATION,
  LOCATIONS_GET_QUERY,
  LOCATIONS_LIST_QUERY,
} from './queries';

export enum LocationProps {
  id = 'id',
  name = 'name',
  address = 'address',
  city = 'city',
  postalCode = 'postalCode',
  state = 'state',
  country = 'country',
  coordinates = 'coordinates',
}

@ClassResourceType(ResourceType.LOCATIONS)
@ClassGqlListQuery(LOCATIONS_LIST_QUERY)
@ClassGqlGetQuery(LOCATIONS_GET_QUERY)
@ClassGqlCreateMutation(LOCATIONS_CREATE_MUTATION)
@ClassGqlEditMutation(LOCATIONS_EDIT_MUTATION)
@ClassGqlDeleteMutation(LOCATIONS_DELETE_MUTATION)
@PrimaryKeyFieldName(LocationProps.id)
export class Location {
  @IsString()
  id!: string;

  @IsString()
  name!: string;

  @IsString()
  address!: string;

  @IsString()
  city!: string;

  @IsString()
  postalCode!: string;

  @IsString()
  state!: string;

  @IsString()
  country!: string;

  @IsGeoPoint()
  @Type(() => GeoPoint)
  @ToPlain<GeoPoint>((value) => value.json)
  @ToClass<GeoPoint>(GeoPoint.parse)
  coordinates!: GeoPoint;

  constructor(data: Location) {
    if (data) {
      Object.assign(this, {
        [LocationProps.id]: data.id,
        [LocationProps.name]: data.name,
        [LocationProps.address]: data.address,
        [LocationProps.city]: data.city,
        [LocationProps.postalCode]: data.postalCode,
        [LocationProps.state]: data.state,
        [LocationProps.country]: data.country,
        [LocationProps.coordinates]: data.coordinates,
      });
    }
  }
}
