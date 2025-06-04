// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { plainToInstance } from 'class-transformer';
import { CLASS_RESOURCE_TYPE } from '@util/decorators/ClassResourceType';
import { Alert } from 'antd';
import { ExpandableColumn } from './expandable-column';
import GenericTag from '../tag';
import { ExportOutlined } from '@ant-design/icons';
import React from 'react';
import { useForm } from '@refinedev/antd';
import { GenericParameterizedView } from '../view';
import { LABEL_FIELD } from '@util/decorators/LabelField';
import { NEW_IDENTIFIER } from '@util/consts';
import {
  FieldNameAndIsEditable,
  PRIMARY_KEY_FIELD_NAME,
} from '@util/decorators/PrimaryKeyFieldName';
import { GenericViewState } from '@enums';
import { AssociatedViewProps } from '@interfaces';

export const AssociatedView = <ParentModel, AssociatedModel>(
  props: AssociatedViewProps<ParentModel, AssociatedModel>,
) => {
  const { parentRecord, associatedRecordClass, parentIdFieldName, gqlQuery } =
    props;
  const associatedRecordClassInstance = plainToInstance(
    associatedRecordClass,
    {},
  );
  const associatedRecordResourceType = Reflect.getMetadata(
    CLASS_RESOURCE_TYPE,
    associatedRecordClassInstance as object,
  );

  const associatedRecordPrimaryKeyFieldNameAndIsEditable: FieldNameAndIsEditable =
    Reflect.getMetadata(
      PRIMARY_KEY_FIELD_NAME,
      associatedRecordClassInstance as object,
    );
  const associatedRecordPrimaryKeyFieldName =
    associatedRecordPrimaryKeyFieldNameAndIsEditable.fieldName;

  const associatedRecord = (parentRecord as any)[parentIdFieldName];
  let id;
  if (associatedRecord && typeof associatedRecord === 'object') {
    id = associatedRecord[associatedRecordPrimaryKeyFieldName];
  } else {
    id = associatedRecord;
  }

  const useFormProps = useForm<any, any, any>({
    resource: associatedRecordResourceType,
    id,
    queryOptions: {
      enabled:
        !!(parentRecord as any)[parentIdFieldName] &&
        (parentRecord as any)[parentIdFieldName] !== NEW_IDENTIFIER,
    },
    meta: {
      gqlQuery,
    },
  } as any);
  const { queryResult } = useFormProps;

  let val;
  const labelField = Reflect.getMetadata(
    LABEL_FIELD,
    associatedRecordClassInstance as object,
  );
  const primaryKeyFieldNameAndIsEditable: FieldNameAndIsEditable =
    Reflect.getMetadata(
      PRIMARY_KEY_FIELD_NAME,
      associatedRecordClassInstance as object,
    );
  const primaryKeyFieldName = primaryKeyFieldNameAndIsEditable.fieldName;
  const label = labelField || primaryKeyFieldName;

  if (associatedRecord) {
    if (queryResult?.data?.data && queryResult.data.data[label]) {
      val = queryResult.data.data[label];
    } else {
      val = (parentRecord as any)[label];
    }
  }

  if (!associatedRecordResourceType) {
    return (
      <Alert
        message="Error: AssociatedView cannot find ResourceType for associatedRecordClass"
        type="error"
      />
    );
  }
  const expandedContent = id ? (
    <>
      <GenericParameterizedView
        resourceType={associatedRecordResourceType}
        id={id}
        state={GenericViewState.SHOW}
        dtoClass={associatedRecordClass}
        gqlQuery={gqlQuery}
        useFormProps={useFormProps}
      />
    </>
  ) : (
    ''
  );
  return (
    val && (
      <ExpandableColumn
        useInitialContentAsButton={!!val}
        initialContent={
          <GenericTag stringValue={val} icon={<ExportOutlined />} />
        }
        expandedContent={expandedContent}
        viewTitle={`Associated ${associatedRecordResourceType}`}
      />
    )
  );
};
