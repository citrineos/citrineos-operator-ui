// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

export const GQL_ASSOCIATION = 'gqlAssociation';
export const GQL_CLASS_ASSOCIATED_FIELDS = 'gqlClassAssociatedFields';

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
   * If set to true, will attempt to pass 'newAssociatedIds' variable to the mutation
   */
  hasNewAssociatedIdsVariable?: boolean;
  /**
   * Query to perform to get the associated record
   */
  gqlQuery?: QueryWithVariableGetter;
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
    const existingAssociatedFields: Set<string> =
      Reflect.getMetadata(GQL_CLASS_ASSOCIATED_FIELDS, target.constructor) ||
      new Set<string>();
    existingAssociatedFields.add(key);
    Reflect.defineMetadata(
      GQL_CLASS_ASSOCIATED_FIELDS,
      existingAssociatedFields,
      target.constructor,
    );
  };
};

export const getAssociatedFields = (target: any): Set<string> => {
  if (!target) return new Set<string>();
  return (
    Reflect.getMetadata(GQL_CLASS_ASSOCIATED_FIELDS, target) ||
    new Set<string>()
  );
};
