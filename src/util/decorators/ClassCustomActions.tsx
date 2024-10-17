import { CustomAction } from '../../components/custom-actions';

export const CLASS_CUSTOM_ACTIONS = 'classCustomActions';

export const ClassCustomActions = (
  customActions: CustomAction<any>[],
): ClassDecorator => {
  return (target: Function) => {
    Reflect.defineMetadata(
      CLASS_CUSTOM_ACTIONS,
      customActions,
      target.prototype,
    );
  };
};
