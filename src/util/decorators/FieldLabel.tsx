export const FIELD_LABEL = 'fieldLabel';

export const FieldLabel = (label: string) => {
  return (target: any, key: string) => {
    Reflect.defineMetadata(FIELD_LABEL, label, target, key);
  };
};
