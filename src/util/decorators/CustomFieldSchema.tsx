import { FieldSchema } from '../../components/form';

export const CUSTOM_FIELD_SCHEMA = 'customFieldSchema';

export const CustomFieldSchema = (schema: FieldSchema) => {
  return function (target: any, key: string) {
    Reflect.defineMetadata(CUSTOM_FIELD_SCHEMA, schema, target, key);
  };
};
