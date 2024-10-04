import { ID_TOKENS_LIST_QUERY } from './queries';
import { DataModelTable, IDataModelListProps } from '../../components';
import { ID_TOKENS_COLUMNS } from './table-config';
import { IdTokens } from '../../graphql/schema.types';
import { IdTokensListQuery } from '../../graphql/types';
import { useTable } from '@refinedev/antd';
import { DEFAULT_SORTERS } from '../../components/defaults';
import { ResourceType } from '../../resource-type';

export const IdTokensList = (props: IDataModelListProps) => {
  const { tableProps } = useTable<IdTokensListQuery>({
    resource: ResourceType.ID_TOKENS,
    sorters: DEFAULT_SORTERS,
    filters: props.filters,
    metaData: {
      gqlQuery: ID_TOKENS_LIST_QUERY,
    },
  });

  return (
    <DataModelTable<IdTokens, IdTokensListQuery>
      tableProps={tableProps}
      columns={ID_TOKENS_COLUMNS(!props.hideActions, props.parentView)}
      hideCreateButton={props.hideCreateButton}
    />
  );
};
