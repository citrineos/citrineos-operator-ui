import { TableColumnsType } from 'antd';
import { ActionsColumn } from '../../components/data-model-table/actions-column';
import { CERTIFICATES_DELETE_MUTATION } from './queries';
import { ResourceType } from '../../resource-type';
import { Certificates } from '../../graphql/schema.types';
import GenericTag from '../../components/tag';
import { StatusIcon } from '../../components/status-icon';
import { TimestampDisplay } from '../../components/timestamp-display';
import React from 'react';
import { CountryNameEnumType, SignatureAlgorithmEnumType } from './Certificate';
import { TruncateDisplay } from '../../components/truncate-display';
import { CustomAction } from '../../components/custom-actions';
import { ColumnAction, DefaultColors } from '@enums';

export const CERTIFICATES_COLUMNS = (
  withActions: boolean,
  parentView?: ResourceType,
  customActions?: CustomAction<Certificates>[],
): TableColumnsType<Certificates> => {
  const baseColumns: TableColumnsType<Certificates> = [
    {
      dataIndex: 'id',
      title: 'ID',
      sorter: true,
    },
    {
      dataIndex: 'serialNumber',
      title: 'Serial Number',
    },
    {
      dataIndex: 'issuerName',
      title: 'Issuer Name',
    },
    {
      dataIndex: 'organizationName',
      title: 'Organization Name',
    },
    {
      dataIndex: 'commonName',
      title: 'Common Name',
    },
    {
      dataIndex: 'keyLength',
      title: 'Key Length',
    },
    {
      dataIndex: 'validBefore',
      title: 'Valid Before',
      render: (_: any, record: Certificates) => (
        <TimestampDisplay isoTimestamp={record.validBefore} />
      ),
    },
    {
      dataIndex: 'signatureAlgorithm',
      title: 'Signature Algorithm',
      render: ((_: any, record: Certificates) => {
        return (
          <GenericTag
            enumValue={record.signatureAlgorithm as SignatureAlgorithmEnumType}
            enumType={SignatureAlgorithmEnumType}
            colorMap={{
              RSA: DefaultColors.BLUE,
              ECDSA: DefaultColors.GREEN,
            }}
          />
        );
      }) as any,
    },
    {
      dataIndex: 'countryName',
      title: 'Country Name',
      render: ((_: any, record: Certificates) => {
        return (
          <GenericTag
            enumValue={record.countryName as CountryNameEnumType}
            enumType={CountryNameEnumType}
            colorMap={{
              US: DefaultColors.LIME,
            }}
          />
        );
      }) as any,
    },
    {
      dataIndex: 'isCA',
      title: 'Is CA',
      align: 'center',
      render: (_: any, record: Certificates) => (
        <StatusIcon value={record?.isCA} />
      ),
    },
    {
      dataIndex: 'pathLen',
      title: 'Path Len',
    },
    {
      dataIndex: 'certificateFileId',
      title: 'Certificate File Id',
      render: (_: any, record: Certificates) => (
        <TruncateDisplay
          endLength={6}
          id={record.certificateFileId as string}
        />
      ),
    },
    {
      dataIndex: 'privateKeyFileId',
      title: 'Private Key File Id',
      render: (_: any, record: Certificates) => (
        <TruncateDisplay endLength={6} id={record.privateKeyFileId as string} />
      ),
    },
    {
      dataIndex: 'signedBy',
      title: 'Signed By',
    },
  ];

  if (withActions) {
    baseColumns.push({
      dataIndex: 'actions',
      title: 'Actions',
      render: (_: any, record: any) => (
        <ActionsColumn
          record={record}
          customActions={customActions}
          gqlDeleteMutation={CERTIFICATES_DELETE_MUTATION}
          actions={[{ type: ColumnAction.SHOW }, { type: ColumnAction.DELETE }]}
        />
      ),
    });
  }

  return baseColumns;
};
