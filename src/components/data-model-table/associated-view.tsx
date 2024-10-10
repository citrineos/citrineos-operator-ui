import { plainToInstance } from 'class-transformer';
import { CLASS_RESOURCE_TYPE } from '../../util/decorators/ClassResourceType';
import { Alert } from 'antd';
import { ExpandableColumn } from './expandable-column';
import GenericTag from '../tag';
import { ExportOutlined } from '@ant-design/icons';
import React from 'react';
import { GqlAssociationProps } from '../../util/decorators/GqlAssociation';
import { Constructable } from '../../util/Constructable';
import { useForm } from '@refinedev/antd';
import { GenericParameterizedView, GenericViewState } from '../view';
import { LABEL_FIELD } from '../../util/decorators/LabelField';
import { NEW_IDENTIFIER } from '../../util/consts';

export interface AssociatedViewProps<ParentModel, AssociatedModel>
  extends GqlAssociationProps {
  parentRecord: ParentModel; // record
  associatedRecordClass: Constructable<AssociatedModel>; // record class
}
export const AssociatedView = <
  ParentModel,
  AssociatedModel,
  GetQuery extends Record<any, any>,
>(
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
    associatedRecordClassInstance as Object, //eslint-disable-line
  );

  const useFormProps = useForm<any, any, any>({
    resource: associatedRecordResourceType ?? null,
    id: (parentRecord as any)[parentIdFieldName],
    queryOptions: {
      enabled:
        !!(parentRecord as any)[parentIdFieldName] &&
        (parentRecord as any)[parentIdFieldName] !== NEW_IDENTIFIER,
    },
    meta: {
      gqlQuery,
    },
  } as any);

  if (!associatedRecordResourceType) {
    return (
      <Alert
        message="Error: AssociatedView cannot find ResourceType for associatedRecordClass"
        type="error"
      />
    );
  }

  const { queryResult } = useFormProps;

  let val;
  if (queryResult?.data?.data) {
    const label = Reflect.getMetadata(
      LABEL_FIELD,
      associatedRecordClassInstance as Object, //eslint-disable-line
    );
    if (label && queryResult.data.data[label]) {
      val = queryResult.data.data[label];
    } else {
      val = (parentRecord as any)[parentIdFieldName]; // just use associated ID
    }
  }
  return (
    <ExpandableColumn
      useInitialContentAsButton={!!val}
      forceRender={true}
      initialContent={
        <>
          <GenericTag stringValue={val} icon={<ExportOutlined />} />
        </>
      }
      expandedContent={
        <GenericParameterizedView
          resourceType={associatedRecordResourceType}
          id={(parentRecord as any)[parentIdFieldName]}
          state={GenericViewState.SHOW}
          dtoClass={associatedRecordClass}
          gqlQuery={gqlQuery}
          useFormProps={useFormProps}
        />
      }
      viewTitle={`Associated ${associatedRecordResourceType}`}
    />
  );
};
