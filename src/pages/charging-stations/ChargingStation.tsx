import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { ClassResourceType } from '../../util/decorators/ClassResourceType';
import { ResourceType } from '../../resource-type';
import { ClassGqlListQuery } from '../../util/decorators/ClassGqlListQuery';
import { ClassGqlGetQuery } from '../../util/decorators/ClassGqlGetQuery';
import { ClassGqlCreateMutation } from '../../util/decorators/ClassGqlCreateMutation';
import { ClassGqlEditMutation } from '../../util/decorators/ClassGqlEditMutation';
import { ClassGqlDeleteMutation } from '../../util/decorators/ClassGqlDeleteMutation';
import { PrimaryKeyFieldName } from '../../util/decorators/PrimaryKeyFieldName';
import {
  CHARGING_STATIONS_CREATE_MUTATION,
  CHARGING_STATIONS_DELETE_MUTATION,
  CHARGING_STATIONS_EDIT_MUTATION,
  CHARGING_STATIONS_GET_QUERY,
  CHARGING_STATIONS_LIST_QUERY,
} from './queries';
import { BaseModel } from '../../util/BaseModel';
import { GqlAssociation } from '../../util/decorators/GqlAssociation';
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
  STATUS_NOTIFICATIONS_GET_QUERY,
  STATUS_NOTIFICATIONS_LIST_QUERY,
} from '../status-notifications/queries';
import { Evse } from '../evses/Evse';
import {
  GET_TRANSACTION_LIST_FOR_STATION,
  GET_TRANSACTIONS_FOR_STATION,
} from '../../message/queries';
import { Transaction, TransactionProps } from '../transactions/Transaction';
import { ChargingStationProps } from './ChargingStationProps';

@ClassResourceType(ResourceType.CHARGING_STATIONS)
@ClassGqlListQuery(CHARGING_STATIONS_LIST_QUERY)
@ClassGqlGetQuery(CHARGING_STATIONS_GET_QUERY)
@ClassGqlCreateMutation(CHARGING_STATIONS_CREATE_MUTATION)
@ClassGqlEditMutation(CHARGING_STATIONS_EDIT_MUTATION)
@ClassGqlDeleteMutation(CHARGING_STATIONS_DELETE_MUTATION)
@PrimaryKeyFieldName(ChargingStationProps.id)
export class ChargingStation extends BaseModel {
  @IsString()
  id!: string;

  @IsBoolean()
  isOnline!: boolean;

  @GqlAssociation({
    parentIdFieldName: ChargingStationProps.locationId,
    associatedIdFieldName: LocationProps.id,
    gqlQuery: LOCATIONS_GET_QUERY,
    gqlListQuery: LOCATIONS_LIST_QUERY,
  })
  @Type(() => Location)
  @IsOptional()
  locationId?: Location;

  @IsArray()
  @IsOptional()
  @GqlAssociation({
    parentIdFieldName: ChargingStationProps.id,
    associatedIdFieldName: StatusNotificationProps.stationId,
    gqlQuery: STATUS_NOTIFICATIONS_GET_QUERY,
    gqlListQuery: STATUS_NOTIFICATIONS_LIST_QUERY,
  })
  @Type(() => StatusNotification)
  statusNotifications?: StatusNotification[];

  // @FieldCustomActions([TriggerMessageForEvseCustomAction])
  @IsArray()
  @IsOptional()
  /*  @GqlAssociation({
    parentIdFieldName: ChargingStationProps.id,
    associatedIdFieldName: EvseProps.id,
    gqlQuery: GET_EVSES_FOR_STATION,
    gqlListQuery: GET_EVSE_LIST_FOR_STATION,
    gqlUseQueryVariablesKey: ChargingStationProps.evses,
  })*/
  @Type(() => Evse)
  evses?: Evse[];

  @IsArray()
  @IsOptional()
  @GqlAssociation({
    parentIdFieldName: ChargingStationProps.id,
    associatedIdFieldName: TransactionProps.transactionId,
    gqlQuery: GET_TRANSACTIONS_FOR_STATION,
    gqlListQuery: GET_TRANSACTION_LIST_FOR_STATION,
    gqlUseQueryVariablesKey: ChargingStationProps.transactions,
  })
  @Type(() => Transaction)
  transactions?: Transaction[];

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
