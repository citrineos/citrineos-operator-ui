export const CLASS_GQL_CREATE_MUTATION = 'classGqlCreateMutation';

export const ClassGqlCreateMutation = (mutation: any): ClassDecorator => {
  return (target: Function) => {
    Reflect.defineMetadata(
      CLASS_GQL_CREATE_MUTATION,
      mutation,
      target.prototype,
    );
  };
};
