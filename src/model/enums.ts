// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

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
}

export enum SelectMode {
  multiple = 'multiple',
  tags = 'tags',
}

export enum DefaultColors {
  LIME = 'lime',
  GOLD = 'gold',
  GREEN = 'green',
  MAGENTA = 'magenta',
  CYAN = 'cyan',
  VOLCANO = 'volcano',
  BLUE = 'blue',
  ORANGE = 'orange',
  GEEKBLUE = 'geekblue',
  RED = 'red',
  PURPLE = 'purple',
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

export enum SelectionType {
  SINGLE = 'single',
  MULTIPLE = 'multiple',
}

export enum GenericViewState {
  SHOW = 'show',
  EDIT = 'edit',
  CREATE = 'create',
}

export enum ColumnAction {
  DELETE = 'DELETE',
  EDIT = 'EDIT',
  SHOW = 'SHOW',
  SAVE = 'SAVE',
  CANCEL = 'CANCEL',
}

export enum AllowedConnectorTypes {
  Type1 = 'Type 1',
  Type2 = 'Type 2',
  CCS = 'CCS',
  CHAdeMO = 'CHAdeMO',
}

export enum DisallowedEvseIdPrefixes {
  EVSE1 = 'EVSE 1',
  EVSE2 = 'EVSE 2',
  EVSE3 = 'EVSE 3',
}
