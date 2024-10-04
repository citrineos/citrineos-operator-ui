export const PRIMARY_KEY_FIELD_NAME = 'primaryKeyFieldName';

export const PrimaryKeyFieldName = (fieldName: string): ClassDecorator => {
  return (target: Function) => {
    Reflect.defineMetadata(PRIMARY_KEY_FIELD_NAME, fieldName, target.prototype);
  };
};
