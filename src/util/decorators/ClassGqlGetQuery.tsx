export const CLASS_GQL_GET_QUERY = 'classGqlGetQuery';

export const ClassGqlGetQuery = (gqlQuery: any): ClassDecorator => {
  return (target: Function) => {
    Reflect.defineMetadata(CLASS_GQL_GET_QUERY, gqlQuery, target.prototype);
  };
};
