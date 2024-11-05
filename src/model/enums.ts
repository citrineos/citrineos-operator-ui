export enum FieldType {
  select,
  datetime,
  input,
  number,
  boolean,
  nestedObject,
  array,
  unknown,
  unknownProperty,
  unknownProperties,
  customRender,
  file,
  combinedRender,
}

export enum SelectMode {
  multiple = 'multiple',
  tags = 'tags',
}

export enum ReflectType {
  array,
  string,
  date,
  number,
  boolean,
  object,
  unknown,
  unknownProperty,
  unknownProperties,
}

export interface FieldSelectOption {
  label: string;
  value: string;
}

export enum SelectionType {
  SINGLE = 'single',
  MULTIPLE = 'multiple',
}

export enum GenericViewState {
  SHOW = 'show',
  EDIT = 'edit',
  CREATE = 'create',
}
