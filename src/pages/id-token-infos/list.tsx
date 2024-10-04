import { ID_TOKEN_INFOS_LIST_QUERY } from './queries';
import { DataModelTable, IDataModelListProps } from '../../components';
import { ID_TOKEN_INFOS_COLUMNS } from './table-config';
import { IdTokenInfos } from '../../graphql/schema.types';
import { IdTokenInfosListQuery } from '../../graphql/types';
import { useTable } from '@refinedev/antd';
import { DEFAULT_SORTERS } from '../../components/defaults';
import { ResourceType } from '../../resource-type';

export const IdTokenInfosList = (props: IDataModelListProps) => {
  const { tableProps } = useTable<IdTokenInfosListQuery>({
    resource: ResourceType.ID_TOKEN_INFOS,
    sorters: DEFAULT_SORTERS,
    metaData: {
      gqlQuery: ID_TOKEN_INFOS_LIST_QUERY,
    },
  });

  return (
    <DataModelTable<IdTokenInfos, IdTokenInfosListQuery>
      tableProps={tableProps}
      columns={ID_TOKEN_INFOS_COLUMNS(!props.hideActions, props.parentView)}
      hideCreateButton={props.hideCreateButton}
    />
  );
};
