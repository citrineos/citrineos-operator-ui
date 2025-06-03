// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Form, Spin } from 'antd';
import { MessageConfirmation } from '../../MessageConfirmation';
import { ChargingStation } from '../../../pages/charging-stations/ChargingStation';
import { triggerMessageAndHandleResponse } from '../../util';
import { GenericForm } from '../../../components/form';
import { OCPPVersion } from '@citrineos/base';
import { useApiUrl, useCustom } from '@refinedev/core';
import { CHARGING_STATION_SEQUENCES_GET_QUERY } from '../../../pages/charging-station-sequences/queries';
import { GetBaseReportRequest, GetBaseReportRequestProps } from './model';
import { ReportBaseEnumType } from '@OCPP2_0_1';

export interface GetBaseReportProps {
  station: ChargingStation;
}

export const GetBaseReport: React.FC<GetBaseReportProps> = ({ station }) => {
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
          type: 'getBaseReport',
        },
      },
    });

  const handleSubmit = async (request: GetBaseReportRequest) => {
    await triggerMessageAndHandleResponse<MessageConfirmation[]>({
      url: `/reporting/getBaseReport?identifier=${station.id}&tenantId=1`,
      data: request,
      ocppVersion: OCPPVersion.OCPP2_0_1,
    });
  };

  if (isLoadingRequestId) return <Spin />;

  const getBaseReportRequest = new GetBaseReportRequest();
  getBaseReportRequest[GetBaseReportRequestProps.requestId] =
    requestIdResponse?.data?.ChargingStationSequences[0]?.value ?? 0;
  getBaseReportRequest[GetBaseReportRequestProps.reportBase] =
    ReportBaseEnumType.FullInventory;

  return (
    <GenericForm
      formProps={formProps}
      dtoClass={GetBaseReportRequest}
      onFinish={handleSubmit}
      initialValues={getBaseReportRequest}
      parentRecord={getBaseReportRequest}
    />
  );
};
