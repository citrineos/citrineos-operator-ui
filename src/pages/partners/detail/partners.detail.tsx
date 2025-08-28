// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { useShow } from '@refinedev/core';
import { TenantPartnerDto } from '../../../dtos/tenant.partner.dto';
import { PARTNER_DETAIL_QUERY } from '../queries';
import { getPlainToInstanceOptions } from '@util/tables';
import { Card, Descriptions, Flex, Image, Tag, Typography } from 'antd';
import { ResourceType } from '@util/auth';

import { PartnerAuthorizations } from './partner.authorizations';

const { Title, Text } = Typography;

export const PartnersDetail = () => {
  const { queryResult } = useShow<TenantPartnerDto>({
    resource: ResourceType.PARTNERS,
    meta: {
      gqlQuery: PARTNER_DETAIL_QUERY,
    },
    queryOptions: getPlainToInstanceOptions(TenantPartnerDto, true),
  });

  const { data } = queryResult;
  console.log(queryResult);
  const record = data?.data;

  const businessDetails =
    record?.partnerProfileOCPI?.roles?.[0]?.businessDetails;

  return (
    <Flex vertical>
      <Card>
        <Flex align="center" gap={16}>
          {businessDetails?.logo?.url && (
            <Image
              width={100}
              src={businessDetails.logo.url}
              alt={`${businessDetails.name} logo`}
            />
          )}
          <Title level={3}>{businessDetails?.name}</Title>
        </Flex>
        <Descriptions
          title="Partner Details"
          bordered
          style={{ marginTop: 16 }}
        >
          <Descriptions.Item label="Country Code">
            {record?.countryCode}
          </Descriptions.Item>
          <Descriptions.Item label="Party ID">
            {record?.partyId}
          </Descriptions.Item>
          <Descriptions.Item label="Website">
            <a
              href={businessDetails?.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              {businessDetails?.website}
            </a>
          </Descriptions.Item>
          <Descriptions.Item label="Roles">
            {record?.partnerProfileOCPI?.roles?.map((role: any) => (
              <Tag key={role.role}>{role.role}</Tag>
            ))}
          </Descriptions.Item>
          <Descriptions.Item label="OCPI Version">
            {record?.partnerProfileOCPI?.version?.version}
          </Descriptions.Item>
          <Descriptions.Item label="Versions URL">
            <a
              href={record?.partnerProfileOCPI?.version?.versionDetailsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {record?.partnerProfileOCPI?.version?.versionDetailsUrl}
            </a>
          </Descriptions.Item>
        </Descriptions>
        <Title level={4} style={{ marginTop: 24 }}>
          Endpoints
        </Title>
        <Descriptions bordered>
          {record?.partnerProfileOCPI?.endpoints?.map((endpoint: any) => (
            <Descriptions.Item
              key={endpoint.identifier}
              label={endpoint.identifier}
            >
              <a href={endpoint.url} target="_blank" rel="noopener noreferrer">
                {endpoint.url}
              </a>
            </Descriptions.Item>
          ))}
        </Descriptions>
      </Card>
      {record?.id && <PartnerAuthorizations partnerId={record.id} />}
    </Flex>
  );
};
