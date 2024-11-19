import { CustomAction } from '@interfaces';

export const FIELD_CUSTOM_ACTIONS = 'fieldCustomActions';

export const FieldCustomActions = (customActions: CustomAction<any>[]) => {
  return function (target: any, key: string) {
    Reflect.defineMetadata(FIELD_CUSTOM_ACTIONS, customActions, target, key);
  };
};
