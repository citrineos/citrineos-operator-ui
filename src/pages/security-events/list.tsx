import { useTable } from '@refinedev/antd';

import { SECURITY_EVENTS_LIST_QUERY } from './queries';
import { SecurityEvents } from '../../graphql/schema.types';
import { DEFAULT_SORTERS } from '../../components/defaults';
import { DataModelTable, IDataModelListProps } from '../../components';
import { SECURITY_EVENTS_COLUMNS } from './table-config';
import { ResourceType } from '../../resource-type';
import { SecurityEventsListQuery } from '../../graphql/types';

export const SecurityEventsList = (props: IDataModelListProps) => {
  const { tableProps } = useTable<SecurityEventsListQuery>({
    resource: ResourceType.SECURITY_EVENTS,
    sorters: DEFAULT_SORTERS,
    filters: props.filters,
    metaData: {
      gqlQuery: SECURITY_EVENTS_LIST_QUERY,
    },
  });

  return (
    <DataModelTable<SecurityEvents, SecurityEventsListQuery>
      tableProps={tableProps}
      columns={SECURITY_EVENTS_COLUMNS(!props.hideActions, props.parentView)}
      hideCreateButton={props.hideCreateButton}
    />
  );
};
