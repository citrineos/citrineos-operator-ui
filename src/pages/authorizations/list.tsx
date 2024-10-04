import type { AuthorizationsListQuery } from '../../graphql/types';
import { AUTHORIZATIONS_LIST_QUERY } from './queries';
import { DataModelTable, IDataModelListProps } from '../../components';
import { Authorizations } from '../../graphql/schema.types';
import { AUTHORIZATIONS_COLUMNS } from './table-config';
import { useTable } from '@refinedev/antd';
import { DEFAULT_SORTERS } from '../../components/defaults';
import { ResourceType } from '../../resource-type';

export const AuthorizationsList = (props: IDataModelListProps) => {
  const { tableProps } = useTable<AuthorizationsListQuery>({
    resource: ResourceType.AUTHORIZATIONS,
    sorters: DEFAULT_SORTERS,
    filters: props.filters,
    metaData: {
      gqlQuery: AUTHORIZATIONS_LIST_QUERY,
    },
  });

  return (
    <DataModelTable<Authorizations, AuthorizationsListQuery>
      tableProps={tableProps}
      columns={AUTHORIZATIONS_COLUMNS(!props.hideActions, props.parentView)}
      hideCreateButton={props.hideCreateButton}
    />
  );
};
