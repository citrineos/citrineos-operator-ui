// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import {
  FormInstance,
  FormListFieldData,
  TableColumnsType,
  TableProps,
} from 'antd';
import { UseFormReturnType } from '@refinedev/antd';
import { CustomAction } from '../components/custom-actions';
import { ResourceType } from '@util/auth';
import {
  ColumnAction,
  DefaultColors,
  FieldType,
  GenericViewState,
  SelectionType,
  SelectMode,
} from './enums';
import { isDefined } from 'class-validator';
import { Constructable } from '@util/Constructable';
import { GqlAssociationProps } from '@util/decorators/GqlAssociation';
import { FieldPath } from '../components/form/state/fieldpath';
import { Flags } from '../components/form/state/flags';
import { Unknowns } from '../components/form/state/unknowns';
import { AnyObject } from 'antd/es/_util/type';
import { BaseRecord } from '@refinedev/core';
import { MouseEventHandler } from 'react';
import { DocumentNode } from 'graphql';

export interface FieldSelectOption {
  label: string;
  value: string;
}

export interface IDDisplayProps {
  id: string;
  startLength?: number; // Number of characters to show from the start
  endLength?: number; // Number of characters to show from the end
  color?: DefaultColors; // Color of the Tag
}

export interface AssociationSelectionProps<ParentModel, AssociatedModel>
  extends GqlAssociationProps {
  fieldPath: FieldPath;
  parentRecord: ParentModel;
  associatedRecordClass: Constructable<AssociatedModel>;
  value?: AssociatedModel;
  onChange?: (value: AssociatedModel[]) => void;
  selectable?: SelectionType | null;
  gqlQueryVariables?: any;
  customActions?: CustomAction<any>[];
  form: any;
}

export interface FieldSchema {
  parentInstance: any;
  label: string;
  name: string;
  type: FieldType;
  options?: FieldSelectOption[];
  selectMode?: SelectMode;
  nestedFields?: FieldSchema[];
  isRequired?: boolean;
  customRender?: (record?: any) => any;
  dtoClass?: Constructable<any>;
  customConstructor?: () => any;
  gqlAssociationProps?: GqlAssociationProps;
  customActions?: CustomAction<any>[];
  sorter: boolean;
  supportedFileFormats?: string[];
}

export interface DynamicFieldSchema extends FieldSchema {
  position: number;
}

export function isDynamicFieldSchema(value: any): value is DynamicFieldSchema {
  return (
    isDefined(value.label) &&
    isDefined(value.name) &&
    isDefined(value.type) &&
    isDefined(value.position)
  );
}

export type FieldSchemaKeys = keyof FieldSchema;

export interface GenericProps {
  dtoClass: Constructable<any>;
  parentRecord?: any;
  formProps?: any;
  overrides?: { [key in FieldSchemaKeys]: Partial<FieldSchema> };
  onFinish?: (values: any) => void;
  onValuesChange?: (changedValues: any, allValues: any) => void;
  disabled?: boolean;
  submitDisabled?: boolean;
}

export interface DynamicFieldSchema extends FieldSchema {
  position: number;
}

export interface GenericFormProps extends GenericProps {
  ref?: React.Ref<FormInstance>;
  initialValues?: any;
  fieldAnnotations?: FieldAnnotations;
}

export interface GenericViewProps extends GenericProps {
  gqlQuery: any;
  resourceType?: ResourceType;
  editMutation?: any;
  createMutation?: any;
  deleteMutation?: any;
  customActions?: CustomAction<any>[];
}

export interface GenericParameterizedViewProps extends GenericViewProps {
  state: GenericViewState;
  id?: string | number | null;
  resourceType?: ResourceType;
  hideListButton?: boolean;
  useFormProps?: UseFormReturnType<any>;
}

export interface RenderViewContentProps {
  field: FieldSchema;
  preFieldPath?: FieldPath;
  value: any;
  record: any;
  hideLabels?: boolean;
  disabled: boolean;
  parentRecord: any;
  form: any;
  setHasChanges?: any;
  visibleOptionalFields?: Flags;
  enableOptionalField?: (path: FieldPath) => void;
  toggleOptionalField?: (path: FieldPath) => void;
  unknowns?: Unknowns;
  modifyUnknowns?: any;
  useSelector: any;
  fieldAnnotations?: FieldAnnotations;
}

export interface ArrayItemProps {
  fieldPath: FieldPath;
  field: FormListFieldData;
  fieldIdx: number;
  schema: FieldSchema;
  hideLabels: boolean;
  disabled: boolean;
  visibleOptionalFields: any;
  enableOptionalField: any;
  toggleOptionalField: any;
  unknowns: any;
  modifyUnknowns: any;
  form: any;
  parentRecord: any;
  remove: any;
  fieldAnnotations?: FieldAnnotations;
}

