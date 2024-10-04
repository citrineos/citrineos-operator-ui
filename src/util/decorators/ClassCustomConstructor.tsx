export const CLASS_CUSTOM_CONSTRUCTOR = 'classCustomConstructor';

export const ClassCustomConstructor = (
  constructorFunction: Function,
): ClassDecorator => {
  return (target: Function) => {
    Reflect.defineMetadata(
      CLASS_CUSTOM_CONSTRUCTOR,
      constructorFunction,
      target.prototype,
    );
  };
};
