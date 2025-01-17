import { BaseModel } from '@util/BaseModel';
import { ClassResourceType } from '@util/decorators/ClassResourceType';
import { ResourceType } from '../../resource-type';
import { ClassGqlListQuery } from '@util/decorators/ClassGqlListQuery';
import {
  CHARGING_STATIONS_CREATE_MUTATION,
  CHARGING_STATIONS_DELETE_MUTATION,
  CHARGING_STATIONS_EDIT_MUTATION,
  GET_OCPP_LOGS,
  GET_OCPP_LOGS_LIST,
} from './queries';
import { ClassGqlGetQuery } from '@util/decorators/ClassGqlGetQuery';
import { PrimaryKeyFieldName } from '@util/decorators/PrimaryKeyFieldName';
import { ChargingStationProps } from './ChargingStationProps';
import { IsString } from 'class-validator';
import { ClassGqlCreateMutation } from '@util/decorators/ClassGqlCreateMutation';
import { ClassGqlEditMutation } from '@util/decorators/ClassGqlEditMutation';
import { ClassGqlDeleteMutation } from '@util/decorators/ClassGqlDeleteMutation';
import { CustomFormRender } from '@util/decorators/CustomFormRender';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { HiddenWhen } from '@util/decorators/HiddenWhen';

export enum OCPPLogsProps {
  id = 'id',
  stationid = 'stationid',
  log = 'log',
}

function formatJson(jsonString: string) {
  try {
    const jsonObject = JSON.parse(jsonString);
    return JSON.stringify(jsonObject, null, 2);
  } catch (error) {
    console.error('Invalid JSON string:', error);
    return 'Invalid JSON';
  }
}

@ClassResourceType(ResourceType.OCPP_LOGS)
@ClassGqlListQuery(GET_OCPP_LOGS_LIST)
@ClassGqlGetQuery(GET_OCPP_LOGS)
@ClassGqlCreateMutation(CHARGING_STATIONS_CREATE_MUTATION)
@ClassGqlEditMutation(CHARGING_STATIONS_EDIT_MUTATION)
@ClassGqlDeleteMutation(CHARGING_STATIONS_DELETE_MUTATION)
@PrimaryKeyFieldName(ChargingStationProps.id, true)
export class OCPPLogs extends BaseModel {
  @IsString()
  @HiddenWhen(() => true)
  id!: string;

  @IsString()
  stationId!: string;

  @IsString()
  origin!: string;

  @IsString()
  @CustomFormRender((ocppLogs: OCPPLogs) => {
    return (
      <div>
        <SyntaxHighlighter language="json" style={okaidia}>
          {formatJson(ocppLogs.log)}
        </SyntaxHighlighter>
      </div>
    );
  })
  log!: string;
}
