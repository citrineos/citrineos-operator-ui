import React from 'react';
import { Form, Spin } from 'antd';
import { MessageConfirmation } from '../../MessageConfirmation';
import { ChargingStation } from '../../../pages/charging-stations/ChargingStation';
import { triggerMessageAndHandleResponse } from '../../util';
import { GenericForm } from '../../../components/form';
import { OCPPVersion } from '@citrineos/base';
import { useApiUrl, useCustom } from '@refinedev/core';
import { GetLogRequest, GetLogRequestProps } from './model';
import { LogEnumType } from '@OCPP2_0_1';
import { CHARGING_STATION_SEQUENCES_GET_QUERY } from '../../../pages/charging-station-sequences/queries';

const FILE_SERVER_URL = import.meta.env.VITE_FILE_SERVER_URL;

export interface GetLogProps {
  station: ChargingStation;
}

export const GetLog: React.FC<GetLogProps> = ({ station }) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const apiUrl = useApiUrl();
  const { data: requestIdResponse, isLoading: isLoadingRequestId } =
    useCustom<any>({
      url: `${apiUrl}`,
      method: 'post',
      config: {
        headers: {
          'Content-Type': 'application/json',
        },
      },
      meta: {
        operation: 'ChargingStationSequencesGet',
        gqlQuery: CHARGING_STATION_SEQUENCES_GET_QUERY,
        variables: {
          stationId: station.id,
          type: 'getLog',
        },
      },
    });

  const handleSubmit = async (request: GetLogRequest) => {
    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/reporting/getLog?identifier=${station.id}&tenantId=1`,
      data: request,
      ocppVersion: OCPPVersion.OCPP2_0_1,
    });
  };

  if (isLoadingRequestId) return <Spin />;

  const getLogRequest = new GetLogRequest();
  getLogRequest[GetLogRequestProps.requestId] =
    requestIdResponse?.data?.ChargingStationSequences[0]?.value ?? 0;
  getLogRequest[GetLogRequestProps.log] = {
    remoteLocation: `${FILE_SERVER_URL}/files`,
  } as any; // Type assertion if necessary
  getLogRequest[GetLogRequestProps.logType] = LogEnumType.DiagnosticsLog;

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={GetLogRequest}
      onFinish={handleSubmit}
      initialValues={getLogRequest}
      parentRecord={getLogRequest}
    />
  );
};
