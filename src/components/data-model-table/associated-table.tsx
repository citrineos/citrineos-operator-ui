// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { Alert } from 'antd';
import { GenericDataTable } from './editable';
import React from 'react';
import { Constructable } from '@util/Constructable';
import { plainToInstance } from 'class-transformer';
import { CLASS_RESOURCE_TYPE } from '@util/decorators/ClassResourceType';
import { useTable, useTableProps } from '@refinedev/antd';
import { CustomAction } from '../custom-actions';

export interface AssociatedTableProps<AssociatedModel> {
  associatedRecordClass: Constructable<AssociatedModel>; // record class
  gqlQuery: any;
  gqlQueryVariables?: any;
  customActions?: CustomAction<any>[];
}

export const AssociatedTable = <AssociatedModel,>(
  props: AssociatedTableProps<AssociatedModel>,
) => {
  const { associatedRecordClass, gqlQuery, gqlQueryVariables, customActions } =
    props;

  const associatedRecordClassInstance = plainToInstance(
    associatedRecordClass,
    {},
  );
  const associatedRecordResourceType = Reflect.getMetadata(
    CLASS_RESOURCE_TYPE,
    associatedRecordClassInstance as object,
  );

  const meta: any = {
    gqlQuery,
  };

  if (gqlQueryVariables) {
    meta.gqlVariables = gqlQueryVariables;
  }

  const tableOptions: useTableProps<any, any, unknown, any> = {
    resource: associatedRecordResourceType,
    sorters: {
      initial: [
        {
          field: 'updatedAt',
          order: 'desc',
        },
      ],
    },
    filters: [] as any,
    meta,
  };

  const {
    tableProps,
    tableQuery: _queryResult,
    searchFormProps,
    setSorters,
    setCurrent,
    setPageSize,
  } = useTable<any>({
    ...tableOptions,
  });

  if (!associatedRecordResourceType) {
    return (
      <Alert
        message="Error: AssociatedTable cannot find ResourceType for associatedRecordClass"
        type="error"
      />
    );
  }

  return (
    <GenericDataTable
      dtoClass={associatedRecordClass}
      useTableProps={{
        tableProps,
        searchFormProps,
        setSorters,
        setCurrent,
        setPageSize,
      }}
      customActions={customActions}
      editable={false}
    />
  );
};
