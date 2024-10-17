import { Alert } from 'antd';
import { GenericDataTable } from './editable';
import React from 'react';
import { Constructable } from '../../util/Constructable';
import { plainToInstance } from 'class-transformer';
import { CLASS_RESOURCE_TYPE } from '../../util/decorators/ClassResourceType';
import { GqlAssociationProps } from '../../util/decorators/GqlAssociation';

export interface AssociatedTableProps<ParentModel, AssociatedModel>
  extends GqlAssociationProps {
  parentRecord: ParentModel; // record
  associatedRecordClass: Constructable<AssociatedModel>; // record class
}

export const AssociatedTable = <ParentModel, AssociatedModel>(
  props: AssociatedTableProps<ParentModel, AssociatedModel>,
) => {
  const {
    parentRecord,
    associatedRecordClass,
    parentIdFieldName,
    associatedIdFieldName,
  } = props;

  const associatedRecordClassInstance = plainToInstance(
    associatedRecordClass,
    {},
  );
  const associatedRecordResourceType = Reflect.getMetadata(
    CLASS_RESOURCE_TYPE,
    associatedRecordClassInstance as object,
  );
  if (!associatedRecordResourceType) {
    return (
      <Alert
        message="Error: AssociatedTable cannot find ResourceType for associatedRecordClass"
        type="error"
      />
    );
  }
  const filters = {
    permanent: [
      {
        field: associatedIdFieldName,
        operator: 'eq',
        value: (parentRecord as any)[parentIdFieldName],
      },
    ],
  };

  return (
    <GenericDataTable dtoClass={associatedRecordClass} filters={filters} />
  );
};
