import React, { useState } from 'react';
import { Form, notification } from 'antd';
import { plainToInstance, Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { DeleteCertificateStatusEnumType } from '@citrineos/base';
import { showError, showSucces } from '../util';
import { StatusInfoType } from '../model/StatusInfoType';
import { GenericForm } from '../../components/form';
import { GqlAssociation } from '@util/decorators/GqlAssociation';
import { BaseRestClient } from '@util/BaseRestClient';
import { NEW_IDENTIFIER } from '@util/consts';
import { ChargingStation } from '../../pages/charging-stations/ChargingStation';
import {
  InstalledCertificate,
  InstalledCertificateProps,
} from '../../pages/installed-certificates/InstalledCertificate';
import {
  INSTALLED_CERTIFICATE_GET_QUERY,
  INSTALLED_CERTIFICATE_LIST_QUERY,
} from '../../pages/installed-certificates/queries';
import { CustomAction } from '../../components/custom-actions';
import { MessageConfirmation } from '../MessageConfirmation';

enum DeleteCertificateDataProps {
  installedCertificate = 'installedCertificate',
}

class DeleteCertificateData {
  @GqlAssociation({
    parentIdFieldName: DeleteCertificateDataProps.installedCertificate,
    associatedIdFieldName: InstalledCertificateProps.id,
    gqlQuery: {
      query: INSTALLED_CERTIFICATE_GET_QUERY,
    },
    gqlListQuery: {
      query: INSTALLED_CERTIFICATE_LIST_QUERY,
    },
  })
  @Type(() => InstalledCertificate)
  @IsNotEmpty()
  installedCertificate!: InstalledCertificate | null;
}

export class DeleteCertificateResponse {
  @IsEnum(DeleteCertificateStatusEnumType)
  status!: DeleteCertificateStatusEnumType;

  @Type(() => StatusInfoType)
  @ValidateNested()
  @IsOptional()
  statusInfo?: StatusInfoType;
}

export const DeleteCertificateCustomAction: CustomAction<InstalledCertificate> =
  {
    label: 'Delete Certificate',
    execOrRender: (installedCertificate: InstalledCertificate, setLoading) => {
      requestDeleteCertificate(installedCertificate, setLoading).then(() => {
        console.log(
          'Successfully triggered delete certificate',
          installedCertificate,
        );
      });
    },
  };

export const requestDeleteCertificate = async (
  installedCertificate: InstalledCertificate,
  setLoading: (loading: boolean) => void,
) => {
  try {
    setLoading(true);
    const client = new BaseRestClient();
    const response = await client.post(
      `/certificates/deleteCertificate?identifier=${installedCertificate.stationId}&tenantId=1`,
      MessageConfirmation,
      {},
      {
        certificateHashData: {
          hashAlgorithm: installedCertificate.hashAlgorithm,
          issuerNameHash: installedCertificate.issuerNameHash,
          issuerKeyHash: installedCertificate.issuerKeyHash,
          serialNumber: installedCertificate.serialNumber,
        },
      },
    );

    if (response && response.success) {
      notification.success({
        message: 'Success',
        description: 'The delete certificate request was successful.',
        placement: 'topRight',
      });
    } else {
      notification.error({
        message: 'Request Failed',
        description:
          'The delete certificate request did not receive a successful response. Response: ' +
          JSON.stringify(response),
        placement: 'topRight',
      });
    }
  } catch (error: any) {
    const msg = `Could not perform request stop transaction, got error: ${error.message}`;
    console.error(msg, error);
    notification.error({
      message: 'Error',
      description: msg,
      placement: 'topRight',
    });
  } finally {
    setLoading(false);
  }
};

export interface DeleteCertificateProps {
  station: ChargingStation;
}

export const DeleteCertificate: React.FC<DeleteCertificateProps> = ({
  station,
}) => {
  const [form] = Form.useForm();
  const formProps = {
    form,
  };

  const deleteCertificateData = new DeleteCertificateData();
  const installCertificate = new InstalledCertificate();
  installCertificate[InstalledCertificateProps.id] =
    NEW_IDENTIFIER as unknown as number;
  deleteCertificateData[DeleteCertificateDataProps.installedCertificate] =
    installCertificate as InstalledCertificate;

  const [_parentRecord, _setParentRecord] = useState<any>(
    deleteCertificateData,
  );

  const handleSubmit = async () => {
    const plainValues = await form.validateFields();
    const data: DeleteCertificateData = plainToInstance(
      DeleteCertificateData,
      plainValues,
    );
    const installedCertificate: InstalledCertificate =
      data[DeleteCertificateDataProps.installedCertificate]!;

    if (station.id != installedCertificate.stationId) {
      showError('This certificate does not belong to this station...');
    } else {
      try {
        const client = new BaseRestClient();
        await client.post(
          `/certificates/deleteCertificate?identifier=${installedCertificate.stationId}&tenantId=1`,
          DeleteCertificateResponse,
          {},
          {
            certificateHashData: {
              hashAlgorithm: installedCertificate.hashAlgorithm,
              issuerNameHash: installedCertificate.issuerNameHash,
              issuerKeyHash: installedCertificate.issuerKeyHash,
              serialNumber: installedCertificate.serialNumber,
            },
          },
        );
        showSucces();
      } catch (error: any) {
        showError(
          'The delete certificate request failed with message: ' +
            error.message,
        );
      }
    }
  };

  return (
    <>
      <h4>Delete Certificate</h4>
      <GenericForm
        formProps={formProps}
        dtoClass={DeleteCertificateData}
        onFinish={handleSubmit}
        parentRecord={deleteCertificateData}
        initialValues={deleteCertificateData}
      />
    </>
  );
};
