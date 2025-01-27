import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ClassResourceType } from '@util/decorators/ClassResourceType';
import { ResourceType } from '../../resource-type';
import { ClassGqlListQuery } from '@util/decorators/ClassGqlListQuery';
import { ClassGqlGetQuery } from '@util/decorators/ClassGqlGetQuery';
import { ClassGqlCreateMutation } from '@util/decorators/ClassGqlCreateMutation';
import { ClassGqlEditMutation } from '@util/decorators/ClassGqlEditMutation';
import { ClassGqlDeleteMutation } from '@util/decorators/ClassGqlDeleteMutation';
import { PrimaryKeyFieldName } from '@util/decorators/PrimaryKeyFieldName';
import {
  CHARGING_STATIONS_CREATE_MUTATION,
  CHARGING_STATIONS_DELETE_MUTATION,
  CHARGING_STATIONS_EDIT_MUTATION,
  CHARGING_STATIONS_GET_QUERY,
  CHARGING_STATIONS_LIST_QUERY,
} from './queries';
import { BaseModel } from '@util/BaseModel';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import { Type } from 'class-transformer';
import { Location, LocationProps } from '../locations/Location';
import {
  LOCATIONS_GET_QUERY,
  LOCATIONS_LIST_QUERY,
} from '../locations/queries';
import {
  StatusNotification,
  StatusNotificationProps,
} from '../status-notifications/StatusNotification';
import {
  STATUS_NOTIFICATIONS_LIST_FOR_STATION_QUERY,
  STATUS_NOTIFICATIONS_LIST_QUERY,
} from '../status-notifications/queries';
import { Evse } from '../evses/Evse';
import {
  GET_EVSE_LIST_FOR_STATION,
  GET_TRANSACTION_LIST_FOR_STATION,
} from '../../message/queries';
import { Transaction, TransactionProps } from '../transactions/Transaction';
import { ChargingStationProps } from './ChargingStationProps';
import { TRANSACTION_LIST_QUERY } from '../transactions/queries';
import { EVSE_LIST_QUERY } from '../evses/queries';
import { Searchable } from '@util/decorators/Searcheable';
import { ClassCustomConstructor } from '@util/decorators/ClassCustomConstructor';
import { NEW_IDENTIFIER } from '@util/consts';
import { EvseProps } from '../evses/EvseProps';
import { HiddenWhen } from '@util/decorators/HiddenWhen';
import {
  InstalledCertificate,
  InstalledCertificateProps,
} from '../installed-certificates/InstalledCertificate';
import {
  INSTALLED_CERTIFICATE_LIST_FOR_STATION_QUERY,
  INSTALLED_CERTIFICATE_LIST_QUERY,
} from '../installed-certificates/queries';
import {
  VariableAttribute,
  VariableAttributeProps,
} from '../variable-attributes/VariableAttributes';
import { FieldLabel } from '@util/decorators/FieldLabel';
import {
  VARIABLE_ATTRIBUTE_GET_QUERY,
  VARIABLE_ATTRIBUTE_LIST_FOR_STATION_QUERY,
  VARIABLE_ATTRIBUTE_LIST_QUERY,
} from '../variable-attributes/queries';

@ClassResourceType(ResourceType.CHARGING_STATIONS)
@ClassGqlListQuery(CHARGING_STATIONS_LIST_QUERY)
@ClassGqlGetQuery(CHARGING_STATIONS_GET_QUERY)
@ClassGqlCreateMutation(CHARGING_STATIONS_CREATE_MUTATION)
@ClassGqlEditMutation(CHARGING_STATIONS_EDIT_MUTATION)
@ClassGqlDeleteMutation(CHARGING_STATIONS_DELETE_MUTATION)
@PrimaryKeyFieldName(ChargingStationProps.id, true)
@ClassCustomConstructor(() => {
  const chargingStation = new ChargingStation();
  const location = new Location();
  location[LocationProps.id] = NEW_IDENTIFIER as unknown as string;
  chargingStation[ChargingStationProps.locationId] = location;
  return chargingStation;
})
export class ChargingStation extends BaseModel {
  @IsString()
  @Searchable()
  id!: string;

