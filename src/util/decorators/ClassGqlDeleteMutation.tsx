export const CLASS_GQL_DELETE_MUTATION = 'classGqlDeleteMutation';

export const ClassGqlDeleteMutation = (mutation: any): ClassDecorator => {
  return (target: Function) => {
    Reflect.defineMetadata(
      CLASS_GQL_DELETE_MUTATION,
      mutation,
      target.prototype,
    );
  };
};
