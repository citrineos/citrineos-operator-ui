import { useTable } from '@refinedev/antd';

import type { AdditionalInfosListQuery } from '../../graphql/types';
import { ADDITIONAL_INFOS_LIST_QUERY } from '../../queries/additionalInfo';
import { AdditionalInfos } from '../../graphql/schema.types';
import { DEFAULT_SORTERS } from '../../components/defaults';
import { DataModelTable, IDataModelListProps } from '../../components';
import { ADDITIONAL_INFOS_COLUMNS } from './table-config';
import { ResourceType } from '../../resource-type';

export const AdditionalInfosList = (props: IDataModelListProps) => {
  const { tableProps } = useTable<AdditionalInfosListQuery>({
    resource: ResourceType.ADDITIONAL_INFOS,
    sorters: DEFAULT_SORTERS,
    filters: props.filters,
    metaData: {
      gqlQuery: ADDITIONAL_INFOS_LIST_QUERY,
    },
  });

  return (
    <DataModelTable<AdditionalInfos, AdditionalInfosListQuery>
      tableProps={tableProps}
      columns={ADDITIONAL_INFOS_COLUMNS(!props.hideActions, props.parentView)}
      hideCreateButton={props.hideCreateButton}
    />
  );
};
