import { useCallback, useMemo } from 'react';
import { Flex, GetProps, Input, Table } from 'antd';
import { useTable } from '@refinedev/antd';
import { EMPTY_FILTER } from '@util/consts';
import { useNavigation } from '@refinedev/core';
import { ResourceType } from '@util/auth';
import { getPlainToInstanceOptions } from '@util/tables';

import { BaseDtoProps } from '../../../dtos/base.dto';
import { AUTHORIZATIONS_LIST_QUERY } from '../queries';
import { AuthorizationDto } from '../../../dtos/authoriation.dto';
import { DebounceSearch } from '../../../components/debounce-search';
import { getAuthorizationFilters, getAuthorizationColumns } from '../columns';

type SearchProps = GetProps<typeof Input.Search>;

export const AuthorizationsList = () => {
  const { push } = useNavigation();

  const { tableProps, setFilters } = useTable<AuthorizationDto>({
    resource: ResourceType.AUTHORIZATIONS,
    sorters: {
      permanent: [{ field: BaseDtoProps.updatedAt, order: 'desc' }],
    },
    meta: {
      gqlQuery: AUTHORIZATIONS_LIST_QUERY,
    },
    queryOptions: getPlainToInstanceOptions(AuthorizationDto),
  });

  const onSearch: SearchProps['onSearch'] = useCallback(
    (value: string, _e?: any, _info?: any) => {
      if (!value || value === '') {
        setFilters(EMPTY_FILTER);
      } else {
        setFilters(getAuthorizationFilters(value));
      }
    },
    [setFilters],
  );

  const columns = useMemo(() => getAuthorizationColumns(push), [push]);

  return (
    <Flex vertical>
      <Flex justify="space-between" align="middle" className="header-row">
        <h2>Authorizations</h2>
        <Flex justify={'space-between'}>
          <DebounceSearch
            onSearch={onSearch}
            placeholder="Search Authorizations"
          />
        </Flex>
      </Flex>
      <Table rowKey="id" {...tableProps}>
        {columns}
      </Table>
    </Flex>
  );
};
