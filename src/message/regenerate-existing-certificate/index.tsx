import React from 'react';
import { Form } from 'antd';
import { plainToInstance, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { triggerMessageAndHandleResponse } from '../util';
import { GenericForm } from '../../components/form';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import { MessageConfirmation } from '../MessageConfirmation';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import {
  InstalledCertificate,
  InstalledCertificateProps,
} from '../../pages/installed-certificates/InstalledCertificate';
import { INSTALLED_CERTIFICATE_LIST_FOR_STATION_QUERY } from '../../pages/installed-certificates/queries';
import { getSelectedChargingStation } from '../../redux/selectedChargingStationSlice';
import { NEW_IDENTIFIER } from '@util/consts';

enum RegenerateCertificateDataProps {
  certificate = 'certificate',
}

class RegenerateCertificateData {
  @GqlAssociation({
    parentIdFieldName: RegenerateCertificateDataProps.certificate,
    associatedIdFieldName: InstalledCertificateProps.id,
    gqlListQuery: {
      query: INSTALLED_CERTIFICATE_LIST_FOR_STATION_QUERY,
      getQueryVariables: (record: RegenerateCertificateData, selector: any) => {
        const station = selector(getSelectedChargingStation()) || {};
        return {
          stationId: station.id,
        };
      },
    },
  })
  @Type(() => InstalledCertificate)
  @IsNotEmpty()
  certificate!: InstalledCertificate | null;
}

export interface RegenerateCertificateProps {
  station: ChargingStation;
}

export const RegenerateExistingCertificate: React.FC<
  RegenerateCertificateProps
> = ({ station }) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const regenerateCertificateData = new RegenerateCertificateData();
  const installedCertificate = new InstalledCertificate();
  installedCertificate[InstalledCertificateProps.id] =
    NEW_IDENTIFIER as unknown as number;
  regenerateCertificateData[RegenerateCertificateDataProps.certificate] =
    installedCertificate;

  const handleSubmit = async () => {
    const plainValues = await form.validateFields();
    const data: RegenerateCertificateData = plainToInstance(
      RegenerateCertificateData,
      plainValues,
    );
    await triggerMessageAndHandleResponse({
      url: `/certificates/regenerateExistingCertificate?identifier=${station.id}&tenantId=1`,
      isDataUrl: true,
      responseClass: MessageConfirmation,
      responseSuccessCheck: (response: MessageConfirmation) => !!response,
      data: {
        installedCertificateId: data.certificate?.id,
      },
    });
  };

  return (
    <>
      <GenericForm
        formProps={formProps}
        dtoClass={RegenerateCertificateData}
        onFinish={handleSubmit}
        parentRecord={regenerateCertificateData}
        initialValues={regenerateCertificateData}
      />
    </>
  );
};
