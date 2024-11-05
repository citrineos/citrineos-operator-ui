export const GQL_ASSOCIATION = 'gqlAssociation';

export interface QueryWithVariableGetter {
  /**
   * Grapql query
   */
  query: any;
  /**
   * Set a method to generate the query variables using the parent record
   * @param record
   */
  getQueryVariables?: (record: any, useSelector: any) => object;
}

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
  gqlQuery: QueryWithVariableGetter;
  /**
   * Query to perform to get the associated record list
   */
  gqlListQuery?: QueryWithVariableGetter;
  /**
   * Query to perform to get the associated record list returning only items that
   * are already selected / associated
   */
  gqlListSelectedQuery?: QueryWithVariableGetter;
}

export const GqlAssociation = (props: GqlAssociationProps) => {
  return function (target: any, key: string) {
    Reflect.defineMetadata(GQL_ASSOCIATION, props, target, key);
  };
};
