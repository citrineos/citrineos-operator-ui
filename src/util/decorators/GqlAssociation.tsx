export const GQL_ASSOCIATION = 'gqlAssociation';

export interface GqlAssociationProps {
  /**
   * Field in parent record that contains the id to be used for the association
   */  
  parentIdFieldName: string;
  /**
   * Field in associated record that contains the id referencing the parent record
   */
  associatedIdFieldName: string; 
  /**
   * Query to perform to get the associated record
   */
  gqlQuery: any;
  /**
   * Query to perform to get the associated record list
   */
  gqlListQuery?: any;
  /**
   * Key in gqlQueryVariablesMap to use for adding query variables to query
   */
  gqlUseQueryVariablesKey?: string;
}

export const GqlAssociation = (props: GqlAssociationProps) => {
  return function (target: any, key: string) {
    Reflect.defineMetadata(GQL_ASSOCIATION, props, target, key);
  };
};
