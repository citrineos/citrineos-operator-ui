// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { useTable } from '@refinedev/antd';

import { SECURITY_EVENTS_LIST_QUERY } from './queries';
import { SecurityEvents } from '../../graphql/schema.types';
import { DEFAULT_SORTERS } from '../../components/defaults';
import { DataModelTable } from '../../components';
import { IDataModelListProps } from '../../model/interfaces';
import { SECURITY_EVENTS_COLUMNS } from './table-config';
import { ResourceType } from '@util/auth';
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