  @IsBoolean()
  isOnline!: boolean;

  @GqlAssociation({
    parentIdFieldName: ChargingStationProps.locationId,
    associatedIdFieldName: LocationProps.id,
    gqlQuery: {
      query: LOCATIONS_GET_QUERY,
    },
    gqlListQuery: {
      query: LOCATIONS_LIST_QUERY,
    },
  })
  @Type(() => Location)
  @IsOptional()
  locationId?: Location;

  @IsArray()
  @IsOptional()
  @GqlAssociation({
    parentIdFieldName: ChargingStationProps.id,
    associatedIdFieldName: StatusNotificationProps.stationId,
    gqlListQuery: {
      query: STATUS_NOTIFICATIONS_LIST_QUERY,
    },
    gqlListSelectedQuery: {
      query: STATUS_NOTIFICATIONS_LIST_FOR_STATION_QUERY,
      getQueryVariables: (station: ChargingStation) => ({
        stationId: station.id,
      }),
    },
  })
  @Type(() => StatusNotification)
  statusNotifications?: StatusNotification[];

  @IsArray()
  @IsOptional()
  @GqlAssociation({
    parentIdFieldName: ChargingStationProps.id,
    associatedIdFieldName: EvseProps.id,
    gqlListQuery: {
      query: EVSE_LIST_QUERY,
    },
    gqlListSelectedQuery: {
      query: GET_EVSE_LIST_FOR_STATION,
      getQueryVariables: (station: ChargingStation) => ({
        stationId: station.id,
      }),
    },
  })
  @Type(() => Evse)
  evses?: Evse[];

  @IsArray()
  @IsOptional()
  @GqlAssociation({
    parentIdFieldName: ChargingStationProps.id,
    associatedIdFieldName: TransactionProps.transactionId,
    gqlListQuery: {
      query: TRANSACTION_LIST_QUERY,
    },
    gqlListSelectedQuery: {
      query: GET_TRANSACTION_LIST_FOR_STATION,
      getQueryVariables: (station: ChargingStation) => ({
        stationId: station.id,
      }),
    },
  })
  @HiddenWhen((record) => {
    return record;
  })
  @Type(() => Transaction)
  transactions?: Transaction[];

  @IsArray()
  @IsOptional()
  @GqlAssociation({
    parentIdFieldName: ChargingStationProps.id,
    associatedIdFieldName: InstalledCertificateProps.id,
    gqlListQuery: {
      query: INSTALLED_CERTIFICATE_LIST_QUERY,
    },
    gqlListSelectedQuery: {
      query: INSTALLED_CERTIFICATE_LIST_FOR_STATION_QUERY,
      getQueryVariables: (station: ChargingStation) => ({
        stationId: station.id,
      }),
    },
  })
  @Type(() => InstalledCertificate)
  installedCertificates?: InstalledCertificate[];

  @IsArray()
  @Type(() => VariableAttribute)
  @ValidateNested({ each: true })
  @FieldLabel('Device Model')
  @GqlAssociation({
    parentIdFieldName: ChargingStationProps.id,
    associatedIdFieldName: VariableAttributeProps.stationId,
    hasNewAssociatedIdsVariable: true,
    gqlQuery: {
      query: VARIABLE_ATTRIBUTE_GET_QUERY,
    },
    gqlListQuery: {
      query: VARIABLE_ATTRIBUTE_LIST_QUERY,
    },
    gqlListSelectedQuery: {
      query: VARIABLE_ATTRIBUTE_LIST_FOR_STATION_QUERY,
      getQueryVariables: (station: ChargingStation) => ({
        [VariableAttributeProps.stationId]: station.id,
      }),
    },
  })
  VariableAttributes?: VariableAttribute[];

  constructor(data?: ChargingStation) {
    super();
    if (data) {
      Object.assign(this, {
        [ChargingStationProps.id]: data.id,
        [ChargingStationProps.isOnline]: data.isOnline,
        [ChargingStationProps.locationId]: data.locationId,
      });
    }
  }
}
