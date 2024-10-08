import React, { useState } from 'react';
import { Button, Card, Divider, notification, Spin, Typography } from 'antd';
import { BaseRestClient } from '../../util/BaseRestClient';
import { GetCertificateStatusEnumType } from '@citrineos/base';
import { Certificate } from '../../pages/certificates/Certificate';

const { Title, Text } = Typography;

export class GetCertificateStatusResponse {
  status: GetCertificateStatusEnumType;
  statusInfo?: StatusInfoType | null;
  ocspResult?: string | null;
}

export class StatusInfoType {
  reasonCode: string;
  additionalInfo?: string | null;
}

interface GetCertificateStatusProps {
  certificate: Certificate;
}

export const GetCertificateStatus: React.FC<GetCertificateStatusProps> = ({
  certificate,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [certificateStatus, setCertificateStatus] = useState<
    GetCertificateStatusResponse | undefined
  >(undefined);

  const getCertificateStatus = async () => {
    try {
      setLoading(true);
      const client = new BaseRestClient();
      const response = await client.get(
        `/data/certificates/certificateStatus?certificateId=${certificate.id}`,
        GetCertificateStatusResponse,
        {},
      );

      if (response) {
        notification.success({
          message: 'Success',
          description: `The response: ${JSON.stringify(response)}.`,
        });
        setCertificateStatus(response);
      } else {
        notification.error({
          message: 'Request Failed',
          description: `The request did not receive a successful response: ${JSON.stringify(response)}.`,
        });
      }
    } catch (error: any) {
      const msg = `Could not get Certificate status, got error: ${error.message}`;
      notification.error({
        message: 'Error',
        description: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin />;

  return (
    <Card title="Certificate Status">
      {certificateStatus ? (
        <>
          <Title level={5}>Status</Title>
          <Text>{certificateStatus.status}</Text>

          {certificateStatus.statusInfo && (
            <>
              <Divider />
              <Title level={5}>Status Info</Title>
              <Text strong>Reason Code: </Text>
              <Text>{certificateStatus.statusInfo.reasonCode}</Text>
              <br />
              {certificateStatus.statusInfo.additionalInfo && (
                <>
                  <Text strong>Additional Info: </Text>
                  <Text>{certificateStatus.statusInfo.additionalInfo}</Text>
                  <br />
                </>
              )}
            </>
          )}

          {certificateStatus.ocspResult && (
            <>
              <Divider />
              <Title level={5}>OCSP Result</Title>
              <Text>{certificateStatus.ocspResult}</Text>
            </>
          )}
        </>
      ) : (
        <div>
          <Text strong type="danger">
            Could not get certificate status.
          </Text>
          <br />
          <br />
          <Button
            type="primary"
            onClick={getCertificateStatus}
            loading={loading}
          >
            Get Certificate status
          </Button>
        </div>
      )}
    </Card>
  );
};