export interface ArrayFieldProps {
  fieldPath: FieldPath;
  schema: FieldSchema;
  hideLabels?: boolean;
  disabled: boolean;
  visibleOptionalFields?: Flags;
  enableOptionalField?: (path: FieldPath) => void;
  toggleOptionalField?: (path: FieldPath) => void;
  unknowns?: Unknowns;
  setHasChanges?: any;
  modifyUnknowns?: any;
  form: any;
  parentRecord: any;
  useSelector: any;
  fieldAnnotations?: FieldAnnotations;
  isInTable?: boolean;
}

export interface NestedObjectFieldProps {
  fieldPath: FieldPath;
  schema: FieldSchema;
  hideLabels: boolean;
  disabled: boolean;
  visibleOptionalFields: any;
  enableOptionalField: any;
  toggleOptionalField: any;
  unknowns: any;
  modifyUnknowns: any;
  form: any;
  parentRecord: any;
  useSelector: any;
}

export interface FieldAnnotations {
  [key: string]: {
    customActions?: CustomAction<any>[];
    gqlAssociationProps?: GqlAssociationProps;
  };
}

export interface GenericDataTableProps {
  // todo make generic / typed
  dtoClass: Constructable<any>;
  selectable?: SelectionType | null;
  filters?: any;
  useTableProps?: any;
  onSelectionChange?: (selectedRows: any[]) => void;
  editable?: boolean;
  customActions?: CustomAction<any>[];
  fieldAnnotations?: FieldAnnotations;
}

export interface RenderEditableCellProps {
  field: FieldSchema;
  preFieldPath?: FieldPath;
  hideLabels?: boolean;
  disabled: boolean;
  parentRecord: any;
  form?: any;
  setHasChanges: any;
  visibleOptionalFields?: Flags;
  enableOptionalField?: (path: FieldPath) => void;
  toggleOptionalField?: (path: FieldPath) => void;
  unknowns?: Unknowns;
  modifyUnknowns?: any;
  useSelector: any;
  fieldAnnotations?: FieldAnnotations;
}

export interface RenderFieldProps {
  schema: FieldSchema;
  preFieldPath: FieldPath;
  disabled: boolean;
  visibleOptionalFields?: Flags;
  hideLabels?: boolean;
  enableOptionalField?: (path: FieldPath) => void;
  toggleOptionalField?: (path: FieldPath) => void;
  unknowns?: Unknowns;
  modifyUnknowns?: any;
  form?: any;
  parentRecord?: any;
  useSelector: any;
  fieldAnnotations?: FieldAnnotations;
}

export interface TableWrapperProps<Model> extends TableProps<Model> {
  dtoClass: Constructable<Model>;
  useTableProps: any;
  selectable?: SelectionType | null;
  onSelectionChange?: (selectedRows: Model[]) => void;
  primaryKeyFieldName: string;
  columns: FieldSchema[];
  editingRecord: Model;
  filters?: any;
  dtoResourceType?: string;
  dtoGqlListQuery?: any;
  gqlQueryVariables?: any;
}

export interface TableWrapperRef<Model> {
  addRecordToTable: (record: Model) => void;
  removeNewRow: () => void;
  refreshTable: () => void;
}

export interface IDataModelTableProps<
  T extends AnyObject,
  U extends BaseRecord,
> {
  tableProps: TableProps<U>;
  columns: TableColumnsType<T>;
  hideCreateButton?: boolean;
  text?: string;
  buttonAction?: () => void;
}

// For any list views using DataModelTable
export interface IDataModelListProps {
  filters?: Record<string, any>;
  hideCreateButton?: boolean;
  hideActions?: boolean;
  parentView?: ResourceType;
}

export interface IActionsColumnEnhancedProps {
  record: any;
  dtoClass: any; // todo type
  actions: ColumnAction[];
  customActions?: CustomAction<any>[];
  onEdit?: (record: any) => void;
  onCancel?: MouseEventHandler<any>; // todo type
  onSave?: (record: any) => void; // todo type
  onDeleteSuccess?: () => void;
}

export interface CancelButtonProps {
  onCancel?: MouseEventHandler<HTMLElement>;
}

export interface IActionsColumnProps {
  record: any;
  idField?: string;
  gqlDeleteMutation?: DocumentNode;
  actions?: ColumnActionProps[];
  customActions?: CustomAction<any>[];
}

export interface ColumnActionProps {
  type: ColumnAction;
  override?: any; // Override the component that is already mapped in ColumnActionDefaultElements
}

export interface AssociatedViewProps<ParentModel, AssociatedModel>
  extends GqlAssociationProps {
  parentRecord: ParentModel; // record
  associatedRecordClass: Constructable<AssociatedModel>; // record class
}

export interface ValueDisplayProps {
  value: number | null | undefined;
  precision?: number; // Number of decimal places to round to
  prefix?: string; // Text to display before the value
  suffix?: string; // Text to display after the value
  color?: DefaultColors; // Color of the Tag
}
