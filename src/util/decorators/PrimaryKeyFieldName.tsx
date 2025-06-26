// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export const PRIMARY_KEY_FIELD_NAME = 'primaryKeyFieldName';

export interface FieldNameAndIsEditable {
  fieldName: string;
  editableDuringCreate: boolean;
}

export const PrimaryKeyFieldName = (
  fieldName: string,
  editableDuringCreate = false,
): ClassDecorator => {
  return (target: Function) => {
    Reflect.defineMetadata(
      PRIMARY_KEY_FIELD_NAME,
      {
        fieldName,
        editableDuringCreate,
      } as FieldNameAndIsEditable,
      target.prototype,
    );
  };
};
