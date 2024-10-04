export const GQL_ASSOCIATION = 'gqlAssociation';

export interface GqlAssociationProps {
  parentIdFieldName: string; // field in parent record that contains the id to be used for the association
  associatedIdFieldName: string; // field in associated record that contains the id referencing the parent record
  gqlQuery: any; // query to perform to get the associated record
  gqlListQuery?: any; // query to perform to get the associated record list
  gqlUseQueryVariablesKey?: string; // key in gqlQueryVariablesMap to use for adding query variables to query
}

export const GqlAssociation = (props: GqlAssociationProps) => {
  return function (target: any, key: string) {
    Reflect.defineMetadata(GQL_ASSOCIATION, props, target, key);
  };
};
