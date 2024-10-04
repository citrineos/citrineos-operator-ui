export const CLASS_GQL_LIST_QUERY = 'classGqlListQuery';

export const ClassGqlListQuery = (gqlQuery: any): ClassDecorator => {
  return (target: Function) => {
    Reflect.defineMetadata(CLASS_GQL_LIST_QUERY, gqlQuery, target.prototype);
  };
};
