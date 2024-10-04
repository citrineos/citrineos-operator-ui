import { TableColumnsType } from 'antd';
import { ID_TOKENS_DELETE_MUTATION } from './queries';
import { ActionsColumn } from '../../components/data-model-table/actions-column';
import { getDefaultSortOrder } from '@refinedev/antd';
import { IdTokens } from '../../graphql/schema.types';
import { ExpandableColumn } from '../../components/data-model-table/expandable-column';
import { AuthorizationsList } from '../authorizations';
import { DEFAULT_EXPANDED_DATA_FILTER } from '../../components/defaults';
import { ResourceType } from '../../resource-type';

export const ID_TOKENS_COLUMNS = (
  withActions: boolean,
  parentView?: ResourceType,
) => {
  const baseColumns: TableColumnsType<IdTokens> = [
    {
      dataIndex: 'id',
      title: 'ID',
      sorter: { multiple: 2 },
    },
    {
      dataIndex: 'idToken',
      title: 'Id Token',
      sorter: { multiple: 1 },
      defaultSortOrder: getDefaultSortOrder('id'),
    },
    {
      dataIndex: 'type',
      title: 'Type',
    },
    {
      dataIndex: 'Authorizations.id',
      title: 'Authorization',
      render: (_: any, record: IdTokens) => {
        if (!record?.Authorization) {
          return '';
        }

        const authorizationId = record.Authorization.id;

        if (parentView === ResourceType.AUTHORIZATIONS) {
          return authorizationId;
        }

        const filter = DEFAULT_EXPANDED_DATA_FILTER(
          'id',
          'eq',
          authorizationId,
        );

        return (
          <ExpandableColumn
            initialContent={authorizationId}
            expandedContent={
              <AuthorizationsList
                filters={filter}
                hideCreateButton={true}
                hideActions={true}
                parentView={ResourceType.ID_TOKENS}
              />
            }
            viewTitle={`Authorizations linked to ID Token with ID ${record.id}`}
          />
        );
      },
    },
  ];

  if (withActions) {
    baseColumns.unshift({
      dataIndex: 'actions',
      title: 'Actions',
      className: 'actions-column',
      render: (_: any, record: IdTokens) => (
        <ActionsColumn
          record={record}
          gqlDeleteMutation={ID_TOKENS_DELETE_MUTATION}
        />
      ),
    });
  }

  return baseColumns;
};
