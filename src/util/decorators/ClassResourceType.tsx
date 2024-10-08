import { ResourceType } from '../../resource-type';

export const CLASS_RESOURCE_TYPE = 'classResourceType';

export const ClassResourceType = (
  resourceType: ResourceType,
): ClassDecorator => {
  return (target: Function) => {
    Reflect.defineMetadata(CLASS_RESOURCE_TYPE, resourceType, target.prototype);
  };
};
