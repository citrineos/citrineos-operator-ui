export const LABEL_FIELD = 'labelField';

export const LabelField = (field: any) => {
  return (target: Function) => {
    Reflect.defineMetadata(LABEL_FIELD, field, target.prototype);
  };
};
